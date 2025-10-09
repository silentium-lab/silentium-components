import { DataType, isFilled, primitive } from "silentium";

export const detached = <T>(baseSrc: DataType<T>): DataType<T> => {
  return function Detached(user) {
    const v = primitive(baseSrc).primitive();
    if (isFilled(v)) {
      user(v);
    }
  };
};
