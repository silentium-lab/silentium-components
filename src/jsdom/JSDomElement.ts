import {
  GuestType,
  Patron,
  SourceObjectType,
  SourceType,
  SourceChangeable,
  value,
} from "silentium";

export class JSDomElement implements SourceObjectType<HTMLElement> {
  private source = new SourceChangeable<HTMLElement>();

  public constructor(documentSource: SourceType<Document>, html: string) {
    value(
      documentSource,
      new Patron((document) => {
        const div = document.createElement("div");
        div.innerHTML = html;
        this.source.give(div.children[0] as HTMLElement);
      }),
    );
  }

  public value(guest: GuestType<HTMLElement>) {
    value(this.source, guest);
    return this;
  }
}
