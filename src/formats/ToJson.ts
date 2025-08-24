import { From, InformationType, OwnerType, TheInformation } from "silentium";

/**
 * Represents json from object
 */
export class ToJson extends TheInformation<string> {
  public constructor(
    private dataSrc: InformationType,
    private errorOwner?: OwnerType,
  ) {
    super(dataSrc);
  }

  public value(o: OwnerType<string>): this {
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
