'use strict';

var silentium = require('silentium');

function Branch(conditionSrc, leftSrc, rightSrc) {
  return (user) => {
    const leftSync = silentium.Primitive(leftSrc);
    let rightSync;
    if (rightSrc !== void 0) {
      rightSync = silentium.Primitive(rightSrc);
    }
    conditionSrc((v) => {
      let result = null;
      if (v) {
        result = leftSync.primitive();
      } else if (rightSync) {
        result = rightSync.primitive();
      }
      if (result !== null) {
        user(result);
      }
    });
  };
}

function BranchLazy(conditionSrc, leftSrc, rightSrc) {
  return (user) => {
    let Destructor;
    conditionSrc((v) => {
      if (Destructor !== void 0 && typeof Destructor === "function") {
        Destructor();
      }
      let instance = null;
      if (v) {
        instance = leftSrc();
      } else if (rightSrc) {
        instance = rightSrc();
      }
      if (instance) {
        Destructor = instance(user);
      }
    });
    return () => {
      Destructor?.();
    };
  };
}

function Constant(permanentValue, triggerSrc) {
  return (user) => {
    triggerSrc(() => {
      user(permanentValue);
    });
  };
}

function Deadline(error, baseSrc, timeoutSrc) {
  return (user) => {
    let timerHead = null;
    const s = silentium.Shared(baseSrc, true);
    timeoutSrc((timeout) => {
      if (timerHead) {
        clearTimeout(timerHead);
      }
      let timeoutReached = false;
      timerHead = setTimeout(() => {
        if (timeoutReached) {
          return;
        }
        timeoutReached = true;
        error(new Error("Timeout reached in Deadline class"));
      }, timeout);
      const f = silentium.Filtered(s.event, () => !timeoutReached);
      f(user);
      s.event(() => {
        timeoutReached = true;
      });
    });
  };
}

function Deferred(baseSrc, triggerSrc) {
  return (user) => {
    const baseSync = silentium.Primitive(baseSrc);
    triggerSrc(() => {
      const value = baseSync.primitive();
      if (silentium.isFilled(value)) {
        user(value);
      }
    });
  };
}

function Detached(baseSrc) {
  return function Detached2(user) {
    const v = silentium.Primitive(baseSrc).primitive();
    if (silentium.isFilled(v)) {
      user(v);
    }
  };
}

function Dirty(baseEntitySource, alwaysKeep = [], excludeKeys = [], cloneFn) {
  const comparingSrc = silentium.Late();
  if (cloneFn === void 0) {
    cloneFn = (value) => JSON.parse(JSON.stringify(value));
  }
  return {
    event: (user) => {
      const comparingDetached = silentium.Applied(comparingSrc.event, cloneFn);
      silentium.All(
        comparingDetached,
        baseEntitySource
      )(([comparing, base]) => {
        if (!comparing) {
          return;
        }
        user(
          Object.fromEntries(
            Object.entries(comparing).filter(([key, value]) => {
              if (alwaysKeep.includes(key)) {
                return true;
              }
              if (excludeKeys.includes(key)) {
                return false;
              }
              return value !== base[key];
            })
          )
        );
      });
    },
    use: (v) => {
      comparingSrc.use(v);
    }
  };
}

function Loading(loadingStartSrc, loadingFinishSrc) {
  return (user) => {
    loadingStartSrc(() => user(true));
    loadingFinishSrc(() => user(false));
  };
}

function Lock(baseSrc, lockSrc) {
  return (user) => {
    let locked = false;
    lockSrc((newLock) => {
      locked = newLock;
    });
    const i = silentium.Filtered(baseSrc, () => !locked);
    i(user);
  };
}

function Memo(baseSrc) {
  return (user) => {
    let lastValue = null;
    baseSrc((v) => {
      if (v !== lastValue) {
        user(v);
        lastValue = v;
      }
    });
  };
}

function OnlyChanged(baseSrc) {
  return (user) => {
    let firstValue = false;
    baseSrc((v) => {
      if (firstValue === false) {
        firstValue = true;
      } else {
        user(v);
      }
    });
  };
}

