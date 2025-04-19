import { GuestType, SourceChangeable, SourceChangeableType } from "silentium";

/**
 * @deprecated move to web api
 */
export class CurrentPage implements SourceChangeableType<string> {
  private source: SourceChangeable<string>;

  public constructor() {
    const correctUrl = location.href.replace(location.origin, "");
    this.source = new SourceChangeable(correctUrl);
  }

  public give(value: string): this {
    this.source.give(value);
    return this;
  }

  public value(guest: GuestType<string>) {
    this.source.value(guest);
    return guest;
  }

  public pool() {
    return this.source.pool();
  }
}
