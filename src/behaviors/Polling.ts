import { EventType } from "silentium";

export const polling = <T>(
  baseSrc: EventType<T>,
  triggerSrc: EventType<T>,
): EventType<T> => {
  return (u) => {
    triggerSrc(() => {
      baseSrc(u);
    });
  };
};