function Part(baseSrc, keySrc) {
  const baseSync = silentium.Primitive(baseSrc.event);
  const keySync = silentium.Primitive(keySrc);
  return {
    event: (user) => {
      silentium.All(
        baseSrc.event,
        keySrc
      )(([base, key]) => {
        const keyChunks = key.split(".");
        let value = base;
        keyChunks.forEach((keyChunk) => {
          value = value[keyChunk];
        });
        if (value !== void 0 && value !== base) {
          user(value);
        }
      });
    },
    use: (value) => {
      const key = keySync.primitive();
      if (silentium.isFilled(key)) {
        baseSrc.use({
          ...baseSync.primitive(),
          [key]: value
        });
      }
    }
  };
}

function Path(baseSrc, keySrc) {
  return (user) => {
    silentium.All(
      baseSrc,
      keySrc
    )(([base, key]) => {
      const keyChunks = key.split(".");
      let value = base;
      keyChunks.forEach((keyChunk) => {
        value = value[keyChunk];
      });
      if (value !== void 0 && value !== base) {
        user(value);
      }
    });
  };
}

function Polling(baseSrc, triggerSrc) {
  return (user) => {
    triggerSrc(() => {
      baseSrc(user);
    });
  };
}

function Shot(targetSrc, triggerSrc) {
  return (user) => {
    const targetSync = silentium.Primitive(targetSrc);
    triggerSrc(() => {
      const value = targetSync.primitive();
      if (silentium.isFilled(value)) {
        user(value);
      }
    });
  };
}

function Task(baseSrc, delay = 0) {
  return (user) => {
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
    })(user);
  };
}

function Tick(baseSrc) {
  return (user) => {
    let microtaskScheduled = false;
    let lastValue = null;
    const scheduleMicrotask = () => {
      microtaskScheduled = true;
      queueMicrotask(() => {
        microtaskScheduled = false;
        if (lastValue !== null) {
          user(lastValue);
          lastValue = null;
        }
      });
    };
    baseSrc((v) => {
      lastValue = v;
      if (!microtaskScheduled) {
        scheduleMicrotask();
      }
    });
  };
}

function Transaction($base, eventBuilder, ...args) {
  return (user) => {
    const $res = silentium.LateShared();
    const destructors = [];
    $base((v) => {
      const $event = silentium.Destructor(
        eventBuilder(silentium.Of(v), ...args.map((a) => Detached(a)))
      );
      destructors.push($event);
      $event.event($res.use);
    });
    $res.event(user);
    return () => {
      destructors.forEach((d) => d.destroy());
      destructors.length = 0;
    };
  };
}

function HashTable(baseSrc) {
  return (user) => {
    const record = {};
    baseSrc(([key, value]) => {
      record[key] = value;
      user(record);
    });
  };
}

function RecordOf(recordSrc) {
  return (user) => {
    const keys = Object.keys(recordSrc);
    silentium.All(...Object.values(recordSrc))((entries) => {
      const record = {};
      entries.forEach((entry, index) => {
        record[keys[index]] = entry;
      });
      user(record);
    });
  };
}

function Concatenated(sources, joinPartSrc = silentium.Of("")) {
  return (user) => {
    silentium.All(
      joinPartSrc,
      ...sources
    )(([joinPart, ...strings]) => {
      user(strings.join(joinPart));
    });
  };
}

function Template(theSrc = silentium.Of(""), placesSrc = silentium.Of({})) {
  let placesCounter = 0;
  const vars = {
    $TPL: silentium.Of("$TPL")
  };
  const destructors = [];
  return {
    value: (user) => {
      const varsSrc = RecordOf(vars);
      silentium.Applied(silentium.All(theSrc, placesSrc, varsSrc), ([base, rules, vars2]) => {
        Object.entries(rules).forEach(([ph, val]) => {
          base = base.replaceAll(ph, String(val));
        });
        Object.entries(vars2).forEach(([ph, val]) => {
          base = base.replaceAll(ph, String(val));
        });
        return base;
      })(user);
    },
    template: (value) => {
      theSrc = silentium.Of(value);
    },
    /**
     * Ability to register variable
     * in concrete place Of template
     */
    var: (src) => {
      const varName = `$var${placesCounter}`;
      placesCounter += 1;
      vars[varName] = silentium.Destructor(src, (d) => {
        destructors.push(d);
      }).event;
      return varName;
    },
    destroy() {
      destructors.forEach((d) => d());
    }
  };
}

