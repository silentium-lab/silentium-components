import {
  ConstructorType,
  DestroyableType,
  LateShared,
  Message,
  MessageType,
  Of,
  Tap,
} from "silentium";
import { Detached } from "../behaviors/Detached";

/**
 * Do something on message value.
 * Each message value will create new builder instance
 */
export function Transaction<T, R = unknown>(
  $base: MessageType<T>,
  builder: ConstructorType<
    [MessageType<T>, ...MessageType<any>[]],
    MessageType<R>
  >,
  ...args: MessageType[]
) {
  return Message<R>(function () {
    const $res = LateShared<R>();
    const destructors: DestroyableType[] = [];

    $base.pipe(
      Tap((v) => {
        const $msg = builder(Of(v), ...args.map((a) => Detached(a)));
        destructors.push($msg as unknown as DestroyableType);
        $msg.pipe($res);
      }),
    );
    $res.pipe(this);

    return () => {
      destructors.forEach((d) => d?.destroy());
      destructors.length = 0;
    };
  });
}
