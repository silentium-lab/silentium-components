import {
  Destroyable,
  From,
  InformationType,
  Lazy,
  OwnerType,
  TheInformation,
} from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
export class BranchLazy<Then, Else> extends TheInformation<Then | Else> {
  private instances: Destroyable[] = [];

  public constructor(
    private conditionSrc: InformationType<boolean>,
    private leftSrc: Lazy<Then>,
    private rightSrc?: Lazy<Else>,
  ) {
    super([conditionSrc, leftSrc, rightSrc]);
  }

  public value(o: OwnerType<Then | Else>): this {
    this.conditionSrc.value(
      new From((v) => {
        if (this.instances.length) {
          this.instances.forEach((instance) => {
            instance?.destroy();
          });
        }
        let instance: InformationType | null = null;
        if (v) {
          instance = this.leftSrc.get();
        } else if (this.rightSrc) {
          instance = this.rightSrc.get();
        }
        if (instance) {
          this.instances.push(instance as unknown as Destroyable);
          instance.value(o);
        }
      }),
    );

    return this;
  }
}
