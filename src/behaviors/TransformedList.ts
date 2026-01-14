import { Actual, ConstructorType, Map, MaybeMessage } from "silentium";

import { Transformed } from "../behaviors/Transformed";

export function TransformedList<T extends any[]>(
  _base: MaybeMessage<T>,
  transformRules: Record<string, ConstructorType<[MaybeMessage<any>]>>,
) {
  return Map(Actual(_base), (v) => Transformed(v, transformRules));
}
