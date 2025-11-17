'use strict';

var silentium = require('silentium');

function Branch(_condition, _left, _right) {
  const $condition = silentium.ActualMessage(_condition);
  const $left = silentium.ActualMessage(_left);
  const $right = _right && silentium.ActualMessage(_right);
  return silentium.Message(function() {
    const left = silentium.Primitive($left);
    let right;
    if ($right !== void 0) {
      right = silentium.Primitive($right);
    }
    $condition.pipe(
      silentium.Tap((v) => {
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
  return silentium.Message(function() {
    const dc = silentium.DestroyContainer();
    const destructor = () => {
      dc.destroy();
    };
    $condition.pipe(
      silentium.Tap((v) => {
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
  return silentium.Message(function() {
    $trigger.pipe(
      silentium.Tap(() => {
        this.use(permanent);
      })
    );
  });
}

function Deadline(error, $base, _timeout) {
  const $timeout = silentium.ActualMessage(_timeout);
  return silentium.Message(function() {
    let timer = 0;
    const base = silentium.Shared($base, true);
    $timeout.pipe(
      silentium.Tap((timeout) => {
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
        f.pipe(this);
        base.pipe(
          silentium.Tap(() => {
            timeoutReached = true;
          })
        );
      })
    );
  });
}

function Deferred($base, $trigger) {
  return silentium.Message(function() {
    const base = silentium.Primitive($base);
    $trigger.pipe(
      silentium.Tap(() => {
        const value = base.primitive();
        if (silentium.isFilled(value)) {
          this.use(value);
        }
      })
    );
  });
}

function Detached($base) {
  return silentium.Message(function() {
    const v = silentium.Primitive($base).primitive();
    if (silentium.isFilled(v)) {
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
    __publicField$2(this, "$comparing", silentium.Late());
    __publicField$2(this, "cloner");
    if (cloner === void 0) {
      this.cloner = (value) => JSON.parse(JSON.stringify(value));
    } else {
      this.cloner = cloner;
    }
  }
  pipe(transport) {
    const $comparing = silentium.Applied(this.$comparing, this.cloner);
    silentium.All($comparing, this.$base).pipe(
      silentium.Tap(([comparing, base]) => {
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
  return silentium.Message(function() {
    $start.pipe(silentium.Tap(() => this.use(true)));
    $finish.pipe(silentium.Tap(() => this.use(false)));
  });
}

function Lock($base, $lock) {
  return silentium.Message(function() {
    let locked = false;
    $lock.pipe(
      silentium.Tap((newLock) => {
        locked = newLock;
      })
    );
    const i = silentium.Filtered($base, () => !locked);
    i.pipe(this);
  });
}

function Memo($base) {
  return silentium.Message(function() {
    let last = null;
    $base.pipe(
      silentium.Tap((v) => {
        if (v !== last && silentium.isFilled(v)) {
          this.use(v);
          last = v;
        }
      })
    );
  });
}

function OnlyChanged($base) {
  return silentium.Message(function() {
    let first = false;
    $base.pipe(
      silentium.Tap((v) => {
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
  return new PartImpl($base, silentium.ActualMessage($key));
}
class PartImpl {
  constructor($base, $key) {
    __publicField$1(this, "$base");
    __publicField$1(this, "$keyed");
    this.$base = silentium.SharedSource($base);
    this.$keyed = silentium.Shared($key);
  }
  pipe(transport) {
    silentium.All(this.$base, this.$keyed).pipe(
      silentium.Tap(([base, keyed]) => {
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

function Path($base, _keyed) {
  const $keyed = silentium.ActualMessage(_keyed);
  return silentium.Message(function() {
    silentium.All($base, $keyed).pipe(
      silentium.Tap(([base, keyed]) => {
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
  return silentium.Message(function() {
    $trigger.pipe(
      silentium.Tap(() => {
        $base.pipe(this);
      })
    );
  });
}

function Shot($target, $trigger) {
  return silentium.Message(function() {
    const targetSync = silentium.Primitive($target);
    targetSync.primitive();
    $trigger.pipe(
      silentium.Tap(() => {
        const value = targetSync.primitive();
        if (silentium.isFilled(value)) {
          this.use(value);
        }
      })
    );
  });
}

function Task(baseSrc, delay = 0) {
  return silentium.Message(function() {
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
    }).pipe(this);
  });
}

function Tick($base) {
  return silentium.Message(function() {
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
      silentium.Tap((v) => {
        lastValue = v;
        if (!microtaskScheduled) {
          scheduleMicrotask();
        }
      })
    );
  });
}

function Transaction($base, builder, ...args) {
  return silentium.Message(function() {
    const $res = silentium.LateShared();
    const destructors = [];
    $base.pipe(
      silentium.Tap((v) => {
        const $msg = builder(silentium.Of(v), ...args.map((a) => Detached(a)));
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
  return silentium.Message(function() {
    const record = {};
    $base.pipe(
      silentium.Tap(([key, value]) => {
        record[key] = value;
        this.use(record);
      })
    );
  });
}

function Record(record) {
  return silentium.Message(function() {
    const keys = Object.keys(record);
    keys.forEach((key) => {
      if (!silentium.isMessage(record[key])) {
        record[key] = silentium.Of(record[key]);
      }
    });
    silentium.All(...Object.values(record)).pipe(
      silentium.Tap((entries) => {
        const record2 = {};
        entries.forEach((entry, index) => {
          record2[keys[index]] = entry;
        });
        this.use(record2);
      })
    );
  });
}

function Concatenated(sources, joinPartSrc = silentium.Of("")) {
  return silentium.Message(function() {
    silentium.All(joinPartSrc, ...sources).pipe(
      silentium.Tap(([joinPart, ...strings]) => {
        this.use(strings.join(joinPart));
      })
    );
  });
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function Template($src = silentium.Of(""), $places = silentium.Of({})) {
  return new TemplateImpl($src, $places);
}
class TemplateImpl {
  constructor($src = silentium.Of(""), $places = silentium.Of({})) {
    this.$src = $src;
    this.$places = $places;
    __publicField(this, "dc", silentium.DestroyContainer());
    __publicField(this, "vars", {
      $TPL: silentium.Of("$TPL")
    });
  }
  pipe(transport) {
    const $vars = Record(this.vars);
    silentium.Applied(silentium.All(this.$src, this.$places, $vars), ([base, rules, vars]) => {
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
  return silentium.Message(function() {
    silentium.All(patternSrc, valueSrc, flagsSrc).pipe(
      silentium.Tap(([pattern, value, flags]) => {
        this.use(new RegExp(pattern, flags).test(value));
      })
    );
  });
}

function RegexpReplaced(valueSrc, patternSrc, replaceValueSrc, flagsSrc = silentium.Of("")) {
  return silentium.Message(function() {
    silentium.All(patternSrc, valueSrc, replaceValueSrc, flagsSrc).pipe(
      silentium.Tap(([pattern, value, replaceValue, flags]) => {
        this.use(
          String(value).replace(new RegExp(pattern, flags), replaceValue)
        );
      })
    );
  });
}

function RegexpMatch(patternSrc, valueSrc, flagsSrc = silentium.Of("")) {
  return silentium.Message(function() {
    silentium.All(patternSrc, valueSrc, flagsSrc).pipe(
      silentium.Tap(([pattern, value, flags]) => {
        const result = new RegExp(pattern, flags).exec(value);
        this.use(result ?? []);
      })
    );
  });
}

function Set(baseSrc, keySrc, valueSrc) {
  return silentium.Message(function() {
    silentium.All(baseSrc, keySrc, valueSrc).pipe(
      silentium.Tap(([base, key, value]) => {
        base[key] = value;
        this.use(base);
      })
    );
  });
}

function Router($url, $routes, $default) {
  return silentium.Message(function() {
    const dc = silentium.DestroyContainer();
    const destructor = () => {
      dc.destroy();
    };
    silentium.All($routes, $url).pipe(
      silentium.Tap(([routes, url]) => {
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
        $matches.pipe(
          silentium.Tap((matches) => {
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
  return silentium.Message(function() {
    silentium.All($one, $two).pipe(
      silentium.Tap(([one, two]) => {
        this.use(!!(one && two));
      })
    );
  });
}

function Or($one, $two) {
  return silentium.Message(function() {
    silentium.All($one, $two).pipe(
      silentium.Tap(([one, two]) => {
        this.use(!!(one || two));
      })
    );
  });
}

function Not($base) {
  return silentium.Message(function() {
    $base.pipe(
      silentium.Tap((v) => {
        this.use(!v);
      })
    );
  });
}

function Bool($base) {
  return silentium.Message(function() {
    silentium.Applied($base, Boolean).pipe(this);
  });
}

function FromJson($json, error) {
  return silentium.Message(function() {
    $json.pipe(
      silentium.Tap((json) => {
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
  return silentium.Message(function() {
    $data.pipe(
      silentium.Tap((data) => {
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
  return silentium.Message(function() {
    silentium.Applied($base, (a) => a[0]).pipe(this);
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
exports.Record = Record;
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
