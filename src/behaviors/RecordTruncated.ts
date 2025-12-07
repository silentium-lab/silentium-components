import { ActualMessage, Computed, MaybeMessage } from "silentium";

/**
 * Helps eliminate unwanted values
 * that shouldn't exist in object fields
 */
export function RecordTruncated(
  _record: MaybeMessage<Record<string, unknown>>,
  _badValues: MaybeMessage<unknown[]>,
) {
  const $record = ActualMessage(_record);
  const $badValues = ActualMessage(_badValues);
  const processRecord = (obj: any, badValues: unknown[]) => {
    if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
      return obj;
    }

    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (badValues.includes(value)) continue;

      const processedValue = processRecord(value, badValues);

      if (
        processedValue !== undefined &&
        !(
          typeof processedValue === "object" &&
          processedValue !== null &&
          !Array.isArray(processedValue) &&
          Object.keys(processedValue).length === 0
        )
      ) {
        result[key] = processedValue;
      }
    }

    return result;
  };

  return Computed(processRecord, $record, $badValues);
}
