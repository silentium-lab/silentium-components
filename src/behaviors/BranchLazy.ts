import { EventType, DestructorType, ConstructorType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
export const branchLazy = <Then, Else>(
  conditionSrc: EventType<boolean>,
  leftSrc: ConstructorType<[], EventType<Then>>,
  rightSrc?: ConstructorType<[], EventType<Else>>,
): EventType<Then | Else> => {
  return (u) => {
    let destructor: DestructorType | void;
    conditionSrc((v) => {
      if (destructor !== undefined && typeof destructor === "function") {
        destructor();
      }
      let instance: EventType<Then | Else> | null = null;
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
