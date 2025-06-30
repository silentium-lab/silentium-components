import { all, applied, I, Information, O, of } from "silentium";

/**
 * Takes source and remember it first value
 * returns new record, what will contain only fields what was changed
 * https://silentium-lab.github.io/silentium-components/#/behaviors/dirty
 */
export const dirty = <T extends object>(
  baseEntitySource: Information<T>,
  alwaysKeep: string[] = [],
  excludeKeys: string[] = [],
) => {
  const [comparing, co] = of<T>();

  const comparingDetached = applied(comparing, (value) =>
    JSON.parse(JSON.stringify(value)),
  );

  const i = I<Partial<T>>((o) => {
    all(comparingDetached, baseEntitySource).value(
      O(([comparing, base]) => {
        if (!comparing) {
          return;
        }

        o.give(
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
      }),
    );
  });

  return [i, co] as const;
};
