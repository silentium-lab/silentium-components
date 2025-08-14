import { applied, i, of, sharedStateless } from "silentium";
import { expect, test, vi } from "vitest";
import { branch } from "../behaviors/Branch";

test("Branch.dontRespondAfterRespond.test", () => {
  const [dti, dto] = of<number>(1);
  const ti = i<any>("then");
  const [branchI] = sharedStateless(
    branch(
      applied(dti, (t) => t === 2),
      ti,
    ),
  );
  const g = vi.fn();
  branchI(g);

  dto(2);
  expect(g).toHaveBeenLastCalledWith("then");

  const g2 = vi.fn();
  branchI(g2);
  dto(1);
  expect(g2).not.toHaveBeenCalled();

  const g3 = vi.fn();
  branchI(g3);
  dto(2);
  expect(g3).toHaveBeenLastCalledWith("then");

  const g4 = vi.fn();
  branchI(g4);
  dto(3);
  expect(g4).not.toHaveBeenCalled();
});
