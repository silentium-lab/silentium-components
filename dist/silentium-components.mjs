import { Actual, Message, Primitive, DestroyContainer, ResetSilenceCache, Shared, Filtered, isFilled, Late, Source, Applied, All, Computed, ExecutorApplied, Of, Once, Map, isMessage, Rejections, isDestroyable } from 'silentium';

function Branch(_condition, _left, _right) {
  const $condition = Actual(_condition);
  const $left = Actual(_left);
  const $right = Actual(_right);
  return Message(function BranchImpl(r) {
    const left = Primitive($left);
    let right;
    if (_right !== void 0) {
      right = Primitive($right);
    }
    $condition.then((v) => {
      if (typeof v !== "boolean") {
        throw new Error("Branch received not boolean value");
      }
      let result = null;
      if (v === true) {
        result = left.primitive();
      } else if (right) {
        result = right.primitive();
      }
      if (result !== null) {
        r(result);
      }
    });
  });
}

function BranchLazy($condition, $left, $right) {
  return Message(function BranchLazyImpl(r) {
    const dc = DestroyContainer();
    const destructor = () => {
      dc.destroy();
    };
    $condition.then((v) => {
      destructor();
      let instance;
      if (v) {
        instance = $left();
      } else if ($right) {
        instance = $right();
      }
      if (instance !== void 0) {
        instance.then(r);
        dc.add(instance);
      }
    });
    return destructor;
  });
}

function Constant(permanent, $trigger) {
  return Message(function ConstantImpl(resolve, reject) {
    $trigger.catch(reject).then(() => {
      resolve(permanent);
      resolve(ResetSilenceCache);
    });
  });
}

function Deadline($base, _timeout) {
  const $timeout = Actual(_timeout);
  return Message(function DeadlineImpl(resolve, reject) {
    let timer = 0;
    const base = Shared($base);
    $timeout.then((timeout) => {
      if (timer) {
        clearTimeout(timer);
      }
      let timeoutReached = false;
      timer = setTimeout(() => {
        if (timeoutReached) {
          return;
        }
        timeoutReached = true;
        reject(new Error("Timeout reached in Deadline"));
      }, timeout);
      const f = Filtered(base, () => !timeoutReached);
      f.then(resolve);
      base.then(() => {
        timeoutReached = true;
      });
    });
  });
}

function Deferred($base, $trigger) {
  return Message(function DeferredImpl(r) {
    const base = Primitive($base);
    $trigger.then(() => {
      const value = base.primitive();
      if (isFilled(value)) {
        r(value);
      }
    });
  });
}

function Detached($base) {
  return Message(function DetachedImpl(r) {
    const v = Primitive($base).primitive();
    if (isFilled(v)) {
      r(v);
    }
  });
}

function Dirty($base, keep = [], exclude = [], cloner) {
  const $comparing = Late({});
  if (cloner === void 0) {
    cloner = (value) => JSON.parse(JSON.stringify(value));
  }
  return Source(
    function DirtyImpl(r) {
      const $comparingClone = Applied($comparing, cloner);
      All($comparingClone, $base).then(([comparing, base]) => {
        if (!comparing) {
          return;
        }
        r(
          Object.fromEntries(
            Object.entries(comparing).filter(([key, value]) => {
              if (keep.includes(key)) {
                return true;
              }
              if (exclude.includes(key)) {
                return false;
              }
              return value !== base[key];
            })
          )
        );
      });
    },
    (v) => {
      $comparing.use(v);
    }
  );
}

function Loading($start, $finish) {
  return Message(function LoadingImpl(r) {
    $start.then(() => r(true));
    $finish.then(() => r(false));
  });
}

function Lock($base, $lock) {
  return Message(function LockImpl(r) {
    let locked = false;
    $lock.then((newLock) => {
      locked = newLock;
    });
    const i = Filtered($base, () => !locked);
    i.then(r);
  });
}

function Memo($base) {
  return Message(function MemoImpl(r) {
    let last = null;
    $base.then((v) => {
      if (v !== last && isFilled(v)) {
        r(v);
        last = v;
      }
    });
  });
}

