'use strict';

var silentium = require('silentium');

const branch = (conditionSrc, leftSrc, rightSrc) => {
  return (u) => {
    const leftSync = silentium.primitive(leftSrc);
    let rightSync;
    if (rightSrc !== void 0) {
      rightSync = silentium.primitive(rightSrc);
    }
    conditionSrc((v) => {
      let result = null;
      if (v) {
        result = leftSync.primitive();
      } else if (rightSync) {
        result = rightSync.primitive();
      }
      if (result !== null) {
        u(result);
      }
    });
  };
};

const constant = (permanentValue, triggerSrc) => {
  return (u) => {
    triggerSrc(() => {
      u(permanentValue);
    });
  };
};

const deadline = (error, baseSrc, timeoutSrc) => {
  return (u) => {
    let timerHead = null;
    const s = silentium.shared(baseSrc, true);
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
      const f = silentium.filtered(s.event, () => !timeoutReached);
      f(u);
      s.event(() => {
        timeoutReached = true;
      });
    });
  };
};

const deferred = (baseSrc, triggerSrc) => {
  return (u) => {
    const baseSync = silentium.primitive(baseSrc);
    triggerSrc(() => {
      const value = baseSync.primitive();
      if (silentium.isFilled(value)) {
        u(value);
      }
    });
  };
};

const detached = (baseSrc) => {
  return function Detached(user) {
    const v = silentium.primitive(baseSrc).primitive();
    if (silentium.isFilled(v)) {
      user(v);
    }
  };
};

