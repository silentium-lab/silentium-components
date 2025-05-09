import { sourceOf, SourceType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/dirty
 */
export const fork = <T, Then, Else>(): SourceType<Then | Else> => {
  const result = sourceOf<Then | Else>();
  const reset = sourceOf();
};

export class Fork<T, Then, Else> implements GuestAware<Then | Else> {
  private result = new SourceEmpty<Then | Else>();
  private reset = new SourceEmpty();
  private resultResettable = new SourceResettable(this.result, this.reset);
  private thenPatron?: Guest<Then>;
  private elsePatron?: Guest<Else>;

  public constructor(
    conditionSrc: GuestAware<T>,
    predicate: (v: T) => boolean,
    thenSrc: GuestAware<Then>,
    elseSrc?: GuestAware<Else>,
  ) {
    conditionSrc.receiving(
      new Patron((v) => {
        this.reset.receive(1);
        if (this.thenPatron) {
          removePatronFromPools(this.thenPatron);
        }
        if (this.elsePatron) {
          removePatronFromPools(this.elsePatron);
        }
        if (predicate(v)) {
          this.thenPatron = new Patron(this.result);
          thenSrc.receiving(this.thenPatron);
        } else if (elseSrc) {
          this.elsePatron = new Patron(this.result);
          elseSrc.receiving(this.elsePatron);
        }
      }),
    );
  }

  public receiving(guest: Guest<Then | Else>) {
    this.resultResettable.receiving(guest);
    return this;
  }
}
