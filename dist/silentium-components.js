import { TheInformation, isFilled, From, Shared, Filtered, Late, Applied, All, MbInfo, Of, Lazy } from 'silentium';

var __defProp$5 = Object.defineProperty;
var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$5 = (obj, key, value) => __defNormalProp$5(obj, typeof key !== "symbol" ? key + "" : key, value);
class Sync extends TheInformation {
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
    return isFilled(this.theValue);
  }
  valueSync() {
    this.initOwner();
    if (!isFilled(this.theValue)) {
      throw new Error("no value in sync");
    }
    return this.theValue;
  }
  initOwner() {
    if (!this.isInit) {
      this.isInit = true;
      this.value(
        new From((v) => {
          this.theValue = v;
        })
      );
    }
    return this;
  }
}

class Branch extends TheInformation {
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
      new From((v) => {
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

class Const extends TheInformation {
  constructor(permanentValue, triggerSrc) {
    super(triggerSrc);
    this.permanentValue = permanentValue;
    this.triggerSrc = triggerSrc;
  }
  value(o) {
    this.triggerSrc.value(
      new From(() => {
        o.give(this.permanentValue);
      })
    );
    return this;
  }
}

class Deadline extends TheInformation {
  constructor(error, baseSrc, timeoutSrc) {
    super([error, baseSrc, timeoutSrc]);
    this.error = error;
    this.baseSrc = baseSrc;
    this.timeoutSrc = timeoutSrc;
  }
  value(o) {
    let timerHead = null;
    const s = new Shared(this.baseSrc, true);
    this.addDep(s);
    this.timeoutSrc.value(
      new From((timeout) => {
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
        const f = new Filtered(s, () => !timeoutReached);
        this.addDep(f);
        f.value(o);
        s.value(
          new From(() => {
            timeoutReached = true;
          })
        );
      })
    );
    return this;
  }
}

class Deferred extends TheInformation {
  constructor(baseSrc, triggerSrc) {
    super();
    this.baseSrc = baseSrc;
    this.triggerSrc = triggerSrc;
  }
  value(o) {
    const baseSync = new Sync(this.baseSrc).initOwner();
    this.triggerSrc.value(
      new From(() => {
        if (isFilled(baseSync.valueSync())) {
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
class Dirty extends TheInformation {
  constructor(baseEntitySource, alwaysKeep = [], excludeKeys = []) {
    super([baseEntitySource]);
    this.baseEntitySource = baseEntitySource;
    this.alwaysKeep = alwaysKeep;
    this.excludeKeys = excludeKeys;
    __publicField$4(this, "comparingSrc", new Late());
  }
  value(o) {
    const comparingDetached = new Applied(
      this.comparingSrc,
      (value) => JSON.parse(JSON.stringify(value))
    );
    const allSrc = new All(comparingDetached, this.baseEntitySource).value(
      new From(([comparing, base]) => {
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

class Loading extends TheInformation {
  constructor(loadingStartSrc, loadingFinishSrc) {
    super(loadingFinishSrc, loadingStartSrc);
    this.loadingStartSrc = loadingStartSrc;
    this.loadingFinishSrc = loadingFinishSrc;
  }
  value(o) {
    this.loadingStartSrc.value(
      new From(() => {
        o.give(true);
      })
    );
    this.loadingFinishSrc.value(
      new From(() => {
        o.give(false);
      })
    );
    return this;
  }
}

class Lock extends TheInformation {
  constructor(baseSrc, lockSrc) {
    super(baseSrc, lockSrc);
    this.baseSrc = baseSrc;
    this.lockSrc = lockSrc;
  }
  value(o) {
    let locked = false;
    this.lockSrc.value(
      new From((newLock) => {
        locked = newLock;
      })
    );
    const i = new Filtered(this.baseSrc, () => !locked);
    this.addDep(i);
    i.value(o);
    return this;
  }
}

class Memo extends TheInformation {
  constructor(baseSrc) {
    super(baseSrc);
    this.baseSrc = baseSrc;
  }
  value(o) {
    let lastValue = null;
    this.baseSrc.value(
      new From((v) => {
        if (v !== lastValue) {
          o.give(v);
          lastValue = v;
        }
      })
    );
    return this;
  }
}

class OnlyChanged extends TheInformation {
  constructor(baseSrc) {
    super(baseSrc);
    this.baseSrc = baseSrc;
  }
  value(o) {
    let firstValue = false;
    this.baseSrc.value(
      new From((v) => {
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
class Part extends TheInformation {
  constructor(baseSrc, key) {
    super(baseSrc);
    this.baseSrc = baseSrc;
    this.key = key;
    __publicField$3(this, "baseSync");
    __publicField$3(this, "keySync");
    __publicField$3(this, "keySrc");
    this.keySrc = new MbInfo(key);
    this.baseSync = new Sync(baseSrc);
    this.keySync = new Sync(this.keySrc);
  }
  value(o) {
    const allSrc = new All(this.baseSrc, this.keySrc).value(
      new From(([base, key]) => {
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

class Path extends TheInformation {
  constructor(baseSrc, keySrc) {
    super(baseSrc, keySrc);
    this.baseSrc = baseSrc;
    this.keySrc = keySrc;
  }
  value(o) {
    const allSrc = new All(this.baseSrc, this.keySrc).value(
      new From(([base, key]) => {
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

class Polling extends TheInformation {
  constructor(baseSrc, triggerSrc) {
    super(baseSrc, triggerSrc);
    this.baseSrc = baseSrc;
    this.triggerSrc = triggerSrc;
  }
  value(o) {
    this.triggerSrc.value(
      new From(() => {
        this.baseSrc.value(
          new From((v) => {
            o.give(v);
          })
        );
      })
    );
    return this;
  }
}

class Shot extends TheInformation {
  constructor(targetSrc, triggerSrc) {
    super(targetSrc, triggerSrc);
    this.targetSrc = targetSrc;
    this.triggerSrc = triggerSrc;
  }
  value(o) {
    const targetSync = new Sync(this.targetSrc);
    targetSync.initOwner();
    this.triggerSrc.value(
      new From(() => {
        if (targetSync.valueExisted()) {
          o.give(targetSync.valueSync());
        }
      })
    );
    return this;
  }
}

class Tick extends TheInformation {
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
      new From((v) => {
        lastValue = v;
        if (!microtaskScheduled) {
          scheduleMicrotask();
        }
      })
    );
    return this;
  }
}

class HashTable extends TheInformation {
  constructor(baseSrc) {
    super(baseSrc);
    this.baseSrc = baseSrc;
  }
  value(o) {
    const record = {};
    this.baseSrc.value(
      new From(([key, value]) => {
        record[key] = value;
        o.give(record);
      })
    );
    return this;
  }
}

class RecordOf extends TheInformation {
  constructor(recordSrc) {
    super(...Object.values(recordSrc));
    this.recordSrc = recordSrc;
  }
  value(o) {
    const keys = Object.keys(this.recordSrc);
    new All(...Object.values(this.recordSrc)).value(
      new From((entries) => {
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

class Concatenated extends TheInformation {
  constructor(sources, joinPartSrc = new Of("")) {
    super(...sources, joinPartSrc);
    this.sources = sources;
    this.joinPartSrc = joinPartSrc;
  }
  value(o) {
    new All(this.joinPartSrc, ...this.sources).value(
      new From(([joinPart, ...strings]) => {
        o.give(strings.join(joinPart));
      })
    );
    return this;
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
class Template extends TheInformation {
  constructor(theSrc = "", placesSrc = new Of({})) {
    const source = typeof theSrc === "string" ? new Of(theSrc) : theSrc;
    super(source, placesSrc);
    this.placesSrc = placesSrc;
    __publicField$2(this, "source");
    __publicField$2(this, "placesCounter", 0);
    __publicField$2(this, "vars", {
      $TPL: new Of("$TPL")
    });
    this.source = source;
  }
  value(guest) {
    const varsSrc = new RecordOf(this.vars);
    new Applied(
      new All(this.source, this.placesSrc, varsSrc),
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
    this.source = new Of(value);
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
class BranchLazy extends TheInformation {
  constructor(conditionSrc, leftSrc, rightSrc) {
    super([conditionSrc, leftSrc, rightSrc]);
    this.conditionSrc = conditionSrc;
    this.leftSrc = leftSrc;
    this.rightSrc = rightSrc;
    __publicField$1(this, "instances", []);
  }
  value(o) {
    this.conditionSrc.value(
      new From((v) => {
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

class RegexpMatched extends TheInformation {
  constructor(patternSrc, valueSrc, flagsSrc = new Of("")) {
    super(patternSrc, valueSrc, flagsSrc);
    this.patternSrc = patternSrc;
    this.valueSrc = valueSrc;
    this.flagsSrc = flagsSrc;
  }
  value(o) {
    new All(this.patternSrc, this.valueSrc, this.flagsSrc).value(
      new From(([pattern, value, flags]) => {
        o.give(new RegExp(pattern, flags).test(value));
      })
    );
    return this;
  }
}

class RegexpReplaced extends TheInformation {
  constructor(valueSrc, patternSrc, replaceValueSrc, flagsSrc = new Of("")) {
    super(valueSrc, patternSrc, replaceValueSrc, flagsSrc);
    this.valueSrc = valueSrc;
    this.patternSrc = patternSrc;
    this.replaceValueSrc = replaceValueSrc;
    this.flagsSrc = flagsSrc;
  }
  value(o) {
    new All(
      this.patternSrc,
      this.valueSrc,
      this.replaceValueSrc,
      this.flagsSrc
    ).value(
      new From(([pattern, value, replaceValue, flags]) => {
        o.give(String(value).replace(new RegExp(pattern, flags), replaceValue));
      })
    );
    return this;
  }
}

class RegexpMatch extends TheInformation {
  constructor(patternSrc, valueSrc, flagsSrc = new Of("")) {
    super(patternSrc, valueSrc, flagsSrc);
    this.patternSrc = patternSrc;
    this.valueSrc = valueSrc;
    this.flagsSrc = flagsSrc;
  }
  value(o) {
    new All(this.patternSrc, this.valueSrc, this.flagsSrc).value(
      new From(([pattern, value, flags]) => {
        const result = new RegExp(pattern, flags).exec(value);
        o.give(result ?? []);
      })
    );
    return this;
  }
}

class Set extends TheInformation {
  constructor(baseSrc, keySrc, valueSrc) {
    super(baseSrc, keySrc, valueSrc);
    this.baseSrc = baseSrc;
    this.keySrc = keySrc;
    this.valueSrc = valueSrc;
  }
  value(o) {
    new All(this.baseSrc, this.keySrc, this.valueSrc).value(
      new From(([base, key, value]) => {
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
const emptySrc = new Lazy(() => new Of(false));
class Router extends TheInformation {
  constructor(urlSrc, routesSrc, defaultSrc) {
    super(urlSrc, routesSrc, defaultSrc);
    this.urlSrc = urlSrc;
    this.routesSrc = routesSrc;
    this.defaultSrc = defaultSrc;
    __publicField(this, "instance");
  }
  value(o) {
    new All(this.routesSrc, this.urlSrc).value(
      new From(([routes, url]) => {
        if (this.instance) {
          this.instance?.destroy();
        }
        this.instance = new All(
          this.defaultSrc.get(),
          new All(
            ...routes.map(
              (r) => new BranchLazy(
                new RegexpMatched(
                  new Of(r.pattern),
                  new Of(url),
                  r.patternFlags ? new Of(r.patternFlags) : void 0
                ),
                r.template,
                emptySrc
              )
            )
          )
        );
        new Applied(
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

class And extends TheInformation {
  constructor(oneSrc, twoSrc) {
    super(oneSrc, twoSrc);
    this.oneSrc = oneSrc;
    this.twoSrc = twoSrc;
  }
  value(o) {
    new All(this.oneSrc, this.twoSrc).value(
      new From(([one, two]) => {
        o.give(one && two);
      })
    );
    return this;
  }
}

class Or extends TheInformation {
  constructor(oneSrc, twoSrc) {
    super(oneSrc, twoSrc);
    this.oneSrc = oneSrc;
    this.twoSrc = twoSrc;
  }
  value(o) {
    new All(this.oneSrc, this.twoSrc).value(
      new From(([one, two]) => {
        o.give(one || two);
      })
    );
    return this;
  }
}

class Not extends TheInformation {
  constructor(baseSrc) {
    super(baseSrc);
    this.baseSrc = baseSrc;
  }
  value(o) {
    this.baseSrc.value(
      new From((v) => {
        o.give(!v);
      })
    );
    return this;
  }
}

class Bool extends TheInformation {
  constructor(baseSrc) {
    super(baseSrc);
    this.baseSrc = baseSrc;
  }
  value(o) {
    new Applied(this.baseSrc, Boolean).value(o);
    return this;
  }
}

class FromJson extends TheInformation {
  constructor(jsonSrc, errorOwner) {
    super(jsonSrc);
    this.jsonSrc = jsonSrc;
    this.errorOwner = errorOwner;
  }
  value(o) {
    this.jsonSrc.value(
      new From((json) => {
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

class ToJson extends TheInformation {
  constructor(dataSrc, errorOwner) {
    super(dataSrc);
    this.dataSrc = dataSrc;
    this.errorOwner = errorOwner;
  }
  value(o) {
    this.dataSrc.value(
      new From((data) => {
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

class First extends TheInformation {
  constructor(baseSrc) {
    super(baseSrc);
    this.baseSrc = baseSrc;
  }
  value(o) {
    new Applied(this.baseSrc, (a) => a[0]).value(o);
    return this;
  }
}

export { And, Bool, Branch, Concatenated, Const, Deadline, Deferred, Dirty, First, FromJson, HashTable, Loading, Lock, Memo, Not, OnlyChanged, Or, Part, Path, Polling, RecordOf, RegexpMatch, RegexpMatched, RegexpReplaced, Router, Set, Shot, Sync, Template, Tick, ToJson };
//# sourceMappingURL=silentium-components.js.map
