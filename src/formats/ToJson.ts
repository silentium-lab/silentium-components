import { EventType, EventUserType } from "silentium";

/**
 * Represents json from object
 */
export const toJson = (
  dataSrc: EventType,
  errorOwner?: EventUserType,
): EventType<string> => {
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
