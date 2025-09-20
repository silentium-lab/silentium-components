'use strict';

var silentium = require('silentium');

var __defProp$5 = Object.defineProperty;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$5 = (obj, key, value) => __defNormalProp$5(obj, typeof key !== "symbol" ? key + "" : key, value);
class Sync extends silentium.TheInformation {
  constructor(baseSrc) {
    super(baseSrc);
    this.baseSrc = baseSrc;
    __publicField$5(this, "theValue");
    __publicField$5(this, "isInit", false);
  }
  value(o) {
    this.baseSrc.value(o);
    return this;
  }
  valueExisted() {
    this.initOwner();
    return silentium.isFilled(this.theValue);
  }
  valueSync() {
    this.initOwner();
    if (!silentium.isFilled(this.theValue)) {
      throw new Error("no value in sync");
    }
    return this.theValue;
  }
  initOwner() {
    if (!this.isInit) {
      this.isInit = true;
      this.value(
        new silentium.From((v) => {
          this.theValue = v;
        })
      );
    }
    return this;
  }
}

class Branch extends silentium.TheInformation {
  constructor(conditionSrc, leftSrc, rightSrc) {
    super([conditionSrc, leftSrc, rightSrc]);
    this.conditionSrc = conditionSrc;
    this.leftSrc = leftSrc;
    this.rightSrc = rightSrc;
  }
  value(o) {
    const leftSync = new Sync(this.leftSrc).initOwner();
    let rightSync;
    if (this.rightSrc !== void 0) {
      rightSync = new Sync(this.rightSrc).initOwner();
    }
    this.conditionSrc.value(
      new silentium.From((v) => {
        if (v) {
          o.give(leftSync.valueSync());
        } else if (rightSync) {
          o.give(rightSync.valueSync());
        }
      })
    );
    return this;
  }
}

class Const extends silentium.TheInformation {
  constructor(permanentValue, triggerSrc) {
    super(triggerSrc);
    this.permanentValue = permanentValue;
    this.triggerSrc = triggerSrc;
  }
  value(o) {
    this.triggerSrc.value(
      new silentium.From(() => {
        o.give(this.permanentValue);
      })
    );
    return this;
  }
}

class Deadline extends silentium.TheInformation {
  constructor(error, baseSrc, timeoutSrc) {
    super([error, baseSrc, timeoutSrc]);
    this.error = error;
    this.baseSrc = baseSrc;
    this.timeoutSrc = timeoutSrc;
  }
  value(o) {
    let timerHead = null;
    const s = new silentium.Shared(this.baseSrc, true);
    this.addDep(s);
    this.timeoutSrc.value(
      new silentium.From((timeout) => {
        if (timerHead) {
          clearTimeout(timerHead);
        }
        let timeoutReached = false;
        timerHead = setTimeout(() => {
          if (timeoutReached) {
            return;
          }
          timeoutReached = true;
          this.error.give(new Error("Timeout reached in Deadline class"));
        }, timeout);
        const f = new silentium.Filtered(s, () => !timeoutReached);
        this.addDep(f);
        f.value(o);
        s.value(
          new silentium.From(() => {
            timeoutReached = true;
          })
        );
      })
    );
    return this;
  }
}

class Deferred extends silentium.TheInformation {
  constructor(baseSrc, triggerSrc) {
    super();
    this.baseSrc = baseSrc;
    this.triggerSrc = triggerSrc;
  }
  value(o) {
    const baseSync = new Sync(this.baseSrc).initOwner();
    this.triggerSrc.value(
      new silentium.From(() => {
        if (silentium.isFilled(baseSync.valueSync())) {
          o.give(baseSync.valueSync());
        }
      })
    );
    return this;
  }
}

