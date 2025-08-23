import { Applied, From, Late, Of, Shared } from "silentium";
import { expect, test, vi } from "vitest";
import { Branch } from "../behaviors/Branch";

test("Branch.dontRespondAfterRespond.test", () => {
  const l = new Late<number>(1);
  const ti = new Of<any>("then");
  const branchI = new Shared(
    new Branch(new Applied(l, (t) => t === 2), ti),
    true,
  );
  const g = vi.fn();
  branchI.value(new From(g));

  l.owner().give(2);
  expect(g).toHaveBeenLastCalledWith("then");

  const g2 = vi.fn();
  branchI.value(new From(g2));
  l.owner().give(1);
  expect(g2).not.toHaveBeenCalled();

  const g3 = vi.fn();
  branchI.value(new From(g3));
  l.owner().give(2);
  expect(g3).toHaveBeenLastCalledWith("then");

  const g4 = vi.fn();
  branchI.value(new From(g4));
  l.owner().give(3);
  expect(g4).not.toHaveBeenCalled();
});
