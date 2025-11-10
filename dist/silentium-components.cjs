'use strict';

var silentium = require('silentium');

function Branch($condition, $left, $right) {
  return silentium.Event((transport) => {
    const left = silentium.Primitive($left);
    let right;
    if ($right !== void 0) {
      right = silentium.Primitive($right);
    }
    $condition.event(
      silentium.Transport((v) => {
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
  return silentium.Event((transport) => {
    const dc = silentium.DestroyContainer();
    const destructor = () => {
      dc.destroy();
    };
    $condition.event(
      silentium.Transport((v) => {
        destructor();
        let instance;
        if (v) {
          instance = $left.use();
        } else if ($right) {
          instance = $right.use();
        }
        if (instance !== void 0) {
          instance.event(transport);
          dc.add(instance);
        }
      })
    );
    return destructor;
  });
}

function Constant(permanent, $trigger) {
  return silentium.Event((transport) => {
    $trigger.event(
      silentium.Transport(() => {
        transport.use(permanent);
      })
    );
  });
}

function Deadline(error, $base, $timeout) {
  return silentium.Event((transport) => {
    let timer = 0;
    const base = silentium.Shared($base, true);
    $timeout.event(
      silentium.Transport((timeout) => {
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
        const f = silentium.Filtered(base, () => !timeoutReached);
        f.event(transport);
        base.event(
          silentium.Transport(() => {
            timeoutReached = true;
          })
        );
      })
    );
  });
}

function Deferred($base, $trigger) {
  return silentium.Event((transport) => {
    const base = silentium.Primitive($base);
    $trigger.event(
      silentium.Transport(() => {
        const value = base.primitive();
        if (silentium.isFilled(value)) {
          transport.use(value);
        }
      })
    );
  });
}

function Detached($base) {
  return silentium.Event((transport) => {
    const v = silentium.Primitive($base).primitive();
    if (silentium.isFilled(v)) {
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
    __publicField$2(this, "$comparing", silentium.Late());
    __publicField$2(this, "cloner");
    if (cloner === void 0) {
      this.cloner = (value) => JSON.parse(JSON.stringify(value));
    } else {
      this.cloner = cloner;
    }
  }
  event(transport) {
    const $comparing = silentium.Applied(this.$comparing, this.cloner);
    silentium.All($comparing, this.$base).event(
      silentium.Transport(([comparing, base]) => {
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
  return silentium.Event((transport) => {
    $loadingStart.event(silentium.Transport(() => transport.use(true)));
    $loadingFinish.event(silentium.Transport(() => transport.use(false)));
  });
}

function Lock($base, $lock) {
  return silentium.Event((transport) => {
    let locked = false;
    $lock.event(
      silentium.Transport((newLock) => {
        locked = newLock;
      })
    );
    const i = silentium.Filtered($base, () => !locked);
    i.event(transport);
  });
}

function Memo($base) {
  return silentium.Event((transport) => {
    let last = null;
    $base.event(
      silentium.Transport((v) => {
        if (v !== last && silentium.isFilled(v)) {
          transport.use(v);
          last = v;
        }
      })
    );
  });
}

function OnlyChanged($base) {
  return silentium.Event((transport) => {
    let first = false;
    $base.event(
      silentium.Transport((v) => {
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
    this.$base = silentium.SharedSource($base);
    this.$keyed = silentium.Shared($key);
  }
  event(transport) {
    silentium.All(this.$base, this.$keyed).event(
      silentium.Transport(([base, keyed]) => {
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
    const key = silentium.Primitive(this.$keyed);
    if (silentium.isFilled(key)) {
      const base = silentium.Primitive(this.$base);
      this.$base.use({
        ...base.primitiveWithException(),
        [key.primitiveWithException()]: value
      });
    }
    return this;
  }
}

function Path($base, $keyed) {
  return silentium.Event((transport) => {
    silentium.All($base, $keyed).event(
      silentium.Transport(([base, keyed]) => {
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
  return silentium.Event((transport) => {
    $trigger.event(
      silentium.Transport(() => {
        $base.event(transport);
      })
    );
  });
}

function Shot($target, $trigger) {
  return silentium.Event((transport) => {
    const targetSync = silentium.Primitive($target);
    targetSync.primitive();
    $trigger.event(
      silentium.Transport(() => {
        const value = targetSync.primitive();
        if (silentium.isFilled(value)) {
          transport.use(value);
        }
      })
    );
  });
}

function Task(baseSrc, delay = 0) {
  return silentium.Event((transport) => {
    let prevTimer = null;
    silentium.ExecutorApplied(baseSrc, (fn) => {
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
  return silentium.Event((transport) => {
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
      silentium.Transport((v) => {
        lastValue = v;
        if (!microtaskScheduled) {
          scheduleMicrotask();
        }
      })
    );
  });
}

function Transaction($base, eventBuilder, ...args) {
  return silentium.Event((transport) => {
    const $res = silentium.LateShared();
    const destructors = [];
    $base.event(
      silentium.Transport((v) => {
        const $event = eventBuilder(silentium.Of(v), ...args.map((a) => Detached(a)));
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
  return silentium.Event((transport) => {
    const record = {};
    $base.event(
      silentium.Transport(([key, value]) => {
        record[key] = value;
        transport.use(record);
      })
    );
  });
}

function RecordOf(record) {
  return silentium.Event((transport) => {
    const keys = Object.keys(record);
    silentium.All(...Object.values(record)).event(
      silentium.Transport((entries) => {
        const record2 = {};
        entries.forEach((entry, index) => {
          record2[keys[index]] = entry;
        });
        transport.use(record2);
      })
    );
  });
}

function Concatenated(sources, joinPartSrc = silentium.Of("")) {
  return silentium.Event((transport) => {
    silentium.All(joinPartSrc, ...sources).event(
      silentium.Transport(([joinPart, ...strings]) => {
        transport.use(strings.join(joinPart));
      })
    );
  });
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function Template($src = silentium.Of(""), $places = silentium.Of({})) {
  return new TemplateEvent($src, $places);
}
class TemplateEvent {
  constructor($src = silentium.Of(""), $places = silentium.Of({})) {
    this.$src = $src;
    this.$places = $places;
    __publicField(this, "dc", silentium.DestroyContainer());
    __publicField(this, "vars", {
      $TPL: silentium.Of("$TPL")
    });
  }
  event(transport) {
    const $vars = RecordOf(this.vars);
    silentium.Applied(silentium.All(this.$src, this.$places, $vars), ([base, rules, vars]) => {
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
    this.$src = silentium.Of(value);
  }
  /**
   * Ability to register variable
   * in concrete place Of template
   */
  var(src) {
    const places = Object.keys(this.vars).length;
    const varName = `$var${places}`;
    if (silentium.isDestroyable(src)) {
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

function RegexpMatched(patternSrc, valueSrc, flagsSrc = silentium.Of("")) {
  return silentium.Event((transport) => {
    silentium.All(patternSrc, valueSrc, flagsSrc).event(
      silentium.Transport(([pattern, value, flags]) => {
        transport.use(new RegExp(pattern, flags).test(value));
      })
    );
  });
}

function RegexpReplaced(valueSrc, patternSrc, replaceValueSrc, flagsSrc = silentium.Of("")) {
  return silentium.Event((transport) => {
    silentium.All(patternSrc, valueSrc, replaceValueSrc, flagsSrc).event(
      silentium.Transport(([pattern, value, replaceValue, flags]) => {
        transport.use(
          String(value).replace(new RegExp(pattern, flags), replaceValue)
        );
      })
    );
  });
}

function RegexpMatch(patternSrc, valueSrc, flagsSrc = silentium.Of("")) {
  return silentium.Event((transport) => {
    silentium.All(patternSrc, valueSrc, flagsSrc).event(
      silentium.Transport(([pattern, value, flags]) => {
        const result = new RegExp(pattern, flags).exec(value);
        transport.use(result ?? []);
      })
    );
  });
}

function Set(baseSrc, keySrc, valueSrc) {
  return silentium.Event((transport) => {
    silentium.All(baseSrc, keySrc, valueSrc).event(
      silentium.Transport(([base, key, value]) => {
        base[key] = value;
        transport.use(base);
      })
    );
  });
}

function Router($url, $routes, $default) {
  return silentium.Event((transport) => {
    const dc = silentium.DestroyContainer();
    const destructor = () => {
      dc.destroy();
    };
    silentium.All($routes, $url).event(
      silentium.Transport(([routes, url]) => {
        destructor();
        const $matches = silentium.All(
          ...routes.map(
            (r) => RegexpMatched(
              silentium.Of(r.pattern),
              silentium.Of(url),
              r.patternFlags ? silentium.Of(r.patternFlags) : void 0
            )
          )
        );
        $matches.event(
          silentium.Transport((matches) => {
            const index = matches.findIndex((v) => v === true);
            if (index === -1) {
              const instance = $default.use();
              dc.add(instance);
              instance.event(transport);
            }
            if (index > -1) {
              const instance = routes[index].event.use();
              dc.add(instance);
              instance.event(transport);
            }
          })
        );
      })
    );
    return destructor;
  });
}

function And($one, $two) {
  return silentium.Event((transport) => {
    silentium.All($one, $two).event(
      silentium.Transport(([one, two]) => {
        transport.use(one && two);
      })
    );
  });
}

function Or($one, $two) {
  return silentium.Event((transport) => {
    silentium.All($one, $two).event(
      silentium.Transport(([one, two]) => {
        transport.use(one || two);
      })
    );
  });
}

function Not($base) {
  return silentium.Event((transport) => {
    $base.event(
      silentium.Transport((v) => {
        transport.use(!v);
      })
    );
  });
}

function Bool($base) {
  return silentium.Event((transport) => {
    silentium.Applied($base, Boolean).event(transport);
  });
}

function FromJson($json, error) {
  return silentium.Event((transport) => {
    $json.event(
      silentium.Transport((json) => {
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
  return silentium.Event((transport) => {
    $data.event(
      silentium.Transport((data) => {
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
  return silentium.Event((transport) => {
    silentium.Applied($base, (a) => a[0]).event(transport);
  });
}

exports.And = And;
exports.Bool = Bool;
exports.Branch = Branch;
exports.BranchLazy = BranchLazy;
exports.Concatenated = Concatenated;
exports.Constant = Constant;
exports.Deadline = Deadline;
exports.Deferred = Deferred;
exports.Detached = Detached;
exports.Dirty = Dirty;
exports.First = First;
exports.FromJson = FromJson;
exports.HashTable = HashTable;
exports.Loading = Loading;
exports.Lock = Lock;
exports.Memo = Memo;
exports.Not = Not;
exports.OnlyChanged = OnlyChanged;
exports.Or = Or;
exports.Part = Part;
exports.Path = Path;
exports.Polling = Polling;
exports.RecordOf = RecordOf;
exports.RegexpMatch = RegexpMatch;
exports.RegexpMatched = RegexpMatched;
exports.RegexpReplaced = RegexpReplaced;
exports.Router = Router;
exports.Set = Set;
exports.Shot = Shot;
exports.Task = Task;
exports.Template = Template;
exports.Tick = Tick;
exports.ToJson = ToJson;
exports.Transaction = Transaction;
//# sourceMappingURL=silentium-components.cjs.map