function RegexpMatched(patternSrc, valueSrc, flagsSrc = silentium.Of("")) {
  return (user) => {
    silentium.All(
      patternSrc,
      valueSrc,
      flagsSrc
    )(([pattern, value, flags]) => {
      user(new RegExp(pattern, flags).test(value));
    });
  };
}

function RegexpReplaced(valueSrc, patternSrc, replaceValueSrc, flagsSrc = silentium.Of("")) {
  return (user) => {
    silentium.All(
      patternSrc,
      valueSrc,
      replaceValueSrc,
      flagsSrc
    )(([pattern, value, replaceValue, flags]) => {
      user(String(value).replace(new RegExp(pattern, flags), replaceValue));
    });
  };
}

function RegexpMatch(patternSrc, valueSrc, flagsSrc = silentium.Of("")) {
  return (user) => {
    silentium.All(
      patternSrc,
      valueSrc,
      flagsSrc
    )(([pattern, value, flags]) => {
      const result = new RegExp(pattern, flags).exec(value);
      user(result ?? []);
    });
  };
}

function Set(baseSrc, keySrc, valueSrc) {
  return (user) => {
    silentium.All(
      baseSrc,
      keySrc,
      valueSrc
    )(([base, key, value]) => {
      base[key] = value;
      user(base);
    });
  };
}

const emptySrc = () => silentium.Of(false);
function Router(urlSrc, routesSrc, defaultSrc) {
  return (user) => {
    const destructors = [];
    const destroyAllData = () => {
      destructors.forEach((d) => d());
      destructors.length = 0;
    };
    silentium.All(
      routesSrc,
      urlSrc
    )(([routes, url]) => {
      destroyAllData();
      const instance = silentium.All(
        defaultSrc(),
        silentium.All(
          ...routes.map(
            (r) => silentium.Destructor(
              BranchLazy(
                RegexpMatched(
                  silentium.Of(r.pattern),
                  silentium.Of(url),
                  r.patternFlags ? silentium.Of(r.patternFlags) : void 0
                ),
                r.template,
                emptySrc
              ),
              (d) => destructors.push(d)
            ).event
          )
        )
      );
      silentium.Applied(instance, (r) => {
        const firstReal = r[1].find((r2) => r2 !== false);
        if (firstReal) {
          return firstReal;
        }
        return r[0];
      })(user);
    });
    return destroyAllData;
  };
}

function And(oneSrc, twoSrc) {
  return (user) => {
    silentium.All(
      oneSrc,
      twoSrc
    )(([one, two]) => {
      user(one && two);
    });
  };
}

function Or(oneSrc, twoSrc) {
  return (user) => {
    silentium.All(
      oneSrc,
      twoSrc
    )(([one, two]) => {
      user(one || two);
    });
  };
}

function Not(baseSrc) {
  return (user) => {
    baseSrc((v) => {
      user(!v);
    });
  };
}

function Bool(baseSrc) {
  return (user) => {
    silentium.Applied(baseSrc, Boolean)(user);
  };
}

function FromJson(jsonSrc, errorOwner) {
  return (user) => {
    jsonSrc((json) => {
      try {
        user(JSON.parse(json));
      } catch (error) {
        errorOwner?.(new Error(`Failed to parse JSON: ${error}`));
      }
    });
  };
}

function ToJson(dataSrc, errorOwner) {
  return (user) => {
    dataSrc((data) => {
      try {
        user(JSON.stringify(data));
      } catch {
        errorOwner?.(new Error("Failed to convert to JSON"));
      }
    });
  };
}

function First(baseSrc) {
  return (user) => {
    silentium.Applied(baseSrc, (a) => a[0])(user);
  };
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
