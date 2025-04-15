import {
  GuestCast,
  GuestType,
  SourceObjectType,
  SourceType,
  SourceWithPool,
  value,
} from "silentium";

export class Loading implements SourceObjectType<boolean> {
  private loadingSource = new SourceWithPool<boolean>();

  public constructor(
    private loadingStartSource: SourceType<unknown>,
    private loadingFinishSource: SourceType<unknown>,
  ) {}

  public value(guest: GuestType<boolean>) {
    value(
      this.loadingStartSource,
      new GuestCast(guest, () => {
        this.loadingSource.give(true);
      }),
    );
    value(
      this.loadingFinishSource,
      new GuestCast(guest, () => {
        this.loadingSource.give(false);
      }),
    );
    this.loadingSource.value(guest);
    return this;
  }
}
