import { all, DataType, of } from "silentium";

/**
 * Join sources of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
export const concatenated = (
  sources: DataType<string>[],
  joinPartSrc: DataType<string> = of(""),
): DataType<string> => {
  return (u) => {
    all(
      joinPartSrc,
      ...sources,
    )(([joinPart, ...strings]) => {
      u(strings.join(joinPart));
    });
  };
};
