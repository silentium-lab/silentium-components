import { DataType, DataUserType } from "silentium";

/**
 * Represents object from json
 */
export const fromJson = <T = Record<string, unknown>>(
  jsonSrc: DataType<string>,
  errorOwner?: DataUserType,
): DataType<T> => {
  return (u) => {
    jsonSrc((json) => {
      try {
        u(JSON.parse(json));
      } catch (error) {
        errorOwner?.(new Error(`Failed to parse JSON: ${error}`));
      }
    });
  };
};
