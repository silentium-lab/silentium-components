'use strict';

var silentium = require('silentium');

function Branch(_condition, _left, _right) {
  const $condition = silentium.Actual(_condition);
  const $left = silentium.Actual(_left);
  const $right = silentium.Actual(_right);
  return silentium.Message(function BranchImpl(r) {
    const left = silentium.Primitive($left);
    let right;
    if (_right !== void 0) {
      right = silentium.Primitive($right);
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
  return silentium.Message(function BranchLazyImpl(r) {
    const dc = silentium.DestroyContainer();
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
  return silentium.Message(function ConstantImpl(resolve, reject) {
    $trigger.catch(reject).then(() => {
      resolve(permanent);
      resolve(silentium.ResetSilenceCache);
    });
  });
}

function Deadline($base, _timeout) {
  const $timeout = silentium.Actual(_timeout);
  return silentium.Message(function DeadlineImpl(resolve, reject) {
    let timer = 0;
    const base = silentium.Shared($base);
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
      const f = silentium.Filtered(base, () => !timeoutReached);
      f.then(resolve);
      base.then(() => {
        timeoutReached = true;
      });
    });
  });
}

function Deferred($base, $trigger) {
  return silentium.Message(function DeferredImpl(r) {
    const base = silentium.Primitive($base);
    $trigger.then(() => {
      const value = base.primitive();
      if (silentium.isFilled(value)) {
        r(value);
      }
    });
  });
}

function Detached($base) {
  return silentium.Message(function DetachedImpl(r) {
    const v = silentium.Primitive($base).primitive();
    if (silentium.isFilled(v)) {
      r(v);
    }
  });
}

function Dirty($base, keep = [], exclude = [], cloner) {
  const $comparing = silentium.Late({});
  if (cloner === void 0) {
    cloner = (value) => JSON.parse(JSON.stringify(value));
  }
  return silentium.Source(
    function DirtyImpl(r) {
      const $comparingClone = silentium.Applied($comparing, cloner);
      silentium.All($comparingClone, $base).then(([comparing, base]) => {
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
  return silentium.Message(function LoadingImpl(r) {
    $start.then(() => r(true));
    $finish.then(() => r(false));
  });
}

function Lock($base, $lock) {
  return silentium.Message(function LockImpl(r) {
    let locked = false;
    $lock.then((newLock) => {
      locked = newLock;
    });
    const i = silentium.Filtered($base, () => !locked);
    i.then(r);
  });
}

function Memo($base) {
  return silentium.Message(function MemoImpl(r) {
    let last = null;
    $base.then((v) => {
      if (v !== last && silentium.isFilled(v)) {
        r(v);
        last = v;
      }
    });
  });
}

function MergeAccumulation($base, $reset) {
  const accumulation = silentium.Late();
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
  return silentium.Message(function OnlyChangedImpl(r) {
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
  const $baseShared = silentium.Shared($base);
  const $keyedShared = silentium.Shared(silentium.Actual(key));
  return silentium.Source(
    function PartImpl(r) {
      silentium.All($baseShared, $keyedShared).then(([base, keyed]) => {
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
      const key2 = silentium.Primitive($keyedShared);
      if (silentium.isFilled(key2)) {
        const base = silentium.Primitive($base);
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
  const $base = silentium.Actual(_base);
  const $keyed = silentium.Actual(_keyed);
  const $def = silentium.Actual(def ?? NotSet);
  return silentium.Empty(
    silentium.Applied(silentium.All($base, $keyed, $def), ([base, keyed, d]) => {
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
    })
  );
}

function Polling($base, $trigger) {
  return silentium.Message(function PollingImpl(r) {
    $trigger.then(() => {
      $base.then(r);
    });
  });
}

function RecordTruncated(_record, _badValues) {
  const $record = silentium.Actual(_record);
  const $badValues = silentium.Actual(_badValues);
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
  return silentium.Computed(processRecord, $record, $badValues);
}

function Shot($target, $trigger) {
  return silentium.Message(function ShotImpl(r) {
    const targetSync = silentium.Primitive($target);
    targetSync.primitive();
    $trigger.then(() => {
      const value = targetSync.primitive();
      if (silentium.isFilled(value)) {
        r(value);
      }
    });
  });
}

function Task(baseSrc, delay = 0) {
  const $base = silentium.Actual(baseSrc);
  return silentium.Message(function TaskImpl(r) {
    let prevTimer = null;
    silentium.ExecutorApplied($base, (fn) => {
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
  return silentium.Message(function TickImpl(r) {
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
  return silentium.Message(function HashTableImpl(r) {
    const record = {};
    $base.then(([key, value]) => {
      record[key] = value;
      r(record);
    });
  });
}

function Record(record) {
  return silentium.Message(function RecordImpl(r) {
    const keys = Object.keys(record);
    keys.forEach((key) => {
      record[key] = silentium.Actual(record[key]);
    });
    silentium.All(...Object.values(record)).then((entries) => {
      const record2 = {};
      entries.forEach((entry, index) => {
        record2[keys[index]] = entry;
      });
      r(record2);
    });
  });
}

function Transformed(_base, transformRules) {
  const $base = silentium.Actual(_base);
  return silentium.Message((resolve) => {
    $base.then((v) => {
      const existedKeysMap = {};
      const sourceObject = Object.fromEntries(
        Object.entries(v).map((entry) => {
          if (transformRules[entry[0]]) {
            existedKeysMap[entry[0]] = 1;
            return [entry[0], transformRules[entry[0]](v)];
          }
          return [entry[0], silentium.Of(entry[1])];
        })
      );
      Object.keys(transformRules).forEach((key) => {
        if (!existedKeysMap[key]) {
          sourceObject[key] = transformRules[key](v);
        }
      });
      const record = silentium.Once(Record(sourceObject));
      record.then(resolve);
    });
  });
}

function TransformedList(_base, transformRules) {
  return silentium.Map(silentium.Actual(_base), (v) => Transformed(v, transformRules));
}

function And($one, $two) {
  return silentium.Message(function AndImpl(r) {
    silentium.All($one, $two).then(([one, two]) => {
      r(!!(one && two));
    });
  });
}

function Bool($base) {
  return silentium.Message(function BoolImpl(r) {
    silentium.Applied($base, Boolean).then(r);
  });
}

function Not($base) {
  return silentium.Message(function NotImpl(r) {
    $base.then((v) => {
      r(!v);
    });
  });
}

function Or($one, $two) {
  return silentium.Message(function OrImpl(r) {
    silentium.All($one, $two).then(([one, two]) => {
      r(!!(one || two));
    });
  });
}

function FromJson($json) {
  return silentium.Message(function FromJsonImpl(resolve, reject) {
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
  return silentium.Message(function ToJsonImpl(resolve, reject) {
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
  return silentium.Message(function FirstImpl(r) {
    silentium.Applied($base, (a) => a[0]).then(r);
  });
}

function RegexpMatch(patternSrc, valueSrc, flagsSrc = silentium.Of("")) {
  const $pattern = silentium.Actual(patternSrc);
  const $value = silentium.Actual(valueSrc);
  const $flags = silentium.Actual(flagsSrc);
  return silentium.Message(function RegexpMatchImpl(r) {
    silentium.All($pattern, $value, $flags).then(([pattern, value, flags]) => {
      const result = new RegExp(pattern, flags).exec(value);
      r(result ?? []);
    });
  });
}

function RegexpMatched(patternSrc, valueSrc, flagsSrc = silentium.Of("")) {
  const $pattern = silentium.Actual(patternSrc);
  const $value = silentium.Actual(valueSrc);
  const $flags = silentium.Actual(flagsSrc);
  return silentium.Message(function RegexpMatchedImpl(r) {
    silentium.All($pattern, $value, $flags).then(([pattern, value, flags]) => {
      r(new RegExp(pattern, flags).test(value));
    });
  });
}

function RegexpReplaced(valueSrc, patternSrc, replaceValueSrc, flagsSrc = "") {
  const $value = silentium.Actual(valueSrc);
  const $pattern = silentium.Actual(patternSrc);
  const $replaceValue = silentium.Actual(replaceValueSrc);
  const $flags = silentium.Actual(flagsSrc);
  return silentium.Applied(
    silentium.All($pattern, $value, $replaceValue, $flags),
    ([pattern, value, replaceValue, flags]) => {
      return String(value).replace(new RegExp(pattern, flags), replaceValue);
    }
  );
}

function Set(baseSrc, keySrc, valueSrc) {
  const $base = silentium.Actual(baseSrc);
  const $key = silentium.Actual(keySrc);
  const $value = silentium.Actual(valueSrc);
  return silentium.Message(function SetImpl(r) {
    silentium.All($base, $key, $value).then(([base, key, value]) => {
      base[key] = value;
      r(base);
    });
  });
}

function Router($url, routes, $default) {
  const $routes = silentium.Actual(routes);
  return silentium.Message(function RouterImpl(r) {
    const dc = silentium.DestroyContainer();
    const destructor = () => {
      dc.destroy();
    };
    silentium.All($routes, $url).then(([routes2, url]) => {
      destructor();
      const $matches = silentium.All(
        ...routes2.map(
          (r2) => RegexpMatched(
            silentium.Of(r2.pattern),
            silentium.Of(url),
            r2.patternFlags ? silentium.Of(r2.patternFlags) : void 0
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

function Concatenated(sources, joinPartSrc = silentium.Of("")) {
  return silentium.Message(function ConcatenatedImpl(r) {
    silentium.All(joinPartSrc, ...sources).then(([joinPart, ...strings]) => {
      r(strings.join(joinPart));
    });
  });
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
function Template(src = "", $places = silentium.Of({})) {
  const $src = silentium.Late();
  if (typeof src === "string" || silentium.isMessage(src)) {
    $src.chain(silentium.Actual(src));
  }
  const t = new TemplateImpl($src, $places ? silentium.Actual($places) : void 0);
  if (typeof src === "function") {
    $src.chain(
      silentium.Message((r) => {
        r(src(t));
      })
    );
  }
  return t;
}
class TemplateImpl {
  constructor($src = silentium.Of(""), $places = silentium.Of({}), escapeFn = escaped) {
    this.$src = $src;
    this.$places = $places;
    this.escapeFn = escapeFn;
    __publicField(this, "dc", silentium.DestroyContainer());
    __publicField(this, "rejections", new silentium.Rejections());
    __publicField(this, "vars", {
      $TPL: silentium.Of("$TPL")
    });
  }
  then(transport) {
    const $vars = Record(this.vars);
    silentium.Applied(silentium.All(this.$src, this.$places, $vars), ([base, rules, vars]) => {
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
    this.$src = silentium.Of(value);
  }
  /**
   * Register raw unsafe variable
   */
  raw(src) {
    const hash = Date.now().toString(36) + Math.random().toString(36).substring(2);
    const varName = `$var${hash}`;
    if (silentium.isDestroyable(src)) {
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
    if (silentium.isDestroyable(src)) {
      this.dc.add(src);
    }
    return this.raw(silentium.Applied(src, this.escapeFn));
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
exports.MergeAccumulation = MergeAccumulation;
exports.Not = Not;
exports.OnlyChanged = OnlyChanged;
exports.Or = Or;
exports.Part = Part;
exports.Path = Path;
exports.Polling = Polling;
exports.Record = Record;
exports.RecordTruncated = RecordTruncated;
exports.RegexpMatch = RegexpMatch;
exports.RegexpMatched = RegexpMatched;
exports.RegexpReplaced = RegexpReplaced;
exports.Router = Router;
exports.Set = Set;
exports.Shot = Shot;
exports.Task = Task;
exports.Template = Template;
exports.TemplateImpl = TemplateImpl;
exports.Tick = Tick;
exports.ToJson = ToJson;
exports.Transformed = Transformed;
exports.TransformedList = TransformedList;
exports.escaped = escaped;
//# sourceMappingURL=silentium-components.cjs.map
