import { All, Applied, LateShared, Primitive } from "silentium";
import { Transaction } from "../behaviors/Transaction";
import { describe, expect, test } from "vitest";

describe("Transaction.test", () => {
  test("value inside transaction", () => {
    const $base = LateShared(1);

    const t = Transaction($base.event, ($b) => {
      return Applied($b, (x) => x * 2);
    });

    expect(Primitive(t).primitiveWithException()).toBe(2);
  });

  test("value inside transaction", () => {
    const $base = LateShared(1);
    const $mult = LateShared(2);

    const t = Transaction(
      $base.event,
      ($b, $m) => {
        return Applied(All($b, $m), ([x, m]) => x * m);
      },
      $mult.event,
    );

    expect(Primitive(t).primitiveWithException()).toBe(2);

    $base.use(2);

    expect(Primitive(t).primitiveWithException()).toBe(4);

    // $mult changed after $base, hence result is 6, 3 * 2
    $base.use(3);
    $mult.use(3);

    expect(Primitive(t).primitiveWithException()).toBe(6);

    // $mult is of value 3, hence result will be 12
    $base.use(4);

    expect(Primitive(t).primitiveWithException()).toBe(12);
  });
});
