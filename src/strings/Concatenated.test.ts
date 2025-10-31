import { Of, Transport } from "silentium";
import { Concatenated } from "../strings/Concatenated";
import { expect, test, vi } from "vitest";

test("Concatenated.test", () => {
  const $concatenated = Concatenated(
    [Of("one"), Of("two"), Of("three")],
    Of("-"),
  );
  const g = vi.fn();
  $concatenated.event(Transport(g));

  expect(g).toHaveBeenLastCalledWith("one-two-three");
});
