import { Event, EventType, Transport } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
export function HashTable<T>(
  $base: EventType<[string, unknown]>,
): EventType<T> {
  return Event((transport) => {
    const record: Record<string, unknown> = {};

    $base.event(
      Transport(([key, value]) => {
        record[key] = value;
        transport.use(record as T);
      }),
    );
  });
}
