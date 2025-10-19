import {
  ConstructorType,
  DestroyableType,
  Destructor,
  EventType,
  LateShared,
  Of,
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
) {
  const $res = LateShared<R>();
  const destructors: DestroyableType[] = [];

  $base((v) => {
    destructors.forEach((d) => d.destroy());
    destructors.length = 0;
    const $event = Destructor(
      eventBuilder(Of(v), ...args.map((a) => Detached(a))),
    );
    destructors.push($event);
    $event.event($res.use);
  });

  return $res.event;
}
