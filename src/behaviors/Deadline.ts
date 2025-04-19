import {
  give,
  GuestCast,
  GuestType,
  PatronOnce,
  SourceFiltered,
  SourceObjectType,
  SourceType,
  value,
} from "silentium";

export class Deadline<T> implements SourceObjectType<T> {
  public constructor(
    private baseSource: SourceType<T>,
    private errorSource: GuestType<Error>,
    private timeout: SourceType<number>,
  ) {}

  public value(guest: GuestType<T>) {
    value(
      this.timeout,
      new GuestCast(guest, (timeout) => {
        let timeoutReached = false;

        setTimeout(() => {
          if (timeoutReached) {
            return;
          }
          timeoutReached = true;
          give(
            new Error("Timeout reached in Deadline class"),
            this.errorSource,
          );
        }, timeout);

        new SourceFiltered(this.baseSource, () => !timeoutReached).value(guest);
        value(
          this.baseSource,
          new PatronOnce(() => {
            timeoutReached = true;
          }),
        );
      }),
    );
    return this;
  }
}