var __defProp$4 = Object.defineProperty;
var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$4 = (obj, key, value) => __defNormalProp$4(obj, key + "" , value);
class Dirty extends silentium.TheInformation {
  constructor(baseEntitySource, alwaysKeep = [], excludeKeys = []) {
    super([baseEntitySource]);
    this.baseEntitySource = baseEntitySource;
    this.alwaysKeep = alwaysKeep;
    this.excludeKeys = excludeKeys;
    __publicField$4(this, "comparingSrc", new silentium.Late());
  }
  value(o) {
    const comparingDetached = new silentium.Applied(
      this.comparingSrc,
      (value) => JSON.parse(JSON.stringify(value))
    );
    const allSrc = new silentium.All(comparingDetached, this.baseEntitySource).value(
      new silentium.From(([comparing, base]) => {
        if (!comparing) {
          return;
        }
        o.give(
          Object.fromEntries(
            Object.entries(comparing).filter(([key, value]) => {
              if (this.alwaysKeep.includes(key)) {
                return true;
              }
              if (this.excludeKeys.includes(key)) {
                return false;
              }
              return value !== base[key];
            })
          )
        );
      })
    );
    this.addDep(allSrc);
    return this;
  }
  give(value) {
    this.comparingSrc.give(value);
    return this;
  }
}

class Loading extends silentium.TheInformation {
  constructor(loadingStartSrc, loadingFinishSrc) {
    super(loadingFinishSrc, loadingStartSrc);
    this.loadingStartSrc = loadingStartSrc;
    this.loadingFinishSrc = loadingFinishSrc;
  }
  value(o) {
    this.loadingStartSrc.value(
      new silentium.From(() => {
        o.give(true);
      })
    );
    this.loadingFinishSrc.value(
      new silentium.From(() => {
        o.give(false);
      })
    );
    return this;
  }
}

class Lock extends silentium.TheInformation {
  constructor(baseSrc, lockSrc) {
    super(baseSrc, lockSrc);
    this.baseSrc = baseSrc;
    this.lockSrc = lockSrc;
  }
  value(o) {
    let locked = false;
    this.lockSrc.value(
      new silentium.From((newLock) => {
        locked = newLock;
      })
    );
    const i = new silentium.Filtered(this.baseSrc, () => !locked);
    this.addDep(i);
    i.value(o);
    return this;
  }
}

class Memo extends silentium.TheInformation {
  constructor(baseSrc) {
    super(baseSrc);
    this.baseSrc = baseSrc;
  }
  value(o) {
    let lastValue = null;
    this.baseSrc.value(
      new silentium.From((v) => {
        if (v !== lastValue) {
          o.give(v);
          lastValue = v;
        }
      })
    );
    return this;
  }
}

class OnlyChanged extends silentium.TheInformation {
  constructor(baseSrc) {
    super(baseSrc);
    this.baseSrc = baseSrc;
  }
  value(o) {
    let firstValue = false;
    this.baseSrc.value(
      new silentium.From((v) => {
        if (firstValue === false) {
          firstValue = true;
        } else {
          o.give(v);
        }
      })
    );
    return this;
  }
}

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
class Part extends silentium.TheInformation {
  constructor(baseSrc, key) {
    super(baseSrc);
    this.baseSrc = baseSrc;
    this.key = key;
    __publicField$3(this, "baseSync");
    __publicField$3(this, "keySync");
    __publicField$3(this, "keySrc");
    this.keySrc = new silentium.MbInfo(key);
    this.baseSync = new Sync(baseSrc);
    this.keySync = new Sync(this.keySrc);
  }
  value(o) {
    const allSrc = new silentium.All(this.baseSrc, this.keySrc).value(
      new silentium.From(([base, key]) => {
        const keyChunks = key.split(".");
        let value = base;
        keyChunks.forEach((keyChunk) => {
          value = value[keyChunk];
        });
        if (value !== void 0 && value !== base) {
          o.give(value);
        }
      })
    );
    this.addDep(allSrc);
    return this;
  }
  give(value) {
    this.baseSrc.give({
      ...this.baseSync.valueSync(),
      [this.keySync.valueSync()]: value
    });
    return this;
  }
}

