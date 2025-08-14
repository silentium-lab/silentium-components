import { all, i, InformationType } from "silentium";

/**
 * First match of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export const regexpMatch =
  (
    patternSrc: InformationType<string>,
    valueSrc: InformationType<string>,
    flagsSrc: InformationType<string> = i(""),
  ): InformationType<string[]> =>
  (o) => {
    all(
      patternSrc,
      valueSrc,
      flagsSrc,
    )(([pattern, value, flags]) => {
      const result = new RegExp(pattern, flags).exec(value);
      o(result ?? []);
    });
  };
