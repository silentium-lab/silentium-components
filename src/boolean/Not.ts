import { InformationType, TheInformation } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
export const not = (
  baseSrc: InformationType<boolean>,
): InformationType<boolean> => {
  return (o) => {
    baseSrc((v) => {
      o(!v);
    });
  };
};

export class Not<T> extends TheInformation<T> {}
