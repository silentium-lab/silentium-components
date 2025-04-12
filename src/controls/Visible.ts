import { GuestObjectType } from "patron-oop";

/**
 * @deprecated move to web api
 */
export class Visible implements GuestObjectType<boolean> {
  public constructor(private selector: string) {}

  public give(isVisible: boolean): this {
    const el = document.querySelector(this.selector) as HTMLElement;
    if (el) {
      el.style.display = isVisible ? "block" : "none";
    }
    return this;
  }
}
