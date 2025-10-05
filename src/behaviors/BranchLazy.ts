import { DataType, DestructorType, ValueType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
export const branchLazy = <Then, Else>(
  conditionSrc: DataType<boolean>,
  leftSrc: ValueType<[], DataType<Then>>,
  rightSrc?: ValueType<[], DataType<Else>>,
): DataType<Then | Else> => {
  return (u) => {
    let destructor: DestructorType | void;
    conditionSrc((v) => {
      if (destructor !== undefined && typeof destructor === "function") {
        destructor();
      }
      let instance: DataType<Then | Else> | null = null;
      if (v) {
        instance = leftSrc();
      } else if (rightSrc) {
        instance = rightSrc();
      }
      if (instance) {
        destructor = instance(u);
      }
    });

    return () => {
      destructor?.();
    };
  };
};
