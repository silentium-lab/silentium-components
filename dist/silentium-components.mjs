import { Message, Primitive, Transport, DestroyContainer, Shared, Filtered, isFilled, Late, Applied, All, SharedSource, ExecutorApplied, LateShared, Of, isMessage, isDestroyable } from 'silentium';

function Branch($condition, $left, $right) {
  return Message((transport) => {
    const left = Primitive($left);
    let right;
    if ($right !== void 0) {
      right = Primitive($right);
    }
    $condition.to(
      Transport((v) => {
        let result = null;
        if (v) {
          result = left.primitive();
        } else if (right) {
          result = right.primitive();
        }
        if (result !== null) {
          transport.use(result);
        }
      })
    );
  });
}

function BranchLazy($condition, $left, $right) {
  return Message((transport) => {
    const dc = DestroyContainer();
    const destructor = () => {
      dc.destroy();
    };
    $condition.to(
      Transport((v) => {
        destructor();
        let instance;
        if (v) {
          instance = $left.use();
        } else if ($right) {
          instance = $right.use();
        }
        if (instance !== void 0) {
          instance.to(transport);
          dc.add(instance);
        }
      })
    );
    return destructor;
  });
}

function Constant(permanent, $trigger) {
  return Message((transport) => {
    $trigger.to(
      Transport(() => {
        transport.use(permanent);
      })
    );
  });
}

function Deadline(error, $base, $timeout) {
  return Message((transport) => {
    let timer = 0;
    const base = Shared($base, true);
    $timeout.to(
      Transport((timeout) => {
        if (timer) {
          clearTimeout(timer);
        }
        let timeoutReached = false;
        timer = setTimeout(() => {
          if (timeoutReached) {
            return;
          }
          timeoutReached = true;
          error.use(new Error("Timeout reached in Deadline"));
        }, timeout);
        const f = Filtered(base, () => !timeoutReached);
        f.to(transport);
        base.to(
          Transport(() => {
            timeoutReached = true;
          })
        );
      })
    );
  });
}

function Deferred($base, $trigger) {
  return Message((transport) => {
    const base = Primitive($base);
    $trigger.to(
      Transport(() => {
        const value = base.primitive();
        if (isFilled(value)) {
          transport.use(value);
        }
      })
    );
  });
}

