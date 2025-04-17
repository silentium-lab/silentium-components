import { SourceSync, SourceWithPool } from "silentium";
import { HashTable } from "../structures/HashTable";
import { expect, test } from "vitest";

test("HashTable.test", () => {
  const entrySource = new SourceWithPool<[string, string]>();
  const hashTable = new SourceSync(new HashTable(entrySource));
  entrySource.give(["key-one", "value-one"]);
  entrySource.give(["key-two", "value-two"]);

  expect(hashTable.syncValue()).toStrictEqual({
    "key-one": "value-one",
    "key-two": "value-two",
  });
});
