import { Late, Tap } from "silentium";
import { Task } from "../behaviors/Task";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});

afterEach(() => {
  vi.runOnlyPendingTimers();
  vi.useRealTimers();
});

test("Task delays emission", () => {
  const $trigger = Late<string>();
  const delayed = Task($trigger, 100);
  const data: string[] = [];
  delayed.pipe(
    Tap((v) => {
      data.push(v);
    }),
  );

  $trigger.use("first");

  // Before delay, no emission
  expect(data).toStrictEqual([]);

  // Advance time to trigger emission
  vi.advanceTimersByTime(100);

  expect(data).toStrictEqual(["first"]);
});

test("Task emits only last value when multiple before delay", () => {
  const $trigger = Late<string>();
  const delayed = Task($trigger, 100);
  const data: string[] = [];
  delayed.pipe(
    Tap((v) => {
      data.push(v);
    }),
  );

  $trigger.use("first");
  $trigger.use("second");
  $trigger.use("third");

  // Before delay, no emission
  expect(data).toStrictEqual([]);

  // Advance time partially
  vi.advanceTimersByTime(50);
  expect(data).toStrictEqual([]);

  // Advance to full delay
  vi.advanceTimersByTime(50);

  // Only last value should be emitted
  expect(data).toStrictEqual(["third"]);
});
