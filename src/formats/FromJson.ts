import { Message, MessageType, Transport, TransportType } from "silentium";

/**
 * Represents object from json
 */
export function FromJson<T = Record<string, unknown>>(
  $json: MessageType<string>,
  error?: TransportType,
) {
  return Message<T>((transport) => {
    $json.to(
      Transport((json) => {
        try {
          transport.use(JSON.parse(json));
        } catch (e) {
          error?.use(new Error(`Failed to parse JSON: ${e}`));
        }
      }),
    );
  });
}
