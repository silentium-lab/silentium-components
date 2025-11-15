import { Applied, Message, MessageType } from "silentium";

/**
 * Represents the first element Of an array.
 */
export function First<T extends Array<unknown>>($base: MessageType<T>) {
  return Message<T[0]>((transport) => {
    Applied($base, (a) => a[0]).to(transport);
  });
}