function MergeAccumulation($base, $reset) {
  const accumulation = Late();
  const lastAccumulated = {};
  $base.then((nextValue) => {
    accumulation.use(
      mergeWith(lastAccumulated, nextValue, (value1, value2) => {
        if (Array.isArray(value1)) {
          return value1.concat(value2);
        }
      })
    );
  });
  if ($reset) {
    $reset.then((resetValue) => {
      accumulation.use(resetValue);
    });
  }
  return accumulation;
}
function mergeWith(target, source, customizer) {
  if (source == null) {
    return target;
  }
  Object.keys(source).forEach((key) => {
    const srcValue = source[key];
    const objValue = target[key];
    const result = customizer(objValue, srcValue, key, target, source);
    if (result !== void 0) {
      target[key] = result;
    } else if (isObject(srcValue) && isObject(objValue)) {
      mergeWith(objValue, srcValue, customizer);
    } else {
      target[key] = srcValue;
    }
  });
  return target;
}
function isObject(value) {
  return value != null && typeof value === "object";
}

function OnlyChanged($base) {
  return Message(function OnlyChangedImpl(r) {
    let first = false;
    $base.then((v) => {
      if (first === false) {
        first = true;
      } else {
        r(v);
      }
    });
  });
}

function Part($base, key, defaultValue) {
  const $baseShared = Shared($base);
  const $keyedShared = Shared(Actual(key));
  return Source(
    function PartImpl(r) {
      All($baseShared, $keyedShared).then(([base, keyed]) => {
        const keys = keyed.split(".");
        let value = base;
        keys.forEach((key2) => {
          value = value[key2];
        });
        if (value !== void 0 && value !== base) {
          r(value);
        } else if (defaultValue !== void 0) {
          r(defaultValue);
        }
      });
    },
    (value) => {
      const key2 = Primitive($keyedShared);
      if (isFilled(key2)) {
        const base = Primitive($base);
        $base.use({
          ...base.primitiveWithException(),
          [key2.primitiveWithException()]: value
        });
      }
    }
  );
}

const NotSet = Symbol("not-set");
function Path(_base, _keyed, def) {
  const $base = Actual(_base);
  const $keyed = Actual(_keyed);
  const $def = Actual(def ?? NotSet);
  return Applied(All($base, $keyed, $def), ([base, keyed, d]) => {
    const keys = keyed.split(".");
    let value = base;
    keys.forEach((key) => {
      value = value[key];
    });
    if (value !== void 0 && value !== base) {
      return value;
    } else if (d !== NotSet) {
      return d;
    }
  });
}

function Polling($base, $trigger) {
  return Message(function PollingImpl(r, reject) {
    const dc = DestroyContainer();
    $trigger.then(() => {
      dc.destroy();
      r(ResetSilenceCache);
      dc.add($base.then(r).catch(reject));
    }).catch(reject);
  });
}

function RecordTruncated(_record, _badValues) {
  const $record = Actual(_record);
  const $badValues = Actual(_badValues);
  const processRecord = (obj, badValues) => {
    if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
      return obj;
    }
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (badValues.includes(value)) continue;
      const processedValue = processRecord(value, badValues);
      if (processedValue !== void 0 && !(typeof processedValue === "object" && processedValue !== null && !Array.isArray(processedValue) && Object.keys(processedValue).length === 0)) {
        result[key] = processedValue;
      }
    }
    return result;
  };
  return Computed(processRecord, $record, $badValues);
}

function Shot($target, $trigger) {
  return Message(function ShotImpl(r) {
    const targetSync = Primitive($target);
    targetSync.primitive();
    $trigger.then(() => {
      const value = targetSync.primitive();
      if (isFilled(value)) {
        r(value);
      }
    });
  });
}

function Task(baseSrc, delay = 0) {
  const $base = Actual(baseSrc);
  return Message(function TaskImpl(r) {
    let prevTimer = null;
    ExecutorApplied($base, (fn) => {
      return (v) => {
        if (prevTimer) {
          clearTimeout(prevTimer);
        }
        prevTimer = setTimeout(() => {
          fn(v);
        }, delay);
      };
    }).then(r);
  });
}

