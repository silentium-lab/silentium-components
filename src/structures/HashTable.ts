import { Message, MessageType, Tap } from "silentium";

/**
 * By receiving a message with a key and value, collects a table
 * of all previously received messages in the form of a structure
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
export function HashTable<T>($base: MessageType<[string, unknown]>) {
  return Message<T>(function () {
    const record: Record<string, unknown> = {};

    $base.pipe(
      Tap(([key, value]) => {
        record[key] = value;
        this.use(record as T);
      }),
    );
  });
}
