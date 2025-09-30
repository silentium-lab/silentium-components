import { all, DataType, of } from "silentium";

/**
 * First match of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export const regexpMatch = (
  patternSrc: DataType<string>,
  valueSrc: DataType<string>,
  flagsSrc: DataType<string> = of(""),
): DataType<string[]> => {
  return (u) => {
    all(
      patternSrc,
      valueSrc,
      flagsSrc,
    )(([pattern, value, flags]) => {
      const result = new RegExp(pattern, flags).exec(value);
      u(result ?? []);
    });
  };
};
