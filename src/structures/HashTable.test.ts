import { Late } from "silentium";
import { expect, test, vi } from "vitest";

import { HashTable } from "../structures/HashTable";

test("HashTable.test", () => {
  const $entry = Late<[string, string]>();
  const $hash = HashTable($entry);
  const hashes: any[] = [];
  $hash.then((v: any) => {
    hashes.push({ ...v });
  });
  const g = vi.fn();
  $hash.then(g);
  $entry.use(["key-one", "value-one"]);
  $entry.use(["key-two", "value-two"]);

  expect(g).toHaveBeenLastCalledWith({
    "key-one": "value-one",
    "key-two": "value-two",
  });

  expect(hashes).toStrictEqual([
    {
      "key-one": "value-one",
    },
    {
      "key-one": "value-one",
      "key-two": "value-two",
    },
  ]);

  $entry.use(["key-one", "value-new"]);

  expect(g).toHaveBeenLastCalledWith({
    "key-one": "value-new",
    "key-two": "value-two",
  });
  expect(hashes).toStrictEqual([
    {
      "key-one": "value-one",
    },
    {
      "key-one": "value-one",
      "key-two": "value-two",
    },
    {
      "key-one": "value-new",
      "key-two": "value-two",
    },
  ]);
});
