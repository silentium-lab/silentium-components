import { Actual, All, Message, MessageType } from "silentium";

type UnWrap<T> = T extends MessageType<infer U> ? U : T;

/**
 * Returns record Of data from record Of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
export function Record<T>(record: Record<string, T>) {
  return Message<Record<string, UnWrap<T>>>(function RecordImpl(r) {
    const keys = Object.keys(record);
    keys.forEach(function recordKeys(key) {
      record[key] = Actual(record[key]) as any;
    });
    All(...(Object.values(record) as any)).then(function recordAllSub(entries) {
      const record: Record<string, any> = {};
      entries.forEach(function recordAllForEach(entry, index) {
        record[keys[index]] = entry;
      });
      r(record);
    });
  });
}
