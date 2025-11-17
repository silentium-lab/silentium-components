import { Applied, Message, MessageType } from "silentium";

/**
 * Represents the first element Of an array.
 */
export function First<T extends Array<unknown>>($base: MessageType<T>) {
  return Message<T[0]>(function () {
    Applied($base, (a) => a[0]).pipe(this);
  });
}