class Path extends silentium.TheInformation {
  constructor(baseSrc, keySrc) {
    super(baseSrc, keySrc);
    this.baseSrc = baseSrc;
    this.keySrc = keySrc;
  }
  value(o) {
    const allSrc = new silentium.All(this.baseSrc, this.keySrc).value(
      new silentium.From(([base, key]) => {
        const keyChunks = key.split(".");
        let value = base;
        keyChunks.forEach((keyChunk) => {
          value = value[keyChunk];
        });
        if (value !== void 0 && value !== base) {
          o.give(value);
        }
      })
    );
    this.addDep(allSrc);
    return this;
  }
}

class Polling extends silentium.TheInformation {
  constructor(baseSrc, triggerSrc) {
    super(baseSrc, triggerSrc);
    this.baseSrc = baseSrc;
    this.triggerSrc = triggerSrc;
  }
  value(o) {
    this.triggerSrc.value(
      new silentium.From(() => {
        this.baseSrc.value(
          new silentium.From((v) => {
            o.give(v);
          })
        );
      })
    );
    return this;
  }
}

class Shot extends silentium.TheInformation {
  constructor(targetSrc, triggerSrc) {
    super(targetSrc, triggerSrc);
    this.targetSrc = targetSrc;
    this.triggerSrc = triggerSrc;
  }
  value(o) {
    const targetSync = new Sync(this.targetSrc);
    targetSync.initOwner();
    this.triggerSrc.value(
      new silentium.From(() => {
        if (targetSync.valueExisted()) {
          o.give(targetSync.valueSync());
        }
      })
    );
    return this;
  }
}

class Tick extends silentium.TheInformation {
  constructor(baseSrc) {
    super(baseSrc);
    this.baseSrc = baseSrc;
  }
  value(o) {
    let microtaskScheduled = false;
    let lastValue = null;
    const scheduleMicrotask = () => {
      microtaskScheduled = true;
      queueMicrotask(() => {
        microtaskScheduled = false;
        if (lastValue !== null) {
          o.give(lastValue);
          lastValue = null;
        }
      });
    };
    this.baseSrc.value(
      new silentium.From((v) => {
        lastValue = v;
        if (!microtaskScheduled) {
          scheduleMicrotask();
        }
      })
    );
    return this;
  }
}

class HashTable extends silentium.TheInformation {
  constructor(baseSrc) {
    super(baseSrc);
    this.baseSrc = baseSrc;
  }
  value(o) {
    const record = {};
    this.baseSrc.value(
      new silentium.From(([key, value]) => {
        record[key] = value;
        o.give(record);
      })
    );
    return this;
  }
}

class RecordOf extends silentium.TheInformation {
  constructor(recordSrc) {
    super(...Object.values(recordSrc));
    this.recordSrc = recordSrc;
  }
  value(o) {
    const keys = Object.keys(this.recordSrc);
    new silentium.All(...Object.values(this.recordSrc)).value(
      new silentium.From((entries) => {
        const record = {};
        entries.forEach((entry, index) => {
          record[keys[index]] = entry;
        });
        o.give(record);
      })
    );
    return this;
  }
}

