import { EventType } from "silentium";

export function Polling<T>(
  baseSrc: EventType<T>,
  triggerSrc: EventType<T>,
): EventType<T> {
  return (user) => {
    triggerSrc(() => {
      baseSrc(user);
    });
  };
}
