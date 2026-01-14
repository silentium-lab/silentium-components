import { All, Applied, Late, MessageType, Source } from "silentium";

/**
 * Takes source and remember it first value
 * returns new record, what will contain only fields what was changed
 * https://silentium-lab.github.io/silentium-components/#/behaviors/dirty
 */
export function Dirty<T extends Record<string, unknown>>(
  $base: MessageType<T>,
  keep: string[] = [],
  exclude: string[] = [],
  cloner?: (v: T) => T,
) {
  const $comparing = Late<T>({} as T);
  if (cloner === undefined) {
    cloner = (value) => JSON.parse(JSON.stringify(value));
  }
  return Source<T>(
    function DirtyImpl(r) {
      const $comparingClone = Applied($comparing, cloner);
      All($comparingClone, $base).then(([comparing, base]) => {
        if (!comparing) {
          return;
        }
        r(
          Object.fromEntries(
            Object.entries(comparing).filter(([key, value]) => {
              if (keep.includes(key)) {
                return true;
              }
              if (exclude.includes(key)) {
                return false;
              }
              return value !== (base as Record<string, unknown>)[key];
            }),
          ) as T,
        );
      });
    },
    (v) => {
      $comparing.use(v);
    },
  );
}
