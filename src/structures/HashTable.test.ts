import { of, ownerSync } from "silentium";
import { expect, test } from "vitest";
import { hashTable } from "../structures/HashTable";

test("HashTable.test", () => {
  const [entrySource, eo] = of<[string, string]>();
  const hashTableSrc = ownerSync(hashTable(entrySource));
  eo.give(["key-one", "value-one"]);
  eo.give(["key-two", "value-two"]);

  expect(hashTableSrc.syncValue()).toStrictEqual({
    "key-one": "value-one",
    "key-two": "value-two",
  });
});
