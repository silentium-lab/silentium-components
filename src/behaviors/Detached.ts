import { DataType, isFilled, primitive } from "silentium";

export const detached = <T>(baseSrc: DataType<T>): DataType<T> => {
  const p = primitive(baseSrc);
  let v = p.primitive();
  return function Detached(user) {
    if (isFilled(v)) {
      user(v);
    } else {
      v = p.primitive();
      Detached(user);
    }
  };
};