function Detached($base) {
  return Message((transport) => {
    const v = Primitive($base).primitive();
    if (isFilled(v)) {
      transport.use(v);
    }
  });
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
function Dirty($base, keep = [], exclude = [], cloner) {
  return new DirtySource($base, keep, exclude, cloner);
}
class DirtySource {
  constructor($base, keep = [], exclude = [], cloner) {
    this.$base = $base;
    this.keep = keep;
    this.exclude = exclude;
    __publicField$2(this, "$comparing", Late());
    __publicField$2(this, "cloner");
    if (cloner === void 0) {
      this.cloner = (value) => JSON.parse(JSON.stringify(value));
    } else {
      this.cloner = cloner;
    }
  }
  to(transport) {
    const $comparing = Applied(this.$comparing, this.cloner);
    All($comparing, this.$base).to(
      Transport(([comparing, base]) => {
        if (!comparing) {
          return;
        }
        transport.use(
          Object.fromEntries(
            Object.entries(comparing).filter(([key, value]) => {
              if (this.keep.includes(key)) {
                return true;
              }
              if (this.exclude.includes(key)) {
                return false;
              }
              return value !== base[key];
            })
          )
        );
      })
    );
    return this;
  }
  use(v) {
    this.$comparing.use(v);
    return this;
  }
}

function Loading($loadingStart, $loadingFinish) {
  return Message((transport) => {
    $loadingStart.to(Transport(() => transport.use(true)));
    $loadingFinish.to(Transport(() => transport.use(false)));
  });
}

function Lock($base, $lock) {
  return Message((transport) => {
    let locked = false;
    $lock.to(
      Transport((newLock) => {
        locked = newLock;
      })
    );
    const i = Filtered($base, () => !locked);
    i.to(transport);
  });
}

function Memo($base) {
  return Message((transport) => {
    let last = null;
    $base.to(
      Transport((v) => {
        if (v !== last && isFilled(v)) {
          transport.use(v);
          last = v;
        }
      })
    );
  });
}

function OnlyChanged($base) {
  return Message((transport) => {
    let first = false;
    $base.to(
      Transport((v) => {
        if (first === false) {
          first = true;
        } else {
          transport.use(v);
        }
      })
    );
  });
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
function Part($base, $key) {
  return new PartImpl($base, $key);
}
class PartImpl {
  constructor($base, $key) {
    __publicField$1(this, "$base");
    __publicField$1(this, "$keyed");
    this.$base = SharedSource($base);
    this.$keyed = Shared($key);
  }
  to(transport) {
    All(this.$base, this.$keyed).to(
      Transport(([base, keyed]) => {
        const keys = keyed.split(".");
        let value = base;
        keys.forEach((key) => {
          value = value[key];
        });
        if (value !== void 0 && value !== base) {
          transport.use(value);
        }
      })
    );
    return this;
  }
  use(value) {
    const key = Primitive(this.$keyed);
    if (isFilled(key)) {
      const base = Primitive(this.$base);
      this.$base.use({
        ...base.primitiveWithException(),
        [key.primitiveWithException()]: value
      });
    }
    return this;
  }
}

function Path($base, $keyed) {
  return Message((transport) => {
    All($base, $keyed).to(
      Transport(([base, keyed]) => {
        const keys = keyed.split(".");
        let value = base;
        keys.forEach((key) => {
          value = value[key];
        });
        if (value !== void 0 && value !== base) {
          transport.use(value);
        }
      })
    );
  });
}

function Polling($base, $trigger) {
  return Message((transport) => {
    $trigger.to(
      Transport(() => {
        $base.to(transport);
      })
    );
  });
}

function Shot($target, $trigger) {
  return Message((transport) => {
    const targetSync = Primitive($target);
    targetSync.primitive();
    $trigger.to(
      Transport(() => {
        const value = targetSync.primitive();
        if (isFilled(value)) {
          transport.use(value);
        }
      })
    );
  });
}

function Task(baseSrc, delay = 0) {
  return Message((transport) => {
    let prevTimer = null;
    ExecutorApplied(baseSrc, (fn) => {
      return (v) => {
        if (prevTimer) {
          clearTimeout(prevTimer);
        }
        prevTimer = setTimeout(() => {
          fn(v);
        }, delay);
      };
    }).to(transport);
  });
}

function Tick($base) {
  return Message((transport) => {
    let microtaskScheduled = false;
    let lastValue = null;
    const scheduleMicrotask = () => {
      microtaskScheduled = true;
      queueMicrotask(() => {
        microtaskScheduled = false;
        if (lastValue !== null) {
          transport.use(lastValue);
          lastValue = null;
        }
      });
    };
    $base.to(
      Transport((v) => {
        lastValue = v;
        if (!microtaskScheduled) {
          scheduleMicrotask();
        }
      })
    );
  });
}

function Transaction($base, builder, ...args) {
  return Message((transport) => {
    const $res = LateShared();
    const destructors = [];
    $base.to(
      Transport((v) => {
        const $msg = builder(Of(v), ...args.map((a) => Detached(a)));
        destructors.push($msg);
        $msg.to($res);
      })
    );
    $res.to(transport);
    return () => {
      destructors.forEach((d) => d?.destroy());
      destructors.length = 0;
    };
  });
}

function HashTable($base) {
  return Message((transport) => {
    const record = {};
    $base.to(
      Transport(([key, value]) => {
        record[key] = value;
        transport.use(record);
      })
    );
  });
}

function Record(record) {
  return Message((transport) => {
    const keys = Object.keys(record);
    keys.forEach((key) => {
      if (!isMessage(record[key])) {
        record[key] = Of(record[key]);
      }
    });
    All(...Object.values(record)).to(
      Transport((entries) => {
        const record2 = {};
        entries.forEach((entry, index) => {
          record2[keys[index]] = entry;
        });
        transport.use(record2);
      })
    );
  });
}

function Concatenated(sources, joinPartSrc = Of("")) {
  return Message((transport) => {
    All(joinPartSrc, ...sources).to(
      Transport(([joinPart, ...strings]) => {
        transport.use(strings.join(joinPart));
      })
    );
  });
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function Template($src = Of(""), $places = Of({})) {
  return new TemplateImpl($src, $places);
}
class TemplateImpl {
  constructor($src = Of(""), $places = Of({})) {
    this.$src = $src;
    this.$places = $places;
    __publicField(this, "dc", DestroyContainer());
    __publicField(this, "vars", {
      $TPL: Of("$TPL")
    });
  }
  to(transport) {
    const $vars = Record(this.vars);
    Applied(All(this.$src, this.$places, $vars), ([base, rules, vars]) => {
      Object.entries(rules).forEach(([ph, val]) => {
        base = base.replaceAll(ph, String(val));
      });
      Object.entries(vars).forEach(([ph, val]) => {
        base = base.replaceAll(ph, String(val));
      });
      return base;
    }).to(transport);
    return this;
  }
  template(value) {
    this.$src = Of(value);
  }
  /**
   * Ability to register variable
   * in concrete place Of template
   */
  var(src) {
    const places = Object.keys(this.vars).length;
    const varName = `$var${places}`;
    if (isDestroyable(src)) {
      this.dc.add(src);
    }
    this.vars[varName] = src;
    return varName;
  }
  destroy() {
    this.dc.destroy();
    return this;
  }
}

function RegexpMatched(patternSrc, valueSrc, flagsSrc = Of("")) {
  return Message((transport) => {
    All(patternSrc, valueSrc, flagsSrc).to(
      Transport(([pattern, value, flags]) => {
        transport.use(new RegExp(pattern, flags).test(value));
      })
    );
  });
}

function RegexpReplaced(valueSrc, patternSrc, replaceValueSrc, flagsSrc = Of("")) {
  return Message((transport) => {
    All(patternSrc, valueSrc, replaceValueSrc, flagsSrc).to(
      Transport(([pattern, value, replaceValue, flags]) => {
        transport.use(
          String(value).replace(new RegExp(pattern, flags), replaceValue)
        );
      })
    );
  });
}

function RegexpMatch(patternSrc, valueSrc, flagsSrc = Of("")) {
  return Message((transport) => {
    All(patternSrc, valueSrc, flagsSrc).to(
      Transport(([pattern, value, flags]) => {
        const result = new RegExp(pattern, flags).exec(value);
        transport.use(result ?? []);
      })
    );
  });
}

function Set(baseSrc, keySrc, valueSrc) {
  return Message((transport) => {
    All(baseSrc, keySrc, valueSrc).to(
      Transport(([base, key, value]) => {
        base[key] = value;
        transport.use(base);
      })
    );
  });
}

function Router($url, $routes, $default) {
  return Message((transport) => {
    const dc = DestroyContainer();
    const destructor = () => {
      dc.destroy();
    };
    All($routes, $url).to(
      Transport(([routes, url]) => {
        destructor();
        const $matches = All(
          ...routes.map(
            (r) => RegexpMatched(
              Of(r.pattern),
              Of(url),
              r.patternFlags ? Of(r.patternFlags) : void 0
            )
          )
        );
        $matches.to(
          Transport((matches) => {
            const index = matches.findIndex((v) => v === true);
            if (index === -1) {
              const instance = $default.use();
              dc.add(instance);
              instance.to(transport);
            }
            if (index > -1) {
              const instance = routes[index].message.use();
              dc.add(instance);
              instance.to(transport);
            }
          })
        );
      })
    );
    return destructor;
  });
}

function And($one, $two) {
  return Message((transport) => {
    All($one, $two).to(
      Transport(([one, two]) => {
        transport.use(one && two);
      })
    );
  });
}

function Or($one, $two) {
  return Message((transport) => {
    All($one, $two).to(
      Transport(([one, two]) => {
        transport.use(one || two);
      })
    );
  });
}

function Not($base) {
  return Message((transport) => {
    $base.to(
      Transport((v) => {
        transport.use(!v);
      })
    );
  });
}

function Bool($base) {
  return Message((transport) => {
    Applied($base, Boolean).to(transport);
  });
}

function FromJson($json, error) {
  return Message((transport) => {
    $json.to(
      Transport((json) => {
        try {
          transport.use(JSON.parse(json));
        } catch (e) {
          error?.use(new Error(`Failed to parse JSON: ${e}`));
        }
      })
    );
  });
}

function ToJson($data, error) {
  return Message((transport) => {
    $data.to(
      Transport((data) => {
        try {
          transport.use(JSON.stringify(data));
        } catch {
          error?.use(new Error("Failed to convert to JSON"));
        }
      })
    );
  });
}

function First($base) {
  return Message((transport) => {
    Applied($base, (a) => a[0]).to(transport);
  });
}

export { And, Bool, Branch, BranchLazy, Concatenated, Constant, Deadline, Deferred, Detached, Dirty, First, FromJson, HashTable, Loading, Lock, Memo, Not, OnlyChanged, Or, Part, Path, Polling, Record, RegexpMatch, RegexpMatched, RegexpReplaced, Router, Set, Shot, Task, Template, Tick, ToJson, Transaction };
//# sourceMappingURL=silentium-components.mjs.map
