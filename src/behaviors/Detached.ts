import { EventType, isFilled, Primitive } from "silentium";

export function Detached<T>(baseSrc: EventType<T>): EventType<T> {
  return function Detached(user) {
    const v = Primitive(baseSrc).primitive();
    if (isFilled(v)) {
      user(v);
    }
  };
}
