import { Late } from "silentium";
import { describe, expect, test, vi } from "vitest";

import { Dirty } from "../behaviors/Dirty";

describe("Dirty.test", () => {
  test("One field changed", () => {
    const form = Late({
      name: "one",
      surname: "two",
    });
    const d = Dirty(form);
    const g = vi.fn();
    d.then(g);

    d.use({
      name: "new",
      surname: "two",
    });

    expect(g).toBeCalledWith({ name: "new" });
  });

  test("Nothing changed", () => {
    const form = Late({
      name: "one",
      surname: "two",
    });
    const d = Dirty(form);
    const g = vi.fn();
    d.then(g);

    d.use({
      name: "one",
      surname: "two",
    });

    expect(g).toBeCalledWith({});
  });

  test("Initial value", () => {
    const form = Late({
      name: "one",
      surname: "two",
    });
    const d = Dirty(form);
    const g = vi.fn();
    d.then(g);

    expect(g).toBeCalledWith({});
  });
});
