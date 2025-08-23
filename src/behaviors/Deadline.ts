import { Filtered, From, Shared, TheInformation, TheOwner } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export class Deadline<T> extends TheInformation<T> {
  public constructor(
    private error: TheOwner<Error>,
    private baseSrc: TheInformation<T>,
    private timeoutSrc: TheInformation<number>,
  ) {
    super([error, baseSrc, timeoutSrc]);
  }

  public value(o: TheOwner<T>) {
    let timerHead: unknown = null;

    const s = new Shared(this.baseSrc, true);
    this.addDep(s);

    this.timeoutSrc.value(
      new From((timeout) => {
        if (timerHead) {
          clearTimeout(timerHead as number);
        }
        let timeoutReached = false;

        timerHead = setTimeout(() => {
          if (timeoutReached) {
            return;
          }
          timeoutReached = true;
          this.error.give(new Error("Timeout reached in Deadline class"));
        }, timeout);

        const f = new Filtered(s, () => !timeoutReached);
        this.addDep(f);
        f.value(o);

        s.value(
          new From(() => {
            timeoutReached = true;
          }),
        );
      }),
    );

    return this;
  }
}
