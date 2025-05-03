import { give, GuestType, sourceCombined, SourceType } from "silentium";

/**
 * Join sources of strings to one source
 */
export const concatenated = (
  sources: SourceType<string>[],
  joinPartSrc: SourceType<string> = "",
): SourceType<string> => {
  const result = sourceCombined(
    joinPartSrc,
    ...sources,
  )((g: GuestType<string>, joinPart, ...strings) => {
    give(strings.join(joinPart), g);
  });

  return result;
};
