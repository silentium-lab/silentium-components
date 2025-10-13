import { Of } from "silentium";
import { concatenated } from "../strings/Concatenated";
import { expect, test, vi } from "vitest";

test("Concatenated.test", () => {
  const concatenatedSrc = concatenated(
    [Of("one"), Of("two"), Of("three")],
    Of("-"),
  );
  const g = vi.fn();
  concatenatedSrc(g);

  expect(g).toHaveBeenLastCalledWith("one-two-three");
});
