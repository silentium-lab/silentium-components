import { Default, Empty, Late, Shared } from "silentium";
import { describe, expect, test, vi } from "vitest";

import { Lock } from "../behaviors/Lock";

describe("Lock.test", () => {
  test("base example", () => {
    const source = Late<number>(1);
    const lockSrc = Late<boolean>(false);

    const ls = Lock(source, lockSrc);
    const lockedSrc = Shared(ls);
    const g = vi.fn();
    lockedSrc.then(g);

    expect(g).toHaveBeenLastCalledWith(1);

    source.use(2);

    expect(g).toHaveBeenLastCalledWith(2);

    lockSrc.use(true);
    source.use(3);
    source.use(4);
    source.use(5);

    expect(g).toHaveBeenLastCalledWith(2);

    lockSrc.use(false);
    source.use(6);
    expect(g).toHaveBeenLastCalledWith(6);
  });

  test("composition with empty", async () => {
    const $msg = Late("hello");
    const $lock = Late(false);
    const $lockedMsg = Default(Empty(Lock($msg, $lock)), "no value");
    expect(await $lockedMsg).toBe("hello");
    $lock.use(true);
    expect(await $lockedMsg).toBe("no value");
  });
});
