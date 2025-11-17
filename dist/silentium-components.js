import { ActualMessage, Message, Primitive, Tap, DestroyContainer, Shared, Filtered, isFilled, Late, Applied, All, SharedSource, ExecutorApplied, LateShared, Of, isMessage, isDestroyable } from 'silentium';

function Branch(_condition, _left, _right) {
  const $condition = ActualMessage(_condition);
  const $left = ActualMessage(_left);
  const $right = _right && ActualMessage(_right);
  return Message(function() {
    const left = Primitive($left);
    let right;
    if ($right !== void 0) {
      right = Primitive($right);
    }
    $condition.pipe(
      Tap((v) => {
        let result = null;
        if (v) {
          result = left.primitive();
        } else if (right) {
          result = right.primitive();
        }
        if (result !== null) {
          this.use(result);
        }
      })
    );
  });
}

function BranchLazy($condition, $left, $right) {
  return Message(function() {
    const dc = DestroyContainer();
    const destructor = () => {
      dc.destroy();
    };
    $condition.pipe(
      Tap((v) => {
        destructor();
        let instance;
        if (v) {
          instance = $left.use();
        } else if ($right) {
          instance = $right.use();
        }
        if (instance !== void 0) {
          instance.pipe(this);
          dc.add(instance);
        }
      })
    );
    return destructor;
  });
}

function Constant(permanent, $trigger) {
  return Message(function() {
    $trigger.pipe(
      Tap(() => {
        this.use(permanent);
      })
    );
  });
}

function Deadline(error, $base, _timeout) {
  const $timeout = ActualMessage(_timeout);
  return Message(function() {
    let timer = 0;
    const base = Shared($base, true);
    $timeout.pipe(
      Tap((timeout) => {
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
        f.pipe(this);
        base.pipe(
          Tap(() => {
            timeoutReached = true;
          })
        );
      })
    );
  });
}

function Deferred($base, $trigger) {
  return Message(function() {
    const base = Primitive($base);
    $trigger.pipe(
      Tap(() => {
        const value = base.primitive();
        if (isFilled(value)) {
          this.use(value);
        }
      })
    );
  });
}

