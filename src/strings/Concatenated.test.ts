import { I, ownerSync } from "silentium";
import { expect, test } from "vitest";
import { concatenated } from "../strings/Concatenated";

test("Concatenated.test", () => {
  const concatenatedSrc = ownerSync(
    concatenated([I("one"), I("two"), I("three")], I("-")),
  );

  expect(concatenatedSrc.syncValue()).toBe("one-two-three");
});
