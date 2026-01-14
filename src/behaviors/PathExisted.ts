import { Actual, Empty, MaybeMessage, Nothing } from "silentium";

import { Path } from "../behaviors/Path";

/**
 * Path with separate empty message
 */
export function PathExisted<
  R,
  T extends object | Array<any> = any,
  K extends string = any,
>(_base: MaybeMessage<T>, _keyed: MaybeMessage<K>) {
  const $base = Actual(_base);
  const $keyed = Actual(_keyed);
  return Empty(Path<R>($base, $keyed, Nothing as R));
}
