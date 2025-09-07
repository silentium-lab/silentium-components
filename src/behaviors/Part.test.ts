import { From, Late, SharedSource } from "silentium";
import { Part } from "../behaviors/Part";
import { expect, test, vi } from "vitest";

test("Part.test", () => {
  const recordSrc = new SharedSource(
    new Late({
      name: "Peter",
      surname: "Parker",
    }),
  );
  const nameSrc = new Part<string>(recordSrc, "name");
  const g = vi.fn();
  recordSrc.value(new From(g));
  expect(g).toHaveBeenLastCalledWith({ name: "Peter", surname: "Parker" });

  nameSrc.give("Shmiter");
  expect(g).toHaveBeenLastCalledWith({ name: "Shmiter", surname: "Parker" });
});
