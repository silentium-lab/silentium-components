import {
  give,
  guestCast,
  GuestType,
  patronOnce,
  sourceAll,
  SourceChangeableType,
  sourceOf,
  SourceType,
  value,
} from "silentium";

/**
 * Takes source and remember it first value
 * returns new record, what will contain only fields what was changed
 */
export const dirty = <T extends object>(
  baseEntitySource: SourceType<T>,
  becomePatronAuto = false,
  alwaysKeep: string[] = [],
  excludeKeys: string[] = [],
): SourceChangeableType<Partial<T>> => {
  const comparingSrc = sourceOf();
  const all = sourceAll([comparingSrc, baseEntitySource]);

  const result = {
    give(value: T) {
      give(JSON.parse(JSON.stringify(value)), comparingSrc);
      return result;
    },
    value(guest: GuestType<Partial<T>>) {
      value(
        all,
        guestCast(guest, ([comparing, base]) => {
          if (!comparing) {
            return;
          }

          give(
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
            guest,
          );
        }),
      );
      return result;
    },
  };

  if (becomePatronAuto) {
    value(baseEntitySource, patronOnce(result));
  }

  return result;
};
