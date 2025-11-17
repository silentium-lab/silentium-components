import { isFilled, Message, MessageType, Primitive } from "silentium";

/**
 * Message separate from the base
 * allows to take one value from the base
 * but not react to new values of the base message
 */
export function Detached<T>($base: MessageType<T>): MessageType<T> {
  return Message(function () {
    const v = Primitive($base).primitive();
    if (isFilled(v)) {
      this.use(v);
    }
  });
}
