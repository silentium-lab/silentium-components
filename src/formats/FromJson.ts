import { EventType, EventUserType } from "silentium";

/**
 * Represents object from json
 */
export function FromJson<T = Record<string, unknown>>(
  jsonSrc: EventType<string>,
  errorOwner?: EventUserType,
): EventType<T> {
  return (user) => {
    jsonSrc((json) => {
      try {
        user(JSON.parse(json));
      } catch (error) {
        errorOwner?.(new Error(`Failed to parse JSON: ${error}`));
      }
    });
  };
}
