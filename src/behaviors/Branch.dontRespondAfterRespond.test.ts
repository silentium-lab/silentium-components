import { applied, I, O, of, ownerSync, poolStateless } from "silentium";
import { expect, test, vi } from "vitest";
import { branch } from "../behaviors/Branch";

test("Branch.dontRespondAfterRespond.test", () => {
  const [dti, dto] = of<number>(1);
  const ti = I<any>("then");
  const [branchI] = poolStateless(
    branch(
      applied(dti, (t) => t === 2),
      ti,
    ),
  );
  const boolSync = ownerSync(branchI);

  dto.give(2);
  expect(boolSync.syncValue()).toBe("then");

  const g = vi.fn();
  branchI.value(O(g));
  dto.give(1);
  expect(g).not.toHaveBeenCalled();

  const g1 = vi.fn();
  branchI.value(O(g1));
  dto.give(2);
  expect(g1).toHaveBeenCalledWith("then");

  const g2 = vi.fn();
  branchI.value(O(g2));
  dto.give(3);
  expect(g2).not.toHaveBeenCalled();
});
