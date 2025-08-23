import { all, i, InformationType, TheInformation } from "silentium";

/**
 * Join sources of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
export const concatenated = (
  sources: InformationType<string>[],
  joinPartSrc: InformationType<string> = i(""),
): InformationType<string> => {
  return (o) => {
    all(
      joinPartSrc,
      ...sources,
    )(([joinPart, ...strings]) => {
      o(strings.join(joinPart));
    });
  };
};

export class Concatenated<T> extends TheInformation<T> {}
