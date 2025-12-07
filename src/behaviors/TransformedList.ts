import { ActualMessage, ConstructorType, Map, MaybeMessage } from "silentium";

import { Transformed } from "../behaviors/Transformed";

export function TransformedList<T extends any[]>(
  _base: MaybeMessage<T>,
  transformRules: Record<string, ConstructorType<[MaybeMessage<any>]>>,
) {
  return Map(ActualMessage(_base), (v) => Transformed(v, transformRules));
}