function Tick($base) {
  return Message(function TickImpl(r) {
    let microtaskScheduled = false;
    let lastValue = null;
    const scheduleMicrotask = () => {
      microtaskScheduled = true;
      queueMicrotask(() => {
        microtaskScheduled = false;
        if (lastValue !== null) {
          r(lastValue);
          lastValue = null;
        }
      });
    };
    $base.then((v) => {
      lastValue = v;
      if (!microtaskScheduled) {
        scheduleMicrotask();
      }
    });
  });
}

function HashTable($base) {
  return Message(function HashTableImpl(r) {
    const record = {};
    $base.then(([key, value]) => {
      record[key] = value;
      r(record);
    });
  });
}

function Record(record) {
  return Message(function RecordImpl(r) {
    const keys = Object.keys(record);
    keys.forEach((key) => {
      record[key] = Actual(record[key]);
    });
    All(...Object.values(record)).then((entries) => {
      const record2 = {};
      entries.forEach((entry, index) => {
        record2[keys[index]] = entry;
      });
      r(record2);
    });
  });
}

function Transformed(_base, transformRules) {
  const $base = Actual(_base);
  return Message((resolve) => {
    $base.then((v) => {
      const existedKeysMap = {};
      const sourceObject = Object.fromEntries(
        Object.entries(v).map((entry) => {
          if (transformRules[entry[0]]) {
            existedKeysMap[entry[0]] = 1;
            return [entry[0], transformRules[entry[0]](v)];
          }
          return [entry[0], Of(entry[1])];
        })
      );
      Object.keys(transformRules).forEach((key) => {
        if (!existedKeysMap[key]) {
          sourceObject[key] = transformRules[key](v);
        }
      });
      const record = Once(Record(sourceObject));
      record.then(resolve);
    });
  });
}

function TransformedList(_base, transformRules) {
  return Map(Actual(_base), (v) => Transformed(v, transformRules));
}

function And($one, $two) {
  return Message(function AndImpl(r) {
    All($one, $two).then(([one, two]) => {
      r(!!(one && two));
    });
  });
}

function Bool($base) {
  return Message(function BoolImpl(r) {
    Applied($base, Boolean).then(r);
  });
}

function Not($base) {
  return Message(function NotImpl(r) {
    $base.then((v) => {
      r(!v);
    });
  });
}

function Or($one, $two) {
  return Message(function OrImpl(r) {
    All($one, $two).then(([one, two]) => {
      r(!!(one || two));
    });
  });
}

function FromJson($json) {
  return Message(function FromJsonImpl(resolve, reject) {
    $json.then((json) => {
      try {
        resolve(JSON.parse(json));
      } catch (e) {
        reject(new Error(`Failed to parse JSON: ${e}`));
      }
    });
  });
}

function ToJson($data) {
  return Message(function ToJsonImpl(resolve, reject) {
    $data.then((data) => {
      try {
        resolve(JSON.stringify(data));
      } catch {
        reject(new Error("Failed to convert to JSON"));
      }
    });
  });
}

function First($base) {
  return Message(function FirstImpl(r) {
    Applied($base, (a) => a[0]).then(r);
  });
}

function RegexpMatch(patternSrc, valueSrc, flagsSrc = Of("")) {
  const $pattern = Actual(patternSrc);
  const $value = Actual(valueSrc);
  const $flags = Actual(flagsSrc);
  return Message(function RegexpMatchImpl(r) {
    All($pattern, $value, $flags).then(([pattern, value, flags]) => {
      const result = new RegExp(pattern, flags).exec(value);
      r(result ?? []);
    });
  });
}

function RegexpMatched(patternSrc, valueSrc, flagsSrc = Of("")) {
  const $pattern = Actual(patternSrc);
  const $value = Actual(valueSrc);
  const $flags = Actual(flagsSrc);
  return Message(function RegexpMatchedImpl(r) {
    All($pattern, $value, $flags).then(([pattern, value, flags]) => {
      r(new RegExp(pattern, flags).test(value));
    });
  });
}

function RegexpReplaced(valueSrc, patternSrc, replaceValueSrc, flagsSrc = "") {
  const $value = Actual(valueSrc);
  const $pattern = Actual(patternSrc);
  const $replaceValue = Actual(replaceValueSrc);
  const $flags = Actual(flagsSrc);
  return Applied(
    All($pattern, $value, $replaceValue, $flags),
    ([pattern, value, replaceValue, flags]) => {
      return String(value).replace(new RegExp(pattern, flags), replaceValue);
    }
  );
}

