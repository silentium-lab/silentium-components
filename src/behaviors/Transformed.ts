import {
  ActualMessage,
  ConstructorType,
  MaybeMessage,
  Message,
  Of,
  Once,
} from "silentium";

import { Record } from "../structures";

/**
 * Modify the object structure
 * with the ability to create new fields based on
 * existing ones in the object
 */
export function Transformed<T extends Record<string, any>>(
  _base: MaybeMessage<T>,
  transformRules: Record<string, ConstructorType<[MaybeMessage<any>]>>,
) {
  const $base = ActualMessage(_base);
  return Message((resolve) => {
    $base.then((v) => {
      const existedKeysMap: Record<string, number> = {};
      const sourceObject = Object.fromEntries(
        Object.entries(v).map((entry) => {
          if (transformRules[entry[0]]) {
            existedKeysMap[entry[0]] = 1;
            return [entry[0], transformRules[entry[0]](v)];
          }

          return [entry[0], Of(entry[1])];
        }),
      );

      Object.keys(transformRules).forEach((key) => {
        if (!existedKeysMap[key]) {
          sourceObject[key] = transformRules[key](v);
        }
      });
      const record = Once(Record(sourceObject));
      record.then(resolve);
    });
  });
}
