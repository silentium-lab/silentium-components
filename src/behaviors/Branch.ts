import { EventType, Primitive } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
export function Branch<Then, Else>(
  conditionSrc: EventType<boolean>,
  leftSrc: EventType<Then>,
  rightSrc?: EventType<Else>,
): EventType<Then | Else> {
  return (user) => {
    const leftSync = Primitive(leftSrc);
    let rightSync: ReturnType<typeof Primitive<Else>>;

    if (rightSrc !== undefined) {
      rightSync = Primitive(rightSrc);
    }

    conditionSrc((v) => {
      let result: Then | Else | null = null;
      if (v) {
        result = leftSync.primitive();
      } else if (rightSync) {
        result = rightSync.primitive();
      }

      if (result !== null) {
        user(result);
      }
    });
  };
}
