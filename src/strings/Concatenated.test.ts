import { sourceSync } from "silentium";
import { concatenated } from "../strings/Concatenated";
import { expect, test } from "vitest";

test("Concatenated.test", () => {
  const concatenatedSrc = sourceSync(
    concatenated(["one", "two", "three"], "-"),
  );

  expect(concatenatedSrc.syncValue()).toBe("one-two-three");
});