class Concatenated extends silentium.TheInformation {
  constructor(sources, joinPartSrc = new silentium.Of("")) {
    super(...sources, joinPartSrc);
    this.sources = sources;
    this.joinPartSrc = joinPartSrc;
  }
  value(o) {
    new silentium.All(this.joinPartSrc, ...this.sources).value(
      new silentium.From(([joinPart, ...strings]) => {
        o.give(strings.join(joinPart));
      })
    );
    return this;
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
class Template extends silentium.TheInformation {
  constructor(theSrc = "", placesSrc = new silentium.Of({})) {
    const source = typeof theSrc === "string" ? new silentium.Of(theSrc) : theSrc;
    super(source, placesSrc);
    this.placesSrc = placesSrc;
    __publicField$2(this, "source");
    __publicField$2(this, "placesCounter", 0);
    __publicField$2(this, "vars", {
      $TPL: new silentium.Of("$TPL")
    });
    this.source = source;
  }
  value(guest) {
    const varsSrc = new RecordOf(this.vars);
    new silentium.Applied(
      new silentium.All(this.source, this.placesSrc, varsSrc),
      ([base, rules, vars]) => {
        Object.entries(rules).forEach(([ph, val]) => {
          base = base.replaceAll(ph, String(val));
        });
        Object.entries(vars).forEach(([ph, val]) => {
          base = base.replaceAll(ph, String(val));
        });
        return base;
      }
    ).value(guest);
    return this;
  }
  template(value) {
    this.source = new silentium.Of(value);
    this.addDep(this.source);
    return this;
  }
  /**
   * Ability to register variable
   * in concrete place of template
   */
  var(src) {
    this.addDep(src);
    const varName = `$var${this.placesCounter}`;
    this.placesCounter += 1;
    this.vars[varName] = src;
    return varName;
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, key + "" , value);
class BranchLazy extends silentium.TheInformation {
  constructor(conditionSrc, leftSrc, rightSrc) {
    super([conditionSrc, leftSrc, rightSrc]);
    this.conditionSrc = conditionSrc;
    this.leftSrc = leftSrc;
    this.rightSrc = rightSrc;
    __publicField$1(this, "instances", []);
  }
  value(o) {
    this.conditionSrc.value(
      new silentium.From((v) => {
        if (this.instances.length) {
          this.instances.forEach((instance2) => {
            instance2?.destroy();
          });
        }
        let instance = null;
        if (v) {
          instance = this.leftSrc.get();
        } else if (this.rightSrc) {
          instance = this.rightSrc.get();
        }
        if (instance) {
          this.instances.push(instance);
          instance.value(o);
        }
      })
    );
    return this;
  }
}

class RegexpMatched extends silentium.TheInformation {
  constructor(patternSrc, valueSrc, flagsSrc = new silentium.Of("")) {
    super(patternSrc, valueSrc, flagsSrc);
    this.patternSrc = patternSrc;
    this.valueSrc = valueSrc;
    this.flagsSrc = flagsSrc;
  }
  value(o) {
    new silentium.All(this.patternSrc, this.valueSrc, this.flagsSrc).value(
      new silentium.From(([pattern, value, flags]) => {
        o.give(new RegExp(pattern, flags).test(value));
      })
    );
    return this;
  }
}

class RegexpReplaced extends silentium.TheInformation {
  constructor(valueSrc, patternSrc, replaceValueSrc, flagsSrc = new silentium.Of("")) {
    super(valueSrc, patternSrc, replaceValueSrc, flagsSrc);
    this.valueSrc = valueSrc;
    this.patternSrc = patternSrc;
    this.replaceValueSrc = replaceValueSrc;
    this.flagsSrc = flagsSrc;
  }
  value(o) {
    new silentium.All(
      this.patternSrc,
      this.valueSrc,
      this.replaceValueSrc,
      this.flagsSrc
    ).value(
      new silentium.From(([pattern, value, replaceValue, flags]) => {
        o.give(String(value).replace(new RegExp(pattern, flags), replaceValue));
      })
    );
    return this;
  }
}

class RegexpMatch extends silentium.TheInformation {
  constructor(patternSrc, valueSrc, flagsSrc = new silentium.Of("")) {
    super(patternSrc, valueSrc, flagsSrc);
    this.patternSrc = patternSrc;
    this.valueSrc = valueSrc;
    this.flagsSrc = flagsSrc;
  }
  value(o) {
    new silentium.All(this.patternSrc, this.valueSrc, this.flagsSrc).value(
      new silentium.From(([pattern, value, flags]) => {
        const result = new RegExp(pattern, flags).exec(value);
        o.give(result ?? []);
      })
    );
    return this;
  }
}

class Set extends silentium.TheInformation {
  constructor(baseSrc, keySrc, valueSrc) {
    super(baseSrc, keySrc, valueSrc);
    this.baseSrc = baseSrc;
    this.keySrc = keySrc;
    this.valueSrc = valueSrc;
  }
  value(o) {
    new silentium.All(this.baseSrc, this.keySrc, this.valueSrc).value(
      new silentium.From(([base, key, value]) => {
        base[key] = value;
        o.give(base);
      })
    );
    return this;
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
const emptySrc = new silentium.Lazy(() => new silentium.Of(false));
class Router extends silentium.TheInformation {
  constructor(urlSrc, routesSrc, defaultSrc) {
    super(urlSrc, routesSrc, defaultSrc);
    this.urlSrc = urlSrc;
    this.routesSrc = routesSrc;
    this.defaultSrc = defaultSrc;
    __publicField(this, "instance");
  }
  value(o) {
    new silentium.All(this.routesSrc, this.urlSrc).value(
      new silentium.From(([routes, url]) => {
        if (this.instance) {
          this.instance?.destroy();
        }
        this.instance = new silentium.All(
          this.defaultSrc.get(),
          new silentium.All(
            ...routes.map(
              (r) => new BranchLazy(
                new RegexpMatched(
                  new silentium.Of(r.pattern),
                  new silentium.Of(url),
                  r.patternFlags ? new silentium.Of(r.patternFlags) : void 0
                ),
                r.template,
                emptySrc
              )
            )
          )
        );
        new silentium.Applied(
          this.instance,
          (r) => {
            const firstReal = r[1].find((r2) => r2 !== false);
            if (firstReal) {
              return firstReal;
            }
            return r[0];
          }
        ).value(o);
      })
    );
    return this;
  }
}

class And extends silentium.TheInformation {
  constructor(oneSrc, twoSrc) {
    super(oneSrc, twoSrc);
    this.oneSrc = oneSrc;
    this.twoSrc = twoSrc;
  }
  value(o) {
    new silentium.All(this.oneSrc, this.twoSrc).value(
      new silentium.From(([one, two]) => {
        o.give(one && two);
      })
    );
    return this;
  }
}

class Or extends silentium.TheInformation {
  constructor(oneSrc, twoSrc) {
    super(oneSrc, twoSrc);
    this.oneSrc = oneSrc;
    this.twoSrc = twoSrc;
  }
  value(o) {
    new silentium.All(this.oneSrc, this.twoSrc).value(
      new silentium.From(([one, two]) => {
        o.give(one || two);
      })
    );
    return this;
  }
}

class Not extends silentium.TheInformation {
  constructor(baseSrc) {
    super(baseSrc);
    this.baseSrc = baseSrc;
  }
  value(o) {
    this.baseSrc.value(
      new silentium.From((v) => {
        o.give(!v);
      })
    );
    return this;
  }
}

class Bool extends silentium.TheInformation {
  constructor(baseSrc) {
    super(baseSrc);
    this.baseSrc = baseSrc;
  }
  value(o) {
    new silentium.Applied(this.baseSrc, Boolean).value(o);
    return this;
  }
}

class FromJson extends silentium.TheInformation {
  constructor(jsonSrc, errorOwner) {
    super(jsonSrc);
    this.jsonSrc = jsonSrc;
    this.errorOwner = errorOwner;
  }
  value(o) {
    this.jsonSrc.value(
      new silentium.From((json) => {
        try {
          o.give(JSON.parse(json));
        } catch (error) {
          this.errorOwner?.give(new Error(`Failed to parse JSON: ${error}`));
        }
      })
    );
    return this;
  }
}

class ToJson extends silentium.TheInformation {
  constructor(dataSrc, errorOwner) {
    super(dataSrc);
    this.dataSrc = dataSrc;
    this.errorOwner = errorOwner;
  }
  value(o) {
    this.dataSrc.value(
      new silentium.From((data) => {
        try {
          o.give(JSON.stringify(data));
        } catch {
          this.errorOwner?.give(new Error("Failed to convert to JSON"));
        }
      })
    );
    return this;
  }
}

class First extends silentium.TheInformation {
  constructor(baseSrc) {
    super(baseSrc);
    this.baseSrc = baseSrc;
  }
  value(o) {
    new silentium.Applied(this.baseSrc, (a) => a[0]).value(o);
    return this;
  }
}

exports.And = And;
exports.Bool = Bool;
exports.Branch = Branch;
exports.Concatenated = Concatenated;
exports.Const = Const;
exports.Deadline = Deadline;
exports.Deferred = Deferred;
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
exports.Sync = Sync;
exports.Template = Template;
exports.Tick = Tick;
exports.ToJson = ToJson;
//# sourceMappingURL=silentium-components.cjs.map
