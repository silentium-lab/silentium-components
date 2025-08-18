import { of, applied, all, sharedStateless, filtered, isFilled, i, any, chain } from 'silentium';

const dirty = (baseEntitySource, alwaysKeep = [], excludeKeys = []) => {
  const [comparing, co] = of();
  const comparingDetached = applied(
    comparing,
    (value) => JSON.parse(JSON.stringify(value))
  );
  const i = (o) => {
    all(
      comparingDetached,
      baseEntitySource
    )(([comparing2, base]) => {
      if (!comparing2) {
        return;
      }
      o(
        Object.fromEntries(
          Object.entries(comparing2).filter(([key, value]) => {
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
  };
  return [i, co];
};

const loading = (loadingStartSource, loadingFinishSource) => {
  return (o) => {
    loadingStartSource(() => {
      o(true);
    });
    loadingFinishSource(() => {
      o(false);
    });
  };
};

const path = (baseSrc, keySrc) => {
  return (o) => {
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
        o(value);
      }
    });
  };
};

const deadline = (error, baseSrc, timeoutSrc) => {
  let timerHead = null;
  return (o) => {
    const [baseShared, pool] = sharedStateless(baseSrc);
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
      const f = filtered(baseShared, () => !timeoutReached);
      f(o);
      baseShared(() => {
        timeoutReached = true;
      });
    });
    return () => {
      pool.destroy();
    };
  };
};

const tick = (baseSrc) => {
  return (o) => {
    let microtaskScheduled = false;
    let lastValue = null;
    const scheduleMicrotask = () => {
      microtaskScheduled = true;
      queueMicrotask(() => {
        microtaskScheduled = false;
        if (lastValue !== null) {
          o(lastValue);
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

const sync = (base) => {
  let value;
  base((v) => {
    value = v;
  });
  return {
    value() {
      if (value === void 0) {
        throw new Error("no value in sync");
      }
      return value;
    }
  };
};

const deferred = (baseSrc, triggerSrc) => {
  return (o) => {
    const baseSync = sync(baseSrc);
    triggerSrc(() => {
      if (isFilled(baseSync.value())) {
        o(baseSync.value());
      }
    });
  };
};

const branch = (condition, left, right) => {
  return (o) => {
    const leftSync = sync(left);
    let rightSync;
    if (right !== void 0) {
      rightSync = sync(right);
    }
    condition((v) => {
      if (v) {
        o(leftSync.value());
      } else if (rightSync) {
        o(rightSync.value());
      }
    });
  };
};

const memo = (baseSrc) => {
  let lastValue = null;
  return (o) => {
    baseSrc((v) => {
      if (v !== lastValue) {
        o(v);
        lastValue = v;
      }
    });
  };
};

const lock = (baseSrc, lockSrc) => {
  let locked = false;
  const i = filtered(baseSrc, () => !locked);
  return (o) => {
    lockSrc((newLock) => {
      locked = newLock;
    });
    i(o);
  };
};

const shot = (targetSrc, triggerSrc) => {
  return (o) => {
    const targetSync = sync(targetSrc);
    triggerSrc(() => {
      if (isFilled(targetSync.value())) {
        o(targetSync.value());
      }
    });
  };
};

const onlyChanged = (baseSrc) => {
  let firstValue = false;
  return (o) => {
    baseSrc((v) => {
      if (firstValue === false) {
        firstValue = true;
      } else {
        o(v);
      }
    });
  };
};

const hashTable = (base) => {
  return (o) => {
    const record = {};
    base(([key, value]) => {
      record[key] = value;
      o(record);
    });
  };
};

const record = (recordSrc) => {
  return (o) => {
    const keys = Object.keys(recordSrc);
    all(...Object.values(recordSrc))((entries) => {
      const record2 = {};
      entries.forEach((entry, index) => {
        record2[keys[index]] = entry;
      });
      o(record2);
    });
  };
};

const concatenated = (sources, joinPartSrc = i("")) => {
  return (o) => {
    all(
      joinPartSrc,
      ...sources
    )(([joinPart, ...strings]) => {
      o(strings.join(joinPart));
    });
  };
};

const regexpMatched = (patternSrc, valueSrc, flagsSrc = i("")) => (o) => {
  all(
    patternSrc,
    valueSrc,
    flagsSrc
  )(([pattern, value, flags]) => {
    o(new RegExp(pattern, flags).test(value));
  });
};

const router = (urlSrc, routesSrc, defaultSrc) => {
  return (o) => {
    routesSrc((routes) => {
      any(
        chain(urlSrc, defaultSrc),
        ...routes.map((r) => {
          return branch(
            regexpMatched(
              i(r.pattern),
              urlSrc,
              r.patternFlags ? i(r.patternFlags) : void 0
            ),
            typeof r.template === "function" ? r.template : i(r.template)
          );
        })
      )(o);
    });
  };
};

const regexpReplaced = (valueSrc, patternSrc, replaceValueSrc, flagsSrc = i("")) => (o) => {
  all(
    patternSrc,
    valueSrc,
    replaceValueSrc,
    flagsSrc
  )(([pattern, value, replaceValue, flags]) => {
    o(String(value).replace(new RegExp(pattern, flags), replaceValue));
  });
};

const regexpMatch = (patternSrc, valueSrc, flagsSrc = i("")) => (o) => {
  all(
    patternSrc,
    valueSrc,
    flagsSrc
  )(([pattern, value, flags]) => {
    const result = new RegExp(pattern, flags).exec(value);
    o(result ?? []);
  });
};

const set = (baseSrc, keySrc, valueSrc) => {
  return (o) => {
    all(
      baseSrc,
      keySrc,
      valueSrc
    )(([base, key, value]) => {
      base[key] = value;
      o(base);
    });
  };
};

const and = (oneSrc, twoSrc) => {
  return (o) => {
    all(
      oneSrc,
      twoSrc
    )(([one, two]) => {
      o(one && two);
    });
  };
};

const or = (oneSrc, twoSrc) => {
  return (o) => {
    all(
      oneSrc,
      twoSrc
    )(([one, two]) => {
      o(one || two);
    });
  };
};

const not = (baseSrc) => {
  return (o) => {
    baseSrc((v) => {
      o(!v);
    });
  };
};

const fromJson = (jsonSrc, errorOwner) => {
  return (o) => {
    jsonSrc((json) => {
      try {
        o(JSON.parse(json));
      } catch (error) {
        errorOwner?.(new Error(`Failed to parse JSON: ${error}`));
      }
    });
  };
};

const toJson = (dataSrc, errorOwner) => {
  return (o) => {
    dataSrc((data) => {
      try {
        o(JSON.stringify(data));
      } catch {
        errorOwner?.(new Error("Failed to convert to JSON"));
      }
    });
  };
};

const first = (baseSrc) => {
  return applied(baseSrc, (a) => a[0]);
};

export { and, branch, concatenated, deadline, deferred, dirty, first, fromJson, hashTable, loading, lock, memo, not, onlyChanged, or, path, record, regexpMatch, regexpMatched, regexpReplaced, router, set, shot, tick, toJson };
//# sourceMappingURL=silentium-components.mjs.map
