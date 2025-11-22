import { Message, MessageType } from "silentium";

/**
 * Represents json from object
 */
export function ToJson($data: MessageType) {
  return Message<string>(function ToJsonImpl(resolve, reject) {
    $data.then((data: unknown) => {
      try {
        resolve(JSON.stringify(data));
      } catch {
        reject(new Error("Failed to convert to JSON"));
      }
    });
  });
}