function Set(baseSrc, keySrc, valueSrc) {
  const $base = Actual(baseSrc);
  const $key = Actual(keySrc);
  const $value = Actual(valueSrc);
  return Message(function SetImpl(r) {
    All($base, $key, $value).then(([base, key, value]) => {
      base[key] = value;
      r(base);
    });
  });
}

function Router($url, routes, $default) {
  const $routes = Actual(routes);
  return Message(function RouterImpl(r) {
    const dc = DestroyContainer();
    const destructor = () => {
      dc.destroy();
    };
    All($routes, $url).then(([routes2, url]) => {
      destructor();
      const $matches = All(
        ...routes2.map(
          (r2) => RegexpMatched(
            Of(r2.pattern),
            Of(url),
            r2.patternFlags ? Of(r2.patternFlags) : void 0
          )
        )
      );
      $matches.then((matches) => {
        const index = matches.findIndex((v) => v === true);
        if (index === -1) {
          const instance = $default();
          dc.add(instance);
          instance.then(r);
        }
        if (index > -1) {
          const instance = routes2[index].message();
          dc.add(instance);
          instance.then(r);
        }
      });
    });
    return destructor;
  });
}

function Concatenated(sources, joinPartSrc = Of("")) {
  return Message(function ConcatenatedImpl(r) {
    All(joinPartSrc, ...sources).then(([joinPart, ...strings]) => {
      r(strings.join(joinPart));
    });
  });
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function Template(src = "", $places = Of({})) {
  const $src = Late();
  if (typeof src === "string" || isMessage(src)) {
    $src.chain(Actual(src));
  }
  const t = new TemplateImpl($src, $places ? Actual($places) : void 0);
  if (typeof src === "function") {
    $src.chain(
      Message((r) => {
        r(src(t));
      })
    );
  }
  return t;
}
class TemplateImpl {
  constructor($src = Of(""), $places = Of({}), escapeFn = escaped) {
    this.$src = $src;
    this.$places = $places;
    this.escapeFn = escapeFn;
    __publicField(this, "dc", DestroyContainer());
    __publicField(this, "rejections", new Rejections());
    __publicField(this, "vars", {
      $TPL: Of("$TPL")
    });
  }
  then(transport) {
    const $vars = Record(this.vars);
    Applied(All(this.$src, this.$places, $vars), ([base, rules, vars]) => {
      try {
        Object.entries(rules).forEach(([ph, val]) => {
          base = base.replaceAll(ph, String(val));
        });
        Object.entries(vars).forEach(([ph, val]) => {
          base = base.replaceAll(ph, String(val));
        });
      } catch (e) {
        this.rejections.reject(e);
      }
      return base;
    }).then(transport);
    return this;
  }
  template(value) {
    this.$src = Of(value);
  }
  /**
   * Register raw unsafe variable
   */
  raw(src) {
    const hash = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const varName = `$var${hash}`;
    if (isDestroyable(src)) {
      this.dc.add(src);
    }
    this.vars[varName] = src;
    return varName;
  }
  /**
   * Register variable what will be safe in HTML by default
   * or with your custom escape logic
   */
  escaped(src) {
    if (isDestroyable(src)) {
      this.dc.add(src);
    }
    return this.raw(Applied(src, this.escapeFn));
  }
  catch(rejected) {
    this.rejections.catch(rejected);
    return this;
  }
  destroy() {
    this.dc.destroy();
    return this;
  }
}
const escapeMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;"
};
function escaped(base) {
  if (typeof base !== "string") {
    base = String(base);
  }
  return base.replace(
    /[&<>"'/]/g,
    (match) => escapeMap[match]
  );
}

export { And, Bool, Branch, BranchLazy, Concatenated, Constant, Deadline, Deferred, Detached, Dirty, First, FromJson, HashTable, Loading, Lock, Memo, MergeAccumulation, Not, OnlyChanged, Or, Part, Path, Polling, Record, RecordTruncated, RegexpMatch, RegexpMatched, RegexpReplaced, Router, Set, Shot, Task, Template, TemplateImpl, Tick, ToJson, Transformed, TransformedList, escaped };
//# sourceMappingURL=silentium-components.mjs.map
