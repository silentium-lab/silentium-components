import { Event, EventType, Transport, TransportType } from "silentium";

/**
 * Represents json from object
 */
export function ToJson(
  $data: EventType,
  error?: TransportType,
): EventType<string> {
  return Event((transport) => {
    $data.event(
      Transport((data: unknown) => {
        try {
          transport.use(JSON.stringify(data));
        } catch {
          error?.use(new Error("Failed to convert to JSON"));
        }
      }),
    );
  });
}
