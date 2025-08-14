import { of } from "silentium";
import { expect, test, vi } from "vitest";
import { hashTable } from "../structures/HashTable";

test("HashTable.test", () => {
  const [entrySource, eo] = of<[string, string]>();
  const hashTableSrc = hashTable(entrySource);
  const g = vi.fn();
  hashTableSrc(g);
  eo(["key-one", "value-one"]);
  eo(["key-two", "value-two"]);

  expect(g).toHaveBeenLastCalledWith({
    "key-one": "value-one",
    "key-two": "value-two",
  });
});
