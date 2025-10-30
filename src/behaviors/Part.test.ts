import { Late, Of, SharedSource, Transport } from "silentium";
import { expect, test, vi } from "vitest";
import { Part } from "../behaviors/Part";

test("Part.test", () => {
  const $record = SharedSource(
    Late({
      name: "Peter",
      surname: "Parker",
    }),
  );
  const $name = Part<string>($record, Of("name"));
  const g = vi.fn();
  $record.event(Transport(g));
  expect(g).toHaveBeenLastCalledWith({ name: "Peter", surname: "Parker" });

  $name.use("Shmiter");
  expect(g).toHaveBeenLastCalledWith({ name: "Shmiter", surname: "Parker" });
});
