import { of } from "silentium";
import { concatenated } from "../strings/Concatenated";
import { expect, test, vi } from "vitest";

test("Concatenated.test", () => {
  const concatenatedSrc = concatenated(
    [of("one"), of("two"), of("three")],
    of("-"),
  );
  const g = vi.fn();
  concatenatedSrc(g);

  expect(g).toHaveBeenLastCalledWith("one-two-three");
});
