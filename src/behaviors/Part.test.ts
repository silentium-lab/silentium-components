import { Late, Of } from "silentium";
import { describe, expect, test, vi } from "vitest";

import { Part } from "../behaviors/Part";

describe("Part.test", () => {
  test("regular", () => {
    const $record = Late({
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
    const $record = Late({
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

  test("defaultValue when key does not exist", () => {
    const $record = Late({
      name: "Peter",
      surname: "Parker",
    });
    const $age = Part<number>($record, "age", 25);
    const gn = vi.fn();
    $age.then(gn);
    expect(gn).toHaveBeenLastCalledWith(25);
  });

  test("defaultValue when value is undefined", () => {
    const $record = Late({
      name: "Peter",
      surname: "Parker",
      age: undefined,
    });
    const $age = Part<number>($record, "age", 25);
    const gn = vi.fn();
    $age.then(gn);
    expect(gn).toHaveBeenLastCalledWith(25);
  });

  test("value returned when key exists and is not undefined", () => {
    const $record = Late({
      name: "Peter",
      surname: "Parker",
      age: 30,
    });
    const $age = Part<number>($record, "age", 25);
    const gn = vi.fn();
    $age.then(gn);
    expect(gn).toHaveBeenLastCalledWith(30);
  });
});
