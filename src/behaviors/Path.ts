import { All, From, TheInformation, TheOwner } from "silentium";

/**
 * Return source of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export class Path<
  R,
  T extends Record<string, unknown> | Array<unknown> = any,
  K extends string = any,
> extends TheInformation<R> {
  public constructor(
    private baseSrc: TheInformation<T>,
    private keySrc: TheInformation<K>,
  ) {
    super(baseSrc, keySrc);
  }

  public value(o: TheOwner<R>): this {
    const allSrc = new All(this.baseSrc, this.keySrc).value(
      new From(([base, key]) => {
        const keyChunks = key.split(".");
        let value: unknown = base;
        keyChunks.forEach((keyChunk) => {
          value = (value as Record<string, unknown>)[keyChunk];
        });

        if (value !== undefined && value !== base) {
          o.give(value as R);
        }
      }),
    );
    this.addDep(allSrc);
    return this;
  }
}
