import {
  give,
  guestCast,
  GuestType,
  patronOnce,
  sourceFiltered,
  SourceType,
  value,
} from "silentium";

export const deadline = <T>(
  error: GuestType<Error>,
  baseSrc: SourceType<T>,
  timeoutSrc: SourceType<number>,
) => {
  let timerHead: unknown = null;
  return (g: GuestType<T>) => {
    value(
      timeoutSrc,
      guestCast(g, (timeout) => {
        if (timerHead) {
          clearTimeout(timerHead as number);
        }

        let timeoutReached = false;

        timerHead = setTimeout(() => {
          if (timeoutReached) {
            return;
          }
          timeoutReached = true;
          give(new Error("Timeout reached in Deadline class"), error);
        }, timeout);

        value(
          sourceFiltered(baseSrc, () => !timeoutReached),
          g,
        );

        value(
          baseSrc,
          patronOnce(() => {
            timeoutReached = true;
          }),
        );
      }),
    );
  };
};
