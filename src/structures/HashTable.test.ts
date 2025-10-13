import { Late } from "silentium";
import { HashTable } from "../structures/HashTable";
import { expect, test, vi } from "vitest";

test("HashTable.test", () => {
  const entrySource = Late<[string, string]>();
  const hashTableSrc = HashTable(entrySource.event);
  const g = vi.fn();
  hashTableSrc(g);
  entrySource.use(["key-one", "value-one"]);
  entrySource.use(["key-two", "value-two"]);

  expect(g).toHaveBeenLastCalledWith({
    "key-one": "value-one",
    "key-two": "value-two",
  });
});
