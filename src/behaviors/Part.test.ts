import { LateShared, Of } from "silentium";
import { describe, expect, test, vi } from "vitest";

import { Part } from "../behaviors/Part";

describe("Part.test", () => {
  test("regular", () => {
    const $record = LateShared({
      name: "Peter",
      surname: "Parker",
    });
    const $name = Part<string>($record, Of("name"));
    const g = vi.fn();
    $record.then(g);
    expect(g).toHaveBeenLastCalledWith({ name: "Peter", surname: "Parker" });

    $name.use("Shmiter");
    expect(g).toHaveBeenLastCalledWith({ name: "Shmiter", surname: "Parker" });
  });

  test("raw key", () => {
    const $record = LateShared({
      name: "Peter",
      surname: "Parker",
    });
    const $name = Part<string>($record, "name");
    const g = vi.fn();
    $record.then(g);
    expect(g).toHaveBeenLastCalledWith({ name: "Peter", surname: "Parker" });

    $name.use("Shmiter");
    expect(g).toHaveBeenLastCalledWith({ name: "Shmiter", surname: "Parker" });

    const gn = vi.fn();
    $name.then(gn);
    expect(gn).toHaveBeenLastCalledWith("Shmiter");
  });
});
