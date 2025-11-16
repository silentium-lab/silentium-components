import { Late, Of, SharedSource, Transport } from "silentium";
import { describe, expect, test, vi } from "vitest";
import { Part } from "../behaviors/Part";

describe("Part.test", () => {
  test("regular", () => {
    const $record = SharedSource(
      Late({
        name: "Peter",
        surname: "Parker",
      }),
    );
    const $name = Part<string>($record, Of("name"));
    const g = vi.fn();
    $record.to(Transport(g));
    expect(g).toHaveBeenLastCalledWith({ name: "Peter", surname: "Parker" });

    $name.use("Shmiter");
    expect(g).toHaveBeenLastCalledWith({ name: "Shmiter", surname: "Parker" });
  });

  test("raw key", () => {
    const $record = SharedSource(
      Late({
        name: "Peter",
        surname: "Parker",
      }),
    );
    const $name = Part<string>($record, "name");
    const g = vi.fn();
    $record.to(Transport(g));
    expect(g).toHaveBeenLastCalledWith({ name: "Peter", surname: "Parker" });

    $name.use("Shmiter");
    expect(g).toHaveBeenLastCalledWith({ name: "Shmiter", surname: "Parker" });
  });
});
