import { Message, MessageType, Tap, TapType } from "silentium";

/**
 * Represents object from json
 */
export function FromJson<T = Record<string, unknown>>(
  $json: MessageType<string>,
  error?: TapType,
) {
  return Message<T>(function () {
    $json.pipe(
      Tap((json) => {
        try {
          this.use(JSON.parse(json));
        } catch (e) {
          error?.use(new Error(`Failed to parse JSON: ${e}`));
        }
      }),
    );
  });
}
