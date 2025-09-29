import { DataType } from "silentium";

export const polling = <T>(
  baseSrc: DataType<T>,
  triggerSrc: DataType<T>,
): DataType<T> => {
  return (u) => {
    triggerSrc(() => {
      baseSrc(u);
    });
  };
};
