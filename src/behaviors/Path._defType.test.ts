import { Of } from "silentium";
import { expect, test, vi } from "vitest";

import { Path } from "./Path";

test("Path._defType.test - verify def parameter type matches return type", () => {
  const record1 = {
    name: "Peter",
    surname: "Parker",
  };

  const missingField = Path<string>(
    Of(record1),
    Of("middleName"),
    "DefaultName",
  );
  const g1 = vi.fn();
  missingField.then(g1);
  expect(g1).toHaveBeenLastCalledWith("DefaultName");

  const record2 = {
    age: 25,
    height: 180,
  };

  const missingNumber = Path<number>(Of(record2), Of("weight"), Of(70));
  const g2 = vi.fn();
  missingNumber.then(g2);
  expect(g2).toHaveBeenLastCalledWith(70);

  const record3 = {
    user: {
      name: "John",
    },
  };

  const missingObject = Path<{ name: string }>(
    Of(record3),
    Of("user.address"),
    Of({ name: "Default" }),
  );
  const g3 = vi.fn();
  missingObject.then(g3);
  expect(g3).toHaveBeenLastCalledWith({ name: "Default" });

  const record4 = {
    isActive: true,
  };

  const missingBoolean = Path<boolean>(Of(record4), Of("isAdmin"), Of(false));
  const g4 = vi.fn();
  missingBoolean.then(g4);
  expect(g4).toHaveBeenLastCalledWith(false);

  const record5 = {
    items: [1, 2, 3],
  };

  const missingArray = Path<number[]>(
    Of(record5),
    Of("otherItems"),
    Of([4, 5, 6]),
  );
  const g5 = vi.fn();
  missingArray.then(g5);
  expect(g5).toHaveBeenLastCalledWith([4, 5, 6]);
});

test("Path._defType.test - verify type inference works correctly", () => {
  const record = {
    name: "Test",
  };

  const stringResult = Path(Of(record), Of("missing"), Of("default"));
  const g1 = vi.fn();
  stringResult.then(g1);
  expect(g1).toHaveBeenLastCalledWith("default");
  expect(typeof g1.mock.lastCall?.[0]).toBe("string");

  const numberResult = Path(Of(record), Of("missing"), Of(42));
  const g2 = vi.fn();
  numberResult.then(g2);
  expect(g2).toHaveBeenLastCalledWith(42);
  expect(typeof g2.mock.lastCall?.[0]).toBe("number");

  const booleanResult = Path(Of(record), Of("missing"), Of(true));
  const g3 = vi.fn();
  booleanResult.then(g3);
  expect(g3).toHaveBeenLastCalledWith(true);
  expect(typeof g3.mock.lastCall?.[0]).toBe("boolean");
});
