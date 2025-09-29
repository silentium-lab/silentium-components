import { DataType, DataUserType } from "silentium";

/**
 * Represents json from object
 */
export const toJson = (
  dataSrc: DataType,
  errorOwner?: DataUserType,
): DataType<string> => {
  return (u) => {
    dataSrc((data: unknown) => {
      try {
        u(JSON.stringify(data));
      } catch {
        errorOwner?.(new Error("Failed to convert to JSON"));
      }
    });
  };
};
