import { all, applied, InformationType, of } from "silentium";

/**
 * Takes source and remember it first value
 * returns new record, what will contain only fields what was changed
 * https://silentium-lab.github.io/silentium-components/#/behaviors/dirty
 */
export const dirty = <T extends object>(
  baseEntitySource: InformationType<T>,
  alwaysKeep: string[] = [],
  excludeKeys: string[] = [],
) => {
  const [comparing, co] = of<T>();

  const comparingDetached = applied(comparing, (value) =>
    JSON.parse(JSON.stringify(value)),
  );

  const i: InformationType<Partial<T>> = (o) => {
    all(
      comparingDetached,
      baseEntitySource,
    )(([comparing, base]) => {
      if (!comparing) {
        return;
      }

      o(
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
  };

  return [i, co] as const;
};
