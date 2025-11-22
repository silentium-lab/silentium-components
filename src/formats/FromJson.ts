import { Message, MessageType } from "silentium";

/**
 * Represents object from json
 */
export function FromJson<T = Record<string, unknown>>(
  $json: MessageType<string>,
) {
  return Message<T>(function FromJsonImpl(resolve, reject) {
    $json.then((json) => {
      try {
        resolve(JSON.parse(json));
      } catch (e) {
        reject(new Error(`Failed to parse JSON: ${e}`));
      }
    });
  });
}
