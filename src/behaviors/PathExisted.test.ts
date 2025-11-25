import { expect, test, vi } from "vitest";

import { PathExisted } from "./PathExisted";

test("PathExisted._main.test", () => {
  const record = {
    name: "Peter",
    surname: "Parker",
  };

  const name = PathExisted(record, "name");
  const g1 = vi.fn();
  name.message().then(g1);
  expect(g1).toHaveBeenLastCalledWith("Peter");

  const empty = PathExisted(record, "no-field");
  let msg = 0;
  empty.message().then(() => {
    msg += 1;
  });
  expect(msg).toBe(0);

  let emp = 0;
  empty.empty().then(() => {
    emp += 1;
  });
  expect(emp).toBe(1);
});
