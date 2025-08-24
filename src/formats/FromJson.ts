import { From, InformationType, OwnerType, TheInformation } from "silentium";

/**
 * Represents object from json
 */
export class FromJson<T> extends TheInformation<T> {
  public constructor(
    private jsonSrc: InformationType<string>,
    private errorOwner?: OwnerType,
  ) {
    super(jsonSrc);
  }

  public value(o: OwnerType<T>): this {
    this.jsonSrc.value(
      new From((json) => {
        try {
          o.give(JSON.parse(json));
        } catch (error) {
          this.errorOwner?.give(new Error(`Failed to parse JSON: ${error}`));
        }
      }),
    );
    return this;
  }
}
