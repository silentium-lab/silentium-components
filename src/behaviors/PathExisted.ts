import { ActualMessage, Empty, MaybeMessage, Nothing } from "silentium";

import { Path } from "../behaviors/Path";

/**
 * Path with separate empty message
 */
export function PathExisted<
  R,
  T extends object | Array<any> = any,
  K extends string = any,
>(_base: MaybeMessage<T>, _keyed: MaybeMessage<K>) {
  const $base = ActualMessage(_base);
  const $keyed = ActualMessage(_keyed);
  return Empty(Path<R>($base, $keyed, Nothing));
}
