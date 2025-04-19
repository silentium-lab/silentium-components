import {
  GuestType,
  Patron,
  SourceChangeable,
  SourceChangeableType,
} from "silentium";

type InputValue = number | string;

/**
 * @deprecated move to web api
 */
export class Input implements SourceChangeableType<InputValue> {
  public constructor(
    private source: SourceChangeable<InputValue>,
    selector: string,
  ) {
    const el = document.querySelector(selector) as HTMLInputElement;
    this.source.value(
      new Patron((value) => {
        el.value = String(value);
      }),
    );
    el.addEventListener("keyup", () => {
      this.give(el.value);
    });
    el.addEventListener("change", () => {
      this.give(el.value);
    });
  }

  public value(guest: GuestType<InputValue>) {
    this.source.value(guest);
    return this;
  }

  public give(value: InputValue) {
    this.source.give(value);
    return this;
  }

  public pool() {
    return this.source.pool();
  }
}