function Detached($base) {
  return Message(function() {
    const v = Primitive($base).primitive();
    if (isFilled(v)) {
      this.use(v);
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
  pipe(transport) {
    const $comparing = Applied(this.$comparing, this.cloner);
    All($comparing, this.$base).pipe(
      Tap(([comparing, base]) => {
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

function Loading($start, $finish) {
  return Message(function() {
    $start.pipe(Tap(() => this.use(true)));
    $finish.pipe(Tap(() => this.use(false)));
  });
}

function Lock($base, $lock) {
  return Message(function() {
    let locked = false;
    $lock.pipe(
      Tap((newLock) => {
        locked = newLock;
      })
    );
    const i = Filtered($base, () => !locked);
    i.pipe(this);
  });
}

function Memo($base) {
  return Message(function() {
    let last = null;
    $base.pipe(
      Tap((v) => {
        if (v !== last && isFilled(v)) {
          this.use(v);
          last = v;
        }
      })
    );
  });
}

function OnlyChanged($base) {
  return Message(function() {
    let first = false;
    $base.pipe(
      Tap((v) => {
        if (first === false) {
          first = true;
        } else {
          this.use(v);
        }
      })
    );
  });
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
function Part($base, $key) {
  return new PartImpl($base, ActualMessage($key));
}
class PartImpl {
  constructor($base, $key) {
    __publicField$1(this, "$base");
    __publicField$1(this, "$keyed");
    this.$base = SharedSource($base);
    this.$keyed = Shared($key);
  }
  pipe(transport) {
    All(this.$base, this.$keyed).pipe(
      Tap(([base, keyed]) => {
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

function Path($base, _keyed) {
  const $keyed = ActualMessage(_keyed);
  return Message(function() {
    All($base, $keyed).pipe(
      Tap(([base, keyed]) => {
        const keys = keyed.split(".");
        let value = base;
        keys.forEach((key) => {
          value = value[key];
        });
        if (value !== void 0 && value !== base) {
          this.use(value);
        }
      })
    );
  });
}

function Polling($base, $trigger) {
  return Message(function() {
    $trigger.pipe(
      Tap(() => {
        $base.pipe(this);
      })
    );
  });
}

function Shot($target, $trigger) {
  return Message(function() {
    const targetSync = Primitive($target);
    targetSync.primitive();
    $trigger.pipe(
      Tap(() => {
        const value = targetSync.primitive();
        if (isFilled(value)) {
          this.use(value);
        }
      })
    );
  });
}

function Task(baseSrc, delay = 0) {
  return Message(function() {
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
    }).pipe(this);
  });
}

function Tick($base) {
  return Message(function() {
    let microtaskScheduled = false;
    let lastValue = null;
    const scheduleMicrotask = () => {
      microtaskScheduled = true;
      queueMicrotask(() => {
        microtaskScheduled = false;
        if (lastValue !== null) {
          this.use(lastValue);
          lastValue = null;
        }
      });
    };
    $base.pipe(
      Tap((v) => {
        lastValue = v;
        if (!microtaskScheduled) {
          scheduleMicrotask();
        }
      })
    );
  });
}

function Transaction($base, builder, ...args) {
  return Message(function() {
    const $res = LateShared();
    const destructors = [];
    $base.pipe(
      Tap((v) => {
        const $msg = builder(Of(v), ...args.map((a) => Detached(a)));
        destructors.push($msg);
        $msg.pipe($res);
      })
    );
    $res.pipe(this);
    return () => {
      destructors.forEach((d) => d?.destroy());
      destructors.length = 0;
    };
  });
}

function HashTable($base) {
  return Message(function() {
    const record = {};
    $base.pipe(
      Tap(([key, value]) => {
        record[key] = value;
        this.use(record);
      })
    );
  });
}

function Record(record) {
  return Message(function() {
    const keys = Object.keys(record);
    keys.forEach((key) => {
      if (!isMessage(record[key])) {
        record[key] = Of(record[key]);
      }
    });
    All(...Object.values(record)).pipe(
      Tap((entries) => {
        const record2 = {};
        entries.forEach((entry, index) => {
          record2[keys[index]] = entry;
        });
        this.use(record2);
      })
    );
  });
}

function Concatenated(sources, joinPartSrc = Of("")) {
  return Message(function() {
    All(joinPartSrc, ...sources).pipe(
      Tap(([joinPart, ...strings]) => {
        this.use(strings.join(joinPart));
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
  pipe(transport) {
    const $vars = Record(this.vars);
    Applied(All(this.$src, this.$places, $vars), ([base, rules, vars]) => {
      Object.entries(rules).forEach(([ph, val]) => {
        base = base.replaceAll(ph, String(val));
      });
      Object.entries(vars).forEach(([ph, val]) => {
        base = base.replaceAll(ph, String(val));
      });
      return base;
    }).pipe(transport);
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
  return Message(function() {
    All(patternSrc, valueSrc, flagsSrc).pipe(
      Tap(([pattern, value, flags]) => {
        this.use(new RegExp(pattern, flags).test(value));
      })
    );
  });
}

function RegexpReplaced(valueSrc, patternSrc, replaceValueSrc, flagsSrc = Of("")) {
  return Message(function() {
    All(patternSrc, valueSrc, replaceValueSrc, flagsSrc).pipe(
      Tap(([pattern, value, replaceValue, flags]) => {
        this.use(
          String(value).replace(new RegExp(pattern, flags), replaceValue)
        );
      })
    );
  });
}

function RegexpMatch(patternSrc, valueSrc, flagsSrc = Of("")) {
  return Message(function() {
    All(patternSrc, valueSrc, flagsSrc).pipe(
      Tap(([pattern, value, flags]) => {
        const result = new RegExp(pattern, flags).exec(value);
        this.use(result ?? []);
      })
    );
  });
}

function Set(baseSrc, keySrc, valueSrc) {
  return Message(function() {
    All(baseSrc, keySrc, valueSrc).pipe(
      Tap(([base, key, value]) => {
        base[key] = value;
        this.use(base);
      })
    );
  });
}

function Router($url, $routes, $default) {
  return Message(function() {
    const dc = DestroyContainer();
    const destructor = () => {
      dc.destroy();
    };
    All($routes, $url).pipe(
      Tap(([routes, url]) => {
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
        $matches.pipe(
          Tap((matches) => {
            const index = matches.findIndex((v) => v === true);
            if (index === -1) {
              const instance = $default.use();
              dc.add(instance);
              instance.pipe(this);
            }
            if (index > -1) {
              const instance = routes[index].message.use();
              dc.add(instance);
              instance.pipe(this);
            }
          })
        );
      })
    );
    return destructor;
  });
}

function And($one, $two) {
  return Message(function() {
    All($one, $two).pipe(
      Tap(([one, two]) => {
        this.use(!!(one && two));
      })
    );
  });
}

function Or($one, $two) {
  return Message(function() {
    All($one, $two).pipe(
      Tap(([one, two]) => {
        this.use(!!(one || two));
      })
    );
  });
}

function Not($base) {
  return Message(function() {
    $base.pipe(
      Tap((v) => {
        this.use(!v);
      })
    );
  });
}

function Bool($base) {
  return Message(function() {
    Applied($base, Boolean).pipe(this);
  });
}

function FromJson($json, error) {
  return Message(function() {
    $json.pipe(
      Tap((json) => {
        try {
          this.use(JSON.parse(json));
        } catch (e) {
          error?.use(new Error(`Failed to parse JSON: ${e}`));
        }
      })
    );
  });
}

function ToJson($data, error) {
  return Message(function() {
    $data.pipe(
      Tap((data) => {
        try {
          this.use(JSON.stringify(data));
        } catch {
          error?.use(new Error("Failed to convert to JSON"));
        }
      })
    );
  });
}

function First($base) {
  return Message(function() {
    Applied($base, (a) => a[0]).pipe(this);
  });
}

export { And, Bool, Branch, BranchLazy, Concatenated, Constant, Deadline, Deferred, Detached, Dirty, First, FromJson, HashTable, Loading, Lock, Memo, Not, OnlyChanged, Or, Part, Path, Polling, Record, RegexpMatch, RegexpMatched, RegexpReplaced, Router, Set, Shot, Task, Template, Tick, ToJson, Transaction };
//# sourceMappingURL=silentium-components.js.map
