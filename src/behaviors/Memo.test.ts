import { From, Late, Shared } from "silentium";
import { expect, test, vi } from "vitest";
import { Memo } from "../behaviors/Memo";

test("Memo.test", () => {
  const l = new Late<number>(1);
  const mem = new Shared(new Memo(l));
  const g = vi.fn();
  mem.value(new From(g));
  let counter = 0;

  mem.value(
    new From(() => {
      counter += 1;
    }),
  );

  l.give(2);
  l.give(2);
  l.give(2);
  l.give(2);
  l.give(2);

  expect(g).toHaveBeenLastCalledWith(2);
  expect(counter).toBe(2);

  l.give(3);

  expect(g).toHaveBeenLastCalledWith(3);
  expect(counter).toBe(3);
});
