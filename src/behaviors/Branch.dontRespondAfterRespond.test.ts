import { applied, late, of, shared } from "silentium";
import { expect, test, vi } from "vitest";
import { branch } from "../behaviors/Branch";

test("Branch.dontRespondAfterRespond.test", () => {
  const l = late<number>(1);
  const ti = of<any>("then");
  const branchI = shared(
    branch(
      applied(l.event, (t) => t === 2),
      ti,
    ),
    true,
  );
  const g = vi.fn();
  branchI.event(g);

  l.use(2);
  expect(g).toHaveBeenLastCalledWith("then");

  const g2 = vi.fn();
  branchI.event(g2);
  l.use(1);
  expect(g2).not.toHaveBeenCalled();

  const g3 = vi.fn();
  branchI.event(g3);
  l.use(2);
  expect(g3).toHaveBeenLastCalledWith("then");

  const g4 = vi.fn();
  branchI.event(g4);
  l.use(3);
  expect(g4).not.toHaveBeenCalled();
});
