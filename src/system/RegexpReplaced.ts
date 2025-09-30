import { all, DataType, of } from "silentium";

/**
 * Returns string replaced by regular expression pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-replaced
 */
export const regexpReplaced = (
  valueSrc: DataType<string>,
  patternSrc: DataType<string>,
  replaceValueSrc: DataType<string>,
  flagsSrc: DataType<string> = of(""),
): DataType<string> => {
  return (u) => {
    all(
      patternSrc,
      valueSrc,
      replaceValueSrc,
      flagsSrc,
    )(([pattern, value, replaceValue, flags]) => {
      u(String(value).replace(new RegExp(pattern, flags), replaceValue));
    });
  };
};
