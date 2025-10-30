import { Event, EventType, Transport, TransportType } from "silentium";

/**
 * Represents object from json
 */
export function FromJson<T = Record<string, unknown>>(
  $json: EventType<string>,
  error?: TransportType,
): EventType<T> {
  return Event((user) => {
    $json.event(
      Transport((json) => {
        try {
          user.use(JSON.parse(json));
        } catch (e) {
          error?.use(new Error(`Failed to parse JSON: ${e}`));
        }
      }),
    );
  });
}
