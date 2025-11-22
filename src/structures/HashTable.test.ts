import { Late } from "silentium";
import { expect, test, vi } from "vitest";

import { HashTable } from "../structures/HashTable";

test("HashTable.test", () => {
  const $entry = Late<[string, string]>();
  const $hash = HashTable($entry);
  const g = vi.fn();
  $hash.then(g);
  $entry.use(["key-one", "value-one"]);
  $entry.use(["key-two", "value-two"]);

  expect(g).toHaveBeenLastCalledWith({
    "key-one": "value-one",
    "key-two": "value-two",
  });
});
