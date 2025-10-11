import { EventType, isFilled, primitive } from "silentium";

export const detached = <T>(baseSrc: EventType<T>): EventType<T> => {
  return function Detached(user) {
    const v = primitive(baseSrc).primitive();
    if (isFilled(v)) {
      user(v);
    }
  };
};
