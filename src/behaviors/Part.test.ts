import { Late, Of, SharedSource } from "silentium";
import { part } from "../behaviors/Part";
import { expect, test, vi } from "vitest";

test("Part.test", () => {
  const recordSrc = SharedSource(
    Late({
      name: "Peter",
      surname: "Parker",
    }),
  );
  const nameSrc = part<string>(recordSrc, Of("name"));
  const g = vi.fn();
  recordSrc.event(g);
  expect(g).toHaveBeenLastCalledWith({ name: "Peter", surname: "Parker" });

  nameSrc.use("Shmiter");
  expect(g).toHaveBeenLastCalledWith({ name: "Shmiter", surname: "Parker" });
});
