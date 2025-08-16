import { InformationType, OwnerType } from "silentium";

/**
 * Represents object from json
 */
export const fromJson = <T>(
  jsonSrc: InformationType<string>,
  errorOwner?: OwnerType,
): InformationType<T> => {
  return (o) => {
    jsonSrc((json) => {
      try {
        o(JSON.parse(json));
      } catch (error) {
        errorOwner?.(new Error(`Failed to parse JSON: ${error}`));
      }
    });
  };
};
