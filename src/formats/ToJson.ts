import { Message, MessageType, Tap, TapType } from "silentium";

/**
 * Represents json from object
 */
export function ToJson($data: MessageType, error?: TapType) {
  return Message<string>(function () {
    $data.pipe(
      Tap((data: unknown) => {
        try {
          this.use(JSON.stringify(data));
        } catch {
          error?.use(new Error("Failed to convert to JSON"));
        }
      }),
    );
  });
}
