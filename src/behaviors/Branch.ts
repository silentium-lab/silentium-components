import {
  ComponentClass,
  EventType,
  Primitive,
  Transport,
  TransportType,
} from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
export const Branch = ComponentClass(
  class<Then, Else> implements EventType<Then | Else> {
    public constructor(
      private conditionSrc: EventType<boolean>,
      private leftSrc: EventType<Then>,
      private rightSrc?: EventType<Else>,
    ) {}

    public event(transport: TransportType<Then | Else, null>): this {
      const leftSync = Primitive(this.leftSrc);
      let rightSync: ReturnType<typeof Primitive<Else>>;

      if (this.rightSrc !== undefined) {
        rightSync = Primitive(this.rightSrc);
      }

      this.conditionSrc.event(
        Transport((v) => {
          let result: Then | Else | null = null;
          if (v) {
            result = leftSync.primitive();
          } else if (rightSync) {
            result = rightSync.primitive();
          }

          if (result !== null) {
            transport.use(result);
          }
        }),
      );

      return this;
    }
  },
);