const dirty = (baseEntitySource, alwaysKeep = [], excludeKeys = [], cloneFn) => {
  const comparingSrc = silentium.late();
  if (cloneFn === void 0) {
    cloneFn = (value) => JSON.parse(JSON.stringify(value));
  }
  return {
    event: (u) => {
      const comparingDetached = silentium.applied(comparingSrc.event, cloneFn);
      silentium.all(
        comparingDetached,
        baseEntitySource
      )(([comparing, base]) => {
        if (!comparing) {
          return;
        }
        u(
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
};

const loading = (loadingStartSrc, loadingFinishSrc) => {
  return (u) => {
    loadingStartSrc(() => u(true));
    loadingFinishSrc(() => u(false));
  };
};

const lock = (baseSrc, lockSrc) => {
  return (u) => {
    let locked = false;
    lockSrc((newLock) => {
      locked = newLock;
    });
    const i = silentium.filtered(baseSrc, () => !locked);
    i(u);
  };
};

const memo = (baseSrc) => {
  return (u) => {
    let lastValue = null;
    baseSrc((v) => {
      if (v !== lastValue) {
        u(v);
        lastValue = v;
      }
    });
  };
};

const onlyChanged = (baseSrc) => {
  return (u) => {
    let firstValue = false;
    baseSrc((v) => {
      if (firstValue === false) {
        firstValue = true;
      } else {
        u(v);
      }
    });
  };
};

const part = (baseSrc, keySrc) => {
  const baseSync = silentium.primitive(baseSrc.event);
  const keySync = silentium.primitive(keySrc);
  return {
    event: (u) => {
      silentium.all(
        baseSrc.event,
        keySrc
      )(([base, key]) => {
        const keyChunks = key.split(".");
        let value = base;
        keyChunks.forEach((keyChunk) => {
          value = value[keyChunk];
        });
        if (value !== void 0 && value !== base) {
          u(value);
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
};

const path = (baseSrc, keySrc) => {
  return (u) => {
    silentium.all(
      baseSrc,
      keySrc
    )(([base, key]) => {
      const keyChunks = key.split(".");
      let value = base;
      keyChunks.forEach((keyChunk) => {
        value = value[keyChunk];
      });
      if (value !== void 0 && value !== base) {
        u(value);
      }
    });
  };
};

const polling = (baseSrc, triggerSrc) => {
  return (u) => {
    triggerSrc(() => {
      baseSrc(u);
    });
  };
};

const shot = (targetSrc, triggerSrc) => {
  return (u) => {
    const targetSync = silentium.primitive(targetSrc);
    triggerSrc(() => {
      const value = targetSync.primitive();
      if (silentium.isFilled(value)) {
        u(value);
      }
    });
  };
};

const task = (baseSrc, delay = 0) => {
  return (u) => {
    let prevTimer = null;
    silentium.executorApplied(baseSrc, (fn) => {
      return (v) => {
        if (prevTimer) {
          clearTimeout(prevTimer);
        }
        prevTimer = setTimeout(() => {
          fn(v);
        }, delay);
      };
    })(u);
  };
};

const tick = (baseSrc) => {
  return (u) => {
    let microtaskScheduled = false;
    let lastValue = null;
    const scheduleMicrotask = () => {
      microtaskScheduled = true;
      queueMicrotask(() => {
        microtaskScheduled = false;
        if (lastValue !== null) {
          u(lastValue);
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
};

const hashTable = (baseSrc) => {
  return (u) => {
    const record = {};
    baseSrc(([key, value]) => {
      record[key] = value;
      u(record);
    });
  };
};

const recordOf = (recordSrc) => {
  return (u) => {
    const keys = Object.keys(recordSrc);
    silentium.all(...Object.values(recordSrc))((entries) => {
      const record = {};
      entries.forEach((entry, index) => {
        record[keys[index]] = entry;
      });
      u(record);
    });
  };
};

const concatenated = (sources, joinPartSrc = silentium.of("")) => {
  return (u) => {
    silentium.all(
      joinPartSrc,
      ...sources
    )(([joinPart, ...strings]) => {
      u(strings.join(joinPart));
    });
  };
};

const template = (theSrc = silentium.of(""), placesSrc = silentium.of({})) => {
  let placesCounter = 0;
  const vars = {
    $TPL: silentium.of("$TPL")
  };
  const destructors = [];
  return {
    value: (u) => {
      const varsSrc = recordOf(vars);
      silentium.applied(silentium.all(theSrc, placesSrc, varsSrc), ([base, rules, vars2]) => {
        Object.entries(rules).forEach(([ph, val]) => {
          base = base.replaceAll(ph, String(val));
        });
        Object.entries(vars2).forEach(([ph, val]) => {
          base = base.replaceAll(ph, String(val));
        });
        return base;
      })(u);
    },
    template: (value) => {
      theSrc = silentium.of(value);
    },
    /**
     * Ability to register variable
     * in concrete place of template
     */
    var: (src) => {
      const varName = `$var${placesCounter}`;
      placesCounter += 1;
      vars[varName] = silentium.destructor(src, (d) => {
        destructors.push(d);
      }).value;
      return varName;
    },
    destroy() {
      destructors.forEach((d) => d());
    }
  };
};

const branchLazy = (conditionSrc, leftSrc, rightSrc) => {
  return (u) => {
    let destructor;
    conditionSrc((v) => {
      if (destructor !== void 0 && typeof destructor === "function") {
        destructor();
      }
      let instance = null;
      if (v) {
        instance = leftSrc();
      } else if (rightSrc) {
        instance = rightSrc();
      }
      if (instance) {
        destructor = instance(u);
      }
    });
    return () => {
      destructor?.();
    };
  };
};

const regexpMatched = (patternSrc, valueSrc, flagsSrc = silentium.of("")) => {
  return (u) => {
    silentium.all(
      patternSrc,
      valueSrc,
      flagsSrc
    )(([pattern, value, flags]) => {
      u(new RegExp(pattern, flags).test(value));
    });
  };
};

const regexpReplaced = (valueSrc, patternSrc, replaceValueSrc, flagsSrc = silentium.of("")) => {
  return (u) => {
    silentium.all(
      patternSrc,
      valueSrc,
      replaceValueSrc,
      flagsSrc
    )(([pattern, value, replaceValue, flags]) => {
      u(String(value).replace(new RegExp(pattern, flags), replaceValue));
    });
  };
};

const regexpMatch = (patternSrc, valueSrc, flagsSrc = silentium.of("")) => {
  return (u) => {
    silentium.all(
      patternSrc,
      valueSrc,
      flagsSrc
    )(([pattern, value, flags]) => {
      const result = new RegExp(pattern, flags).exec(value);
      u(result ?? []);
    });
  };
};

const set = (baseSrc, keySrc, valueSrc) => {
  return (u) => {
    silentium.all(
      baseSrc,
      keySrc,
      valueSrc
    )(([base, key, value]) => {
      base[key] = value;
      u(base);
    });
  };
};

const emptySrc = () => silentium.of(false);
const router = (urlSrc, routesSrc, defaultSrc) => {
  return (u) => {
    const destructors = [];
    const destroyAllData = () => {
      destructors.forEach((d) => d());
      destructors.length = 0;
    };
    silentium.all(
      routesSrc,
      urlSrc
    )(([routes, url]) => {
      destroyAllData();
      const instance = silentium.all(
        defaultSrc(),
        silentium.all(
          ...routes.map(
            (r) => silentium.destructor(
              branchLazy(
                regexpMatched(
                  silentium.of(r.pattern),
                  silentium.of(url),
                  r.patternFlags ? silentium.of(r.patternFlags) : void 0
                ),
                r.template,
                emptySrc
              ),
              (d) => destructors.push(d)
            ).value
          )
        )
      );
      silentium.applied(instance, (r) => {
        const firstReal = r[1].find((r2) => r2 !== false);
        if (firstReal) {
          return firstReal;
        }
        return r[0];
      })(u);
    });
    return destroyAllData;
  };
};

const and = (oneSrc, twoSrc) => {
  return (u) => {
    silentium.all(
      oneSrc,
      twoSrc
    )(([one, two]) => {
      u(one && two);
    });
  };
};

const or = (oneSrc, twoSrc) => {
  return (u) => {
    silentium.all(
      oneSrc,
      twoSrc
    )(([one, two]) => {
      u(one || two);
    });
  };
};

const not = (baseSrc) => {
  return (u) => {
    baseSrc((v) => {
      u(!v);
    });
  };
};

const bool = (baseSrc) => {
  return (u) => {
    silentium.applied(baseSrc, Boolean)(u);
  };
};

const fromJson = (jsonSrc, errorOwner) => {
  return (u) => {
    jsonSrc((json) => {
      try {
        u(JSON.parse(json));
      } catch (error) {
        errorOwner?.(new Error(`Failed to parse JSON: ${error}`));
      }
    });
  };
};

const toJson = (dataSrc, errorOwner) => {
  return (u) => {
    dataSrc((data) => {
      try {
        u(JSON.stringify(data));
      } catch {
        errorOwner?.(new Error("Failed to convert to JSON"));
      }
    });
  };
};

const first = (baseSrc) => {
  return (u) => {
    silentium.applied(baseSrc, (a) => a[0])(u);
  };
};

exports.and = and;
exports.bool = bool;
exports.branch = branch;
exports.concatenated = concatenated;
exports.constant = constant;
exports.deadline = deadline;
exports.deferred = deferred;
exports.detached = detached;
exports.dirty = dirty;
exports.first = first;
exports.fromJson = fromJson;
exports.hashTable = hashTable;
exports.loading = loading;
exports.lock = lock;
exports.memo = memo;
exports.not = not;
exports.onlyChanged = onlyChanged;
exports.or = or;
exports.part = part;
exports.path = path;
exports.polling = polling;
exports.recordOf = recordOf;
exports.regexpMatch = regexpMatch;
exports.regexpMatched = regexpMatched;
exports.regexpReplaced = regexpReplaced;
exports.router = router;
exports.set = set;
exports.shot = shot;
exports.task = task;
exports.template = template;
exports.tick = tick;
exports.toJson = toJson;
//# sourceMappingURL=silentium-components.cjs.map
