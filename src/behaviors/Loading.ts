import { From, TheInformation, TheOwner } from "silentium";

/**
 * Representation of loading process
 * first informatin source begins loading
 * second information source stops loading
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
export class Loading extends TheInformation<boolean> {
  public constructor(
    private loadingStartSrc: TheInformation<unknown>,
    private loadingFinishSrc: TheInformation<unknown>,
  ) {
    super(loadingFinishSrc, loadingStartSrc);
  }

  public value(o: TheOwner<boolean>): this {
    this.loadingStartSrc.value(
      new From(() => {
        o.give(true);
      }),
    );

    this.loadingFinishSrc.value(
      new From(() => {
        o.give(false);
      }),
    );

    return this;
  }
}
