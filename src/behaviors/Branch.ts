import { DataType, primitive } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
export const branch = <Then, Else>(
  conditionSrc: DataType<boolean>,
  leftSrc: DataType<Then>,
  rightSrc?: DataType<Else>,
): DataType<Then | Else> => {
  return (u) => {
    const leftSync = primitive(leftSrc);
    let rightSync: ReturnType<typeof primitive<Else>>;

    if (rightSrc !== undefined) {
      rightSync = primitive(rightSrc);
    }

    conditionSrc((v) => {
      let result: Then | Else | null = null;
      if (v) {
        result = leftSync.primitive();
      } else if (rightSync) {
        result = rightSync.primitive();
      }

      if (result !== null) {
        u(result);
      }
    });
  };
};
