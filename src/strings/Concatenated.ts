import { all, I, Information, O } from "silentium";

/**
 * Join sources of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
export const concatenated = (
  sources: Information<string>[],
  joinPartSrc: Information<string> = I(""),
): Information<string> => {
  return I((o) => {
    all(joinPartSrc, ...sources).value(
      O(([joinPart, ...strings]) => {
        o.give(strings.join(joinPart));
      }),
    );
  });
};
