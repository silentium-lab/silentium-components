import { all, i, InformationType } from "silentium";

/**
 * Returns string replaced by regular expression pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-replaced
 */
export const regexpReplaced =
  (
    valueSrc: InformationType<string>,
    patternSrc: InformationType<string>,
    replaceValueSrc: InformationType<string>,
    flagsSrc: InformationType<string> = i(""),
  ): InformationType<string> =>
  (o) => {
    all(
      patternSrc,
      valueSrc,
      replaceValueSrc,
      flagsSrc,
    )(([pattern, value, replaceValue, flags]) => {
      o(String(value).replace(new RegExp(pattern, flags), replaceValue));
    });
  };
