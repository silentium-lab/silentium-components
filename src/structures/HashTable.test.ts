import { sourceOf, sourceSync } from "silentium";
import { expect, test } from "vitest";
import { hashTable } from "../structures/HashTable";

test("HashTable.test", () => {
  const entrySource = sourceOf<[string, string]>();
  const hashTableSrc = sourceSync(hashTable(entrySource));
  entrySource.give(["key-one", "value-one"]);
  entrySource.give(["key-two", "value-two"]);

  expect(hashTableSrc.syncValue()).toStrictEqual({
    "key-one": "value-one",
    "key-two": "value-two",
  });
});
