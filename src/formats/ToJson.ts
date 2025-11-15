import { Message, MessageType, Transport, TransportType } from "silentium";

/**
 * Represents json from object
 */
export function ToJson($data: MessageType, error?: TransportType) {
  return Message<string>((transport) => {
    $data.to(
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
