import { late } from "silentium";
import { hashTable } from "../structures/HashTable";
import { expect, test, vi } from "vitest";

test("HashTable.test", () => {
  const entrySource = late<[string, string]>();
  const hashTableSrc = hashTable(entrySource.event);
  const g = vi.fn();
  hashTableSrc(g);
  entrySource.use(["key-one", "value-one"]);
  entrySource.use(["key-two", "value-two"]);

  expect(g).toHaveBeenLastCalledWith({
    "key-one": "value-one",
    "key-two": "value-two",
  });
});
