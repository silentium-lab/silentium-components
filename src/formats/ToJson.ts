import { EventType, EventUserType } from "silentium";

/**
 * Represents json from object
 */
export function ToJson(
  dataSrc: EventType,
  errorOwner?: EventUserType,
): EventType<string> {
  return (user) => {
    dataSrc((data: unknown) => {
      try {
        user(JSON.stringify(data));
      } catch {
        errorOwner?.(new Error("Failed to convert to JSON"));
      }
    });
  };
}
