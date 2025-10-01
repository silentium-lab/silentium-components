import { late } from "silentium";
import { hashTable } from "../structures/HashTable";
import { expect, test, vi } from "vitest";

test("HashTable.test", () => {
  const entrySource = late<[string, string]>();
  const hashTableSrc = hashTable(entrySource.value);
  const g = vi.fn();
  hashTableSrc(g);
  entrySource.give(["key-one", "value-one"]);
  entrySource.give(["key-two", "value-two"]);

  expect(g).toHaveBeenLastCalledWith({
    "key-one": "value-one",
    "key-two": "value-two",
  });
});
