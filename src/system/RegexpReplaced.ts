import { give, GuestType, sourceCombined, SourceType } from "silentium";

/**
 * Returns string replaced by regular expression pattern
 */
export const regexpReplaced = (
  valueSrc: SourceType<string>,
  patternSrc: SourceType<string>,
  replaceValueSrc: SourceType<string>,
  flagsSrc: SourceType<string> = "",
): SourceType<string> =>
  sourceCombined(
    patternSrc,
    valueSrc,
    replaceValueSrc,
    flagsSrc,
  )((g: GuestType<string>, pattern, value, replaceValue, flags) => {
    give(String(value).replace(new RegExp(pattern, flags), replaceValue), g);
  });
