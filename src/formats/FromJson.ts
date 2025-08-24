import { From, TheInformation, TheOwner } from "silentium";

/**
 * Represents object from json
 */
export class FromJson<T> extends TheInformation<T> {
  public constructor(
    private jsonSrc: TheInformation<string>,
    private errorOwner?: TheOwner,
  ) {
    super(jsonSrc);
  }

  public value(o: TheOwner<T>): this {
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
