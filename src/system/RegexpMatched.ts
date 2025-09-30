import { all, DataType, of } from "silentium";

/**
 * Boolean source what checks what string matches pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export const regexpMatched = (
  patternSrc: DataType<string>,
  valueSrc: DataType<string>,
  flagsSrc: DataType<string> = of(""),
): DataType<boolean> => {
  return (u) => {
    all(
      patternSrc,
      valueSrc,
      flagsSrc,
    )(([pattern, value, flags]) => {
      u(new RegExp(pattern, flags).test(value));
    });
  };
};
