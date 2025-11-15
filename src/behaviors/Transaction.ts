import {
  ConstructorType,
  DestroyableType,
  LateShared,
  Message,
  MessageType,
  Of,
  Transport,
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
  return Message<R>((transport) => {
    const $res = LateShared<R>();
    const destructors: DestroyableType[] = [];

    $base.to(
      Transport((v) => {
        const $msg = builder(Of(v), ...args.map((a) => Detached(a)));
        destructors.push($msg as unknown as DestroyableType);
        $msg.to($res);
      }),
    );
    $res.to(transport);

    return () => {
      destructors.forEach((d) => d?.destroy());
      destructors.length = 0;
    };
  });
}
