import { EventType } from "silentium";

export const constant = <T>(
  permanentValue: T,
  triggerSrc: EventType,
): EventType<T> => {
  return (u) => {
    triggerSrc(() => {
      u(permanentValue);
    });
  };
};
