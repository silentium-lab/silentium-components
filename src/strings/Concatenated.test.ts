import { i } from "silentium";
import { expect, test, vi } from "vitest";
import { concatenated } from "../strings/Concatenated";

test("Concatenated.test", () => {
  const concatenatedSrc = concatenated(
    [i("one"), i("two"), i("three")],
    i("-"),
  );
  const g = vi.fn();
  concatenatedSrc(g);

  expect(g).toHaveBeenLastCalledWith("one-two-three");
});
