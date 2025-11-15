import { Late, Transport } from "silentium";
import { HashTable } from "../structures/HashTable";
import { expect, test, vi } from "vitest";

test("HashTable.test", () => {
  const $entry = Late<[string, string]>();
  const $hash = HashTable($entry);
  const g = vi.fn();
  $hash.to(Transport(g));
  $entry.use(["key-one", "value-one"]);
  $entry.use(["key-two", "value-two"]);

  expect(g).toHaveBeenLastCalledWith({
    "key-one": "value-one",
    "key-two": "value-two",
  });
});
