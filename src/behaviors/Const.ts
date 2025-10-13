import { EventType } from "silentium";

export function Constant<T>(
  permanentValue: T,
  triggerSrc: EventType,
): EventType<T> {
  return (user) => {
    triggerSrc(() => {
      user(permanentValue);
    });
  };
}
