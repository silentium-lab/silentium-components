import { all, applied, EventType, late, SourceType } from "silentium";

/**
 * Takes source and remember it first value
 * returns new record, what will contain only fields what was changed
 * https://silentium-lab.github.io/silentium-components/#/behaviors/dirty
 */
export const dirty = <T>(
  baseEntitySource: EventType<T>,
  alwaysKeep: string[] = [],
  excludeKeys: string[] = [],
  cloneFn?: (v: T) => T,
): SourceType<T> => {
  const comparingSrc = late<T>();

  if (cloneFn === undefined) {
    cloneFn = (value) => JSON.parse(JSON.stringify(value));
  }

  return {
    event: (u) => {
      const comparingDetached = applied(comparingSrc.event, cloneFn);

      all(
        comparingDetached,
        baseEntitySource,
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
              return value !== (base as any)[key];
            }),
          ) as T,
        );
      });
    },
    use: (v) => {
      comparingSrc.use(v);
    },
  };
};
