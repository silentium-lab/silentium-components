import {
  ConstructorType,
  DestroyableType,
  Event,
  EventType,
  LateShared,
  Of,
  Transport,
} from "silentium";
import { Detached } from "../behaviors/Detached";

/**
 * Do something on event value.
 * Each event value will create new eventBuilder instance
 */
export function Transaction<T, R = unknown>(
  $base: EventType<T>,
  eventBuilder: ConstructorType<
    [EventType<T>, ...EventType<any>[]],
    EventType<R>
  >,
  ...args: EventType[]
): EventType<R> {
  return Event((user) => {
    const $res = LateShared<R>();
    const destructors: DestroyableType[] = [];

    $base.event(
      Transport((v) => {
        const $event = eventBuilder(Of(v), ...args.map((a) => Detached(a)));
        destructors.push($event as unknown as DestroyableType);
        $event.event($res);
      }),
    );
    $res.event(user);

    return () => {
      destructors.forEach((d) => d?.destroy());
      destructors.length = 0;
    };
  });
}
