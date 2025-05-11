import { give, GuestType, sourceCombined, SourceType } from "silentium";

/**
 * First match of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
export const regexpMatch = (
  patternSrc: SourceType<string>,
  valueSrc: SourceType<string>,
  flagsSrc: SourceType<string> = "",
): SourceType<string[]> =>
  sourceCombined(
    patternSrc,
    valueSrc,
    flagsSrc,
  )((g: GuestType<string[]>, pattern, value, flags) => {
    const result = new RegExp(pattern, flags).exec(value);
    give(result ?? [], g);
  });
