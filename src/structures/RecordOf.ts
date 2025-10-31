import { All, Event, EventType, Transport } from "silentium";

type UnInformation<T> = T extends EventType<infer U> ? U : never;

/**
 * Returns record Of data from record Of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
export function RecordOf<T extends EventType>(
  record: Record<string, T>,
): EventType<Record<string, UnInformation<T>>> {
  return Event((transport) => {
    const keys = Object.keys(record);
    All(...Object.values(record)).event(
      Transport((entries) => {
        const record: Record<string, any> = {};
        entries.forEach((entry, index) => {
          record[keys[index]] = entry;
        });
        transport.use(record);
      }),
    );
  });
}
