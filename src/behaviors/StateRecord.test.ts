import { Late, Value } from "silentium";
import { describe, expect, test } from "vitest";

import { StateRecord } from "./StateRecord";

describe("StateRecord", () => {
  test("Work example", () => {
    const state$ = Late("start");
    const value$ = Late();
    const record$ = Value(StateRecord(state$, value$, ["one", "two"]));
    expect(record$.value).toBe(null);

    state$.use("one");
    value$.use(123);
    state$.use("two");
    value$.use(456);

    expect(record$.value).toStrictEqual({
      one: 123,
      two: 456,
    });
  });

  test("Broken sequence", () => {
    const state$ = Late("start");
    const value$ = Late();
    const record$ = Value(StateRecord(state$, value$, ["one", "two", "three"]));
    expect(record$.value).toBe(null);

    state$.use("one");
    value$.use(123);
    state$.use("three");
    value$.use(456);
    state$.use("two");
    value$.use(321);

    expect(record$.value).toBeNull();
  });

  test("Broken sequence and restored", () => {
    const state$ = Late("start");
    const value$ = Late();
    const record$ = Value(StateRecord(state$, value$, ["one", "two", "three"]));
    expect(record$.value).toBe(null);

    state$.use("one");
    value$.use(123);
    state$.use("three"); // Broken here, resets to looking for "one"
    value$.use(456);
    state$.use("two"); // Nothing here, it is not "one"
    value$.use(321);
    state$.use("one");
    value$.use(123);
    state$.use("two");
    value$.use(321);
    state$.use("three"); // Restored and returns value
    value$.use(456);

    expect(record$.value).toStrictEqual({
      one: 123,
      two: 321,
      three: 456,
    });
  });

  test("Changing", () => {
    const state$ = Late("start");
    const value$ = Late();
    const results: any[] = [];
    StateRecord(state$, value$, ["one", "two"]).then((v) => {
      results.push(v);
    });

    state$.use("one");
    value$.use(123);
    state$.use("two");
    value$.use(456);
    value$.use(789);

    expect(results).toStrictEqual([
      {
        one: 123,
        two: 456,
      },
    ]);

    state$.use("one");
    value$.use(321);
    state$.use("two");
    value$.use(654);

    expect(results).toStrictEqual([
      {
        one: 123,
        two: 456,
      },
      {
        one: 321,
        two: 654,
      },
    ]);

    // Many times setting "one"
    state$.use("one");
    value$.use(321);
    value$.use(222);
    value$.use(111);
    state$.use("two");
    value$.use(222);

    expect(results).toStrictEqual([
      {
        one: 123,
        two: 456,
      },
      {
        one: 321,
        two: 654,
      },
      {
        one: 111,
        two: 222,
      },
    ]);
  });
});
