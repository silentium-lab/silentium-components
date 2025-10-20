import { Primitive, Shared, Filtered, isFilled, Late, Applied, All, ExecutorApplied, LateShared, Destructor, Of } from 'silentium';

function Branch(conditionSrc, leftSrc, rightSrc) {
  return (user) => {
    const leftSync = Primitive(leftSrc);
    let rightSync;
    if (rightSrc !== void 0) {
      rightSync = Primitive(rightSrc);
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
    const s = Shared(baseSrc, true);
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
      const f = Filtered(s.event, () => !timeoutReached);
      f(user);
      s.event(() => {
        timeoutReached = true;
      });
    });
  };
}

function Deferred(baseSrc, triggerSrc) {
  return (user) => {
    const baseSync = Primitive(baseSrc);
    triggerSrc(() => {
      const value = baseSync.primitive();
      if (isFilled(value)) {
        user(value);
      }
    });
  };
}

function Detached(baseSrc) {
  return function Detached2(user) {
    const v = Primitive(baseSrc).primitive();
    if (isFilled(v)) {
      user(v);
    }
  };
}

function Dirty(baseEntitySource, alwaysKeep = [], excludeKeys = [], cloneFn) {
  const comparingSrc = Late();
  if (cloneFn === void 0) {
    cloneFn = (value) => JSON.parse(JSON.stringify(value));
  }
  return {
    event: (user) => {
      const comparingDetached = Applied(comparingSrc.event, cloneFn);
      All(
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
    const i = Filtered(baseSrc, () => !locked);
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
  const baseSync = Primitive(baseSrc.event);
  const keySync = Primitive(keySrc);
  return {
    event: (user) => {
      All(
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
      if (isFilled(key)) {
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
    All(
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
    const targetSync = Primitive(targetSrc);
    triggerSrc(() => {
      const value = targetSync.primitive();
      if (isFilled(value)) {
        user(value);
      }
    });
  };
}

function Task(baseSrc, delay = 0) {
  return (user) => {
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
    const $res = LateShared();
    const destructors = [];
    $base((v) => {
      const $event = Destructor(
        eventBuilder(Of(v), ...args.map((a) => Detached(a)))
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
    All(...Object.values(recordSrc))((entries) => {
      const record = {};
      entries.forEach((entry, index) => {
        record[keys[index]] = entry;
      });
      user(record);
    });
  };
}

function Concatenated(sources, joinPartSrc = Of("")) {
  return (user) => {
    All(
      joinPartSrc,
      ...sources
    )(([joinPart, ...strings]) => {
      user(strings.join(joinPart));
    });
  };
}

function Template(theSrc = Of(""), placesSrc = Of({})) {
  let placesCounter = 0;
  const vars = {
    $TPL: Of("$TPL")
  };
  const destructors = [];
  return {
    value: (user) => {
      const varsSrc = RecordOf(vars);
      Applied(All(theSrc, placesSrc, varsSrc), ([base, rules, vars2]) => {
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
      theSrc = Of(value);
    },
    /**
     * Ability to register variable
     * in concrete place Of template
     */
    var: (src) => {
      const varName = `$var${placesCounter}`;
      placesCounter += 1;
      vars[varName] = Destructor(src, (d) => {
        destructors.push(d);
      }).event;
      return varName;
    },
    destroy() {
      destructors.forEach((d) => d());
    }
  };
}

function RegexpMatched(patternSrc, valueSrc, flagsSrc = Of("")) {
  return (user) => {
    All(
      patternSrc,
      valueSrc,
      flagsSrc
    )(([pattern, value, flags]) => {
      user(new RegExp(pattern, flags).test(value));
    });
  };
}

function RegexpReplaced(valueSrc, patternSrc, replaceValueSrc, flagsSrc = Of("")) {
  return (user) => {
    All(
      patternSrc,
      valueSrc,
      replaceValueSrc,
      flagsSrc
    )(([pattern, value, replaceValue, flags]) => {
      user(String(value).replace(new RegExp(pattern, flags), replaceValue));
    });
  };
}

function RegexpMatch(patternSrc, valueSrc, flagsSrc = Of("")) {
  return (user) => {
    All(
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
    All(
      baseSrc,
      keySrc,
      valueSrc
    )(([base, key, value]) => {
      base[key] = value;
      user(base);
    });
  };
}

const emptySrc = () => Of(false);
function Router(urlSrc, routesSrc, defaultSrc) {
  return (user) => {
    const destructors = [];
    const destroyAllData = () => {
      destructors.forEach((d) => d());
      destructors.length = 0;
    };
    All(
      routesSrc,
      urlSrc
    )(([routes, url]) => {
      destroyAllData();
      const instance = All(
        defaultSrc(),
        All(
          ...routes.map(
            (r) => Destructor(
              BranchLazy(
                RegexpMatched(
                  Of(r.pattern),
                  Of(url),
                  r.patternFlags ? Of(r.patternFlags) : void 0
                ),
                r.template,
                emptySrc
              ),
              (d) => destructors.push(d)
            ).event
          )
        )
      );
      Applied(instance, (r) => {
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
    All(
      oneSrc,
      twoSrc
    )(([one, two]) => {
      user(one && two);
    });
  };
}

function Or(oneSrc, twoSrc) {
  return (user) => {
    All(
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
    Applied(baseSrc, Boolean)(user);
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
    Applied(baseSrc, (a) => a[0])(user);
  };
}

export { And, Bool, Branch, BranchLazy, Concatenated, Constant, Deadline, Deferred, Detached, Dirty, First, FromJson, HashTable, Loading, Lock, Memo, Not, OnlyChanged, Or, Part, Path, Polling, RecordOf, RegexpMatch, RegexpMatched, RegexpReplaced, Router, Set, Shot, Task, Template, Tick, ToJson, Transaction };
//# sourceMappingURL=silentium-components.js.map
