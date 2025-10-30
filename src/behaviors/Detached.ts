import { Event, EventType, isFilled, Primitive } from "silentium";

export function Detached<T>($base: EventType<T>): EventType<T> {
  return Event((transport) => {
    const v = Primitive($base).primitive();
    if (isFilled(v)) {
      transport.use(v);
    }
  });
}
