import { From, TheInformation, TheOwner } from "silentium";

/**
 * Represents json from object
 */
export class ToJson extends TheInformation<string> {
  public constructor(
    private dataSrc: TheInformation,
    private errorOwner?: TheOwner,
  ) {
    super(dataSrc);
  }

  public value(o: TheOwner<string>): this {
    this.dataSrc.value(
      new From((data: unknown) => {
        try {
          o.give(JSON.stringify(data));
        } catch {
          this.errorOwner?.give(new Error("Failed to convert to JSON"));
        }
      }),
    );
    return this;
  }
}
