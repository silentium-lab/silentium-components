import { EventType, EventUserType } from "silentium";

/**
 * Represents object from json
 */
export const fromJson = <T = Record<string, unknown>>(
  jsonSrc: EventType<string>,
  errorOwner?: EventUserType,
): EventType<T> => {
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
