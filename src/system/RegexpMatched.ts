import { all, i, InformationType } from "silentium";

/**
 * Boolean source what checks what string matches pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export const regexpMatched =
  (
    patternSrc: InformationType<string>,
    valueSrc: InformationType<string>,
    flagsSrc: InformationType<string> = i(""),
  ): InformationType<boolean> =>
  (o) => {
    all(
      patternSrc,
      valueSrc,
      flagsSrc,
    )(([pattern, value, flags]) => {
      o(new RegExp(pattern, flags).test(value));
    });
  };
