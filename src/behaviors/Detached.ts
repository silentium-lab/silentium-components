import { EventType, isFilled, Primitive } from "silentium";

export const detached = <T>(baseSrc: EventType<T>): EventType<T> => {
  return function Detached(user) {
    const v = Primitive(baseSrc).primitive();
    if (isFilled(v)) {
      user(v);
    }
  };
};
