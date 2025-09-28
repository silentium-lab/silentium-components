import { DataType } from "silentium";

export const constant = <T>(
  permanentValue: T,
  triggerSrc: DataType,
): DataType<T> => {
  return (u) => {
    triggerSrc(() => {
      u(permanentValue);
    });
  };
};
