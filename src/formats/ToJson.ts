import { InformationType, OwnerType } from "silentium";

/**
 * Repreresents json from object
 */
export const toJson = (
  dataSrc: InformationType,
  errorOwner?: OwnerType,
): InformationType<string> => {
  return (o) => {
    dataSrc((data) => {
      try {
        o(JSON.stringify(data));
      } catch {
        errorOwner?.(new Error("Failed to convert to JSON"));
      }
    });
  };
};
