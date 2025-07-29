import { InformationType } from "silentium";

export const sync = <T>(base: InformationType<T>) => {
  let value: T | undefined;

  base((v) => {
    value = v;
  });

  return {
    value() {
      if (value === undefined) {
        throw new Error("no value in sync");
      }

      return value;
    },
  };
};
