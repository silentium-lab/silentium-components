import { give, GuestType, sourceCombined, SourceType } from "silentium";

/**
 * Boolean source what checks what string matches pattern
 */
export const regexpMatched = (
  patternSrc: SourceType<string>,
  valueSrc: SourceType<string>,
  flagsSrc: SourceType<string> = "",
): SourceType<boolean> =>
  sourceCombined(
    patternSrc,
    valueSrc,
    flagsSrc,
  )((g: GuestType<boolean>, pattern, value, flags) => {
    give(new RegExp(pattern, flags).test(value), g);
  });
