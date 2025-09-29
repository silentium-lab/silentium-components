import { late, of, sharedSource } from "silentium";
import { part } from "../behaviors/Part";
import { expect, test, vi } from "vitest";

test("Part.test", () => {
  const recordSrc = sharedSource(
    late({
      name: "Peter",
      surname: "Parker",
    }),
  );
  const nameSrc = part<string>(recordSrc, of("name"));
  const g = vi.fn();
  recordSrc.value(g);
  expect(g).toHaveBeenLastCalledWith({ name: "Peter", surname: "Parker" });

  nameSrc.give("Shmiter");
  expect(g).toHaveBeenLastCalledWith({ name: "Shmiter", surname: "Parker" });
});
