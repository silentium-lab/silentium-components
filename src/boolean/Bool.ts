import { applied, InformationType } from "silentium";

/**
 * Convert any source to boolean source
 * https://silentium-lab.github.io/silentium-components/#/boolean/bool
 */
export const bool = (baseSrc: InformationType) => applied(baseSrc, Boolean);
