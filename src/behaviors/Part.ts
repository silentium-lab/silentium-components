import {
  All,
  From,
  InformationType,
  MaybeInformationType,
  MbInfo,
  OwnerType,
  SourceType,
  TheInformation,
} from "silentium";
import { Sync } from "../behaviors/Sync";

/**
 * Return source of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
export class Part<
    R,
    T extends Record<string, unknown> | Array<unknown> = any,
    K extends string = any,
  >
  extends TheInformation<R>
  implements OwnerType<R>
{
  private baseSync: Sync<T>;
  private keySync: Sync<string>;
  private keySrc: InformationType<string>;

  public constructor(
    private baseSrc: SourceType<T>,
    private key: MaybeInformationType<K>,
  ) {
    super(baseSrc);
    this.keySrc = new MbInfo(key);
    this.baseSync = new Sync(baseSrc);
    this.keySync = new Sync(this.keySrc);
  }

  public value(o: OwnerType<R>): this {
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

  public give(value: R): this {
    this.baseSrc.give({
      ...this.baseSync.valueSync(),
      [this.keySync.valueSync()]: value,
    });
    return this;
  }
}
