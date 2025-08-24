import { From, Late } from "silentium";
import { expect, test, vi } from "vitest";
import { HashTable } from "../structures/HashTable";

test("HashTable.test", () => {
  const entrySource = new Late<[string, string]>();
  const hashTableSrc = new HashTable(entrySource);
  const g = vi.fn();
  hashTableSrc.value(new From(g));
  entrySource.owner().give(["key-one", "value-one"]);
  entrySource.owner().give(["key-two", "value-two"]);

  expect(g).toHaveBeenLastCalledWith({
    "key-one": "value-one",
    "key-two": "value-two",
  });
});
