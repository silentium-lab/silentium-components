import { primitive, shared, filtered, isFilled, late, applied, all, executorApplied, of, destructor } from 'silentium';

const branch = (conditionSrc, leftSrc, rightSrc) => {
  return (u) => {
    const leftSync = primitive(leftSrc);
    let rightSync;
    if (rightSrc !== void 0) {
      rightSync = primitive(rightSrc);
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
    const s = shared(baseSrc, true);
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
      const f = filtered(s.value, () => !timeoutReached);
      f(u);
      s.value(() => {
        timeoutReached = true;
      });
    });
  };
};

const deferred = (baseSrc, triggerSrc) => {
  return (u) => {
    const baseSync = primitive(baseSrc);
    triggerSrc(() => {
      const value = baseSync.primitive();
      if (isFilled(value)) {
        u(value);
      }
    });
  };
};

const dirty = (baseEntitySource, alwaysKeep = [], excludeKeys = [], cloneFn) => {
  const comparingSrc = late();
  if (cloneFn === void 0) {
    cloneFn = (value) => JSON.parse(JSON.stringify(value));
  }
  return {
    value: (u) => {
      const comparingDetached = applied(comparingSrc.value, cloneFn);
      all(
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
    give: (v) => {
      comparingSrc.give(v);
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
    const i = filtered(baseSrc, () => !locked);
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
  const baseSync = primitive(baseSrc.value);
  const keySync = primitive(keySrc);
  return {
    value: (u) => {
      all(
        baseSrc.value,
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
    give: (value) => {
      const key = keySync.primitive();
      if (isFilled(key)) {
        baseSrc.give({
          ...baseSync.primitive(),
          [key]: value
        });
      }
    }
  };
};

const path = (baseSrc, keySrc) => {
  return (u) => {
    all(
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
    const targetSync = primitive(targetSrc);
    triggerSrc(() => {
      const value = targetSync.primitive();
      if (isFilled(value)) {
        u(value);
      }
    });
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

const task = (baseSrc, delay = 0) => {
  return (u) => {
    let prevTimer = null;
    executorApplied(baseSrc, (fn) => {
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
    all(...Object.values(recordSrc))((entries) => {
      const record = {};
      entries.forEach((entry, index) => {
        record[keys[index]] = entry;
      });
      u(record);
    });
  };
};

const concatenated = (sources, joinPartSrc = of("")) => {
  return (u) => {
    all(
      joinPartSrc,
      ...sources
    )(([joinPart, ...strings]) => {
      u(strings.join(joinPart));
    });
  };
};

const template = (theSrc = of(""), placesSrc = of({})) => {
  let placesCounter = 0;
  const vars = {
    $TPL: of("$TPL")
  };
  const destructors = [];
  return {
    value: (u) => {
      const varsSrc = recordOf(vars);
      applied(all(theSrc, placesSrc, varsSrc), ([base, rules, vars2]) => {
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
      theSrc = of(value);
    },
    /**
     * Ability to register variable
     * in concrete place of template
     */
    var: (src) => {
      const varName = `$var${placesCounter}`;
      placesCounter += 1;
      vars[varName] = destructor(src, (d) => {
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

const regexpMatched = (patternSrc, valueSrc, flagsSrc = of("")) => {
  return (u) => {
    all(
      patternSrc,
      valueSrc,
      flagsSrc
    )(([pattern, value, flags]) => {
      u(new RegExp(pattern, flags).test(value));
    });
  };
};

const regexpReplaced = (valueSrc, patternSrc, replaceValueSrc, flagsSrc = of("")) => {
  return (u) => {
    all(
      patternSrc,
      valueSrc,
      replaceValueSrc,
      flagsSrc
    )(([pattern, value, replaceValue, flags]) => {
      u(String(value).replace(new RegExp(pattern, flags), replaceValue));
    });
  };
};

const regexpMatch = (patternSrc, valueSrc, flagsSrc = of("")) => {
  return (u) => {
    all(
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
    all(
      baseSrc,
      keySrc,
      valueSrc
    )(([base, key, value]) => {
      base[key] = value;
      u(base);
    });
  };
};

const emptySrc = () => of(false);
const router = (urlSrc, routesSrc, defaultSrc) => {
  return (u) => {
    const destructors = [];
    const destroyAllData = () => {
      destructors.forEach((d) => d());
      destructors.length = 0;
    };
    all(
      routesSrc,
      urlSrc
    )(([routes, url]) => {
      destroyAllData();
      const instance = all(
        defaultSrc(),
        all(
          ...routes.map(
            (r) => destructor(
              branchLazy(
                regexpMatched(
                  of(r.pattern),
                  of(url),
                  r.patternFlags ? of(r.patternFlags) : void 0
                ),
                r.template,
                emptySrc
              ),
              (d) => destructors.push(d)
            ).value
          )
        )
      );
      applied(instance, (r) => {
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
    all(
      oneSrc,
      twoSrc
    )(([one, two]) => {
      u(one && two);
    });
  };
};

const or = (oneSrc, twoSrc) => {
  return (u) => {
    all(
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
    applied(baseSrc, Boolean)(u);
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
    applied(baseSrc, (a) => a[0])(u);
  };
};

export { and, bool, branch, concatenated, constant, deadline, deferred, dirty, first, fromJson, hashTable, loading, lock, memo, not, onlyChanged, or, part, path, polling, recordOf, regexpMatch, regexpMatched, regexpReplaced, router, set, shot, task, template, tick, toJson };
//# sourceMappingURL=silentium-components.js.map
