import { applied, late, of, shared } from "silentium";
import { expect, test, vi } from "vitest";
import { branch } from "../behaviors/Branch";

test("Branch.dontRespondAfterRespond.test", () => {
  const l = late<number>(1);
  const ti = of<any>("then");
  const branchI = shared(
    branch(
      applied(l.value, (t) => t === 2),
      ti,
    ),
    true,
  );
  const g = vi.fn();
  branchI.value(g);

  l.give(2);
  expect(g).toHaveBeenLastCalledWith("then");

  const g2 = vi.fn();
  branchI.value(g2);
  l.give(1);
  expect(g2).not.toHaveBeenCalled();

  const g3 = vi.fn();
  branchI.value(g3);
  l.give(2);
  expect(g3).toHaveBeenLastCalledWith("then");

  const g4 = vi.fn();
  branchI.value(g4);
  l.give(3);
  expect(g4).not.toHaveBeenCalled();
});
