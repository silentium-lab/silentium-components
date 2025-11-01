import { Event, Primitive, Transport, Shared, Filtered, isFilled, Late, Applied, All, SharedSource, ExecutorApplied, LateShared, Of, DestroyContainer, isDestroyable, TransportEvent, TransportDestroyable } from 'silentium';

function Branch($condition, $left, $right) {
  return Event((transport) => {
    const left = Primitive($left);
    let right;
    if ($right !== void 0) {
      right = Primitive($right);
    }
    $condition.event(
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
  return Event((transport) => {
    let destructor;
    $condition.event(
      Transport((v) => {
        if (destructor !== void 0 && typeof destructor === "function") {
          destructor();
        }
        let instance;
        if (v) {
          instance = $left.use();
        } else if ($right) {
          instance = $right.use();
        }
        if (instance !== void 0) {
          instance.event(transport);
          destructor = instance.destroy;
        }
      })
    );
    return () => {
      destructor?.();
    };
  });
}

function Constant(permanent, $trigger) {
  return Event((transport) => {
    $trigger.event(
      Transport(() => {
        transport.use(permanent);
      })
    );
  });
}

function Deadline(error, $base, $timeout) {
  return Event((transport) => {
    let timer = 0;
    const base = Shared($base, true);
    $timeout.event(
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
        f.event(transport);
        base.event(
          Transport(() => {
            timeoutReached = true;
          })
        );
      })
    );
  });
}

function Deferred($base, $trigger) {
  return Event((transport) => {
    const base = Primitive($base);
    $trigger.event(
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
  return Event((transport) => {
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
  event(transport) {
    const $comparing = Applied(this.$comparing, this.cloner);
    All($comparing, this.$base).event(
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
  return Event((transport) => {
    $loadingStart.event(Transport(() => transport.use(true)));
    $loadingFinish.event(Transport(() => transport.use(false)));
  });
}

function Lock($base, $lock) {
  return Event((transport) => {
    let locked = false;
    $lock.event(
      Transport((newLock) => {
        locked = newLock;
      })
    );
    const i = Filtered($base, () => !locked);
    i.event(transport);
  });
}

function Memo($base) {
  return Event((transport) => {
    let last = null;
    $base.event(
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
  return Event((transport) => {
    let first = false;
    $base.event(
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
  return new PartEvent($base, $key);
}
class PartEvent {
  constructor($base, $key) {
    __publicField$1(this, "$base");
    __publicField$1(this, "$keyed");
    this.$base = SharedSource($base);
    this.$keyed = Shared($key);
  }
  event(transport) {
    All(this.$base, this.$keyed).event(
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
  return Event((transport) => {
    All($base, $keyed).event(
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
  return Event((transport) => {
    $trigger.event(
      Transport(() => {
        $base.event(transport);
      })
    );
  });
}

function Shot($target, $trigger) {
  return Event((transport) => {
    const targetSync = Primitive($target);
    targetSync.primitive();
    $trigger.event(
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
  return Event((transport) => {
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
    }).event(transport);
  });
}

function Tick($base) {
  return Event((transport) => {
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
    $base.event(
      Transport((v) => {
        lastValue = v;
        if (!microtaskScheduled) {
          scheduleMicrotask();
        }
      })
    );
  });
}

function Transaction($base, eventBuilder, ...args) {
  return Event((transport) => {
    const $res = LateShared();
    const destructors = [];
    $base.event(
      Transport((v) => {
        const $event = eventBuilder(Of(v), ...args.map((a) => Detached(a)));
        destructors.push($event);
        $event.event($res);
      })
    );
    $res.event(transport);
    return () => {
      destructors.forEach((d) => d?.destroy());
      destructors.length = 0;
    };
  });
}

function HashTable($base) {
  return Event((transport) => {
    const record = {};
    $base.event(
      Transport(([key, value]) => {
        record[key] = value;
        transport.use(record);
      })
    );
  });
}

function RecordOf(record) {
  return Event((transport) => {
    const keys = Object.keys(record);
    All(...Object.values(record)).event(
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
  return Event((transport) => {
    All(joinPartSrc, ...sources).event(
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
  return new TemplateEvent($src, $places);
}
class TemplateEvent {
  constructor($src = Of(""), $places = Of({})) {
    this.$src = $src;
    this.$places = $places;
    __publicField(this, "dc", DestroyContainer());
    __publicField(this, "vars", {
      $TPL: Of("$TPL")
    });
  }
  event(transport) {
    const $vars = RecordOf(this.vars);
    Applied(All(this.$src, this.$places, $vars), ([base, rules, vars]) => {
      Object.entries(rules).forEach(([ph, val]) => {
        base = base.replaceAll(ph, String(val));
      });
      Object.entries(vars).forEach(([ph, val]) => {
        base = base.replaceAll(ph, String(val));
      });
      return base;
    }).event(transport);
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
    return this;
  }
}

function RegexpMatched(patternSrc, valueSrc, flagsSrc = Of("")) {
  return Event((transport) => {
    All(patternSrc, valueSrc, flagsSrc).event(
      Transport(([pattern, value, flags]) => {
        transport.use(new RegExp(pattern, flags).test(value));
      })
    );
  });
}

function RegexpReplaced(valueSrc, patternSrc, replaceValueSrc, flagsSrc = Of("")) {
  return Event((transport) => {
    All(patternSrc, valueSrc, replaceValueSrc, flagsSrc).event(
      Transport(([pattern, value, replaceValue, flags]) => {
        transport.use(
          String(value).replace(new RegExp(pattern, flags), replaceValue)
        );
      })
    );
  });
}

function RegexpMatch(patternSrc, valueSrc, flagsSrc = Of("")) {
  return Event((transport) => {
    All(patternSrc, valueSrc, flagsSrc).event(
      Transport(([pattern, value, flags]) => {
        const result = new RegExp(pattern, flags).exec(value);
        transport.use(result ?? []);
      })
    );
  });
}

function Set(baseSrc, keySrc, valueSrc) {
  return Event((transport) => {
    All(baseSrc, keySrc, valueSrc).event(
      Transport(([base, key, value]) => {
        base[key] = value;
        transport.use(base);
      })
    );
  });
}

const $empty = TransportEvent(() => Of(false));
function Router($url, $routes, $default) {
  return Event((transport) => {
    const destructors = [];
    const destructor = () => {
      destructors.forEach((d) => d.destroy());
      destructors.length = 0;
    };
    All($routes, $url).event(
      Transport(([routes, url]) => {
        destructor();
        const instance = All(
          $default.use(),
          All(
            ...routes.map((r) => {
              const $template = TransportDestroyable(r.event);
              destructors.push($template);
              return BranchLazy(
                RegexpMatched(
                  Of(r.pattern),
                  Of(url),
                  r.patternFlags ? Of(r.patternFlags) : void 0
                ),
                $template,
                $empty
              );
            })
          )
        );
        Applied(instance, (r) => {
          const first = r[1].find((r2) => r2 !== false);
          if (first) {
            return first;
          }
          return r[0];
        }).event(transport);
      })
    );
    return destructor;
  });
}

function And($one, $two) {
  return Event((transport) => {
    All($one, $two).event(
      Transport(([one, two]) => {
        transport.use(one && two);
      })
    );
  });
}

function Or($one, $two) {
  return Event((transport) => {
    All($one, $two).event(
      Transport(([one, two]) => {
        transport.use(one || two);
      })
    );
  });
}

function Not($base) {
  return Event((transport) => {
    $base.event(
      Transport((v) => {
        transport.use(!v);
      })
    );
  });
}

function Bool($base) {
  return Event((transport) => {
    Applied($base, Boolean).event(transport);
  });
}

function FromJson($json, error) {
  return Event((transport) => {
    $json.event(
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
  return Event((transport) => {
    $data.event(
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
  return Event((transport) => {
    Applied($base, (a) => a[0]).event(transport);
  });
}

export { And, Bool, Branch, BranchLazy, Concatenated, Constant, Deadline, Deferred, Detached, Dirty, First, FromJson, HashTable, Loading, Lock, Memo, Not, OnlyChanged, Or, Part, Path, Polling, RecordOf, RegexpMatch, RegexpMatched, RegexpReplaced, Router, Set, Shot, Task, Template, Tick, ToJson, Transaction };
//# sourceMappingURL=silentium-components.mjs.map
