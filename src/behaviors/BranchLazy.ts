import { EventType, DestructorType, ConstructorType } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
export function BranchLazy<Then, Else>(
  conditionSrc: EventType<boolean>,
  leftSrc: ConstructorType<[], EventType<Then>>,
  rightSrc?: ConstructorType<[], EventType<Else>>,
): EventType<Then | Else> {
  return (user) => {
    let Destructor: DestructorType | void;
    conditionSrc((v) => {
      if (Destructor !== undefined && typeof Destructor === "function") {
        Destructor();
      }
      let instance: EventType<Then | Else> | null = null;
      if (v) {
        instance = leftSrc();
      } else if (rightSrc) {
        instance = rightSrc();
      }
      if (instance) {
        Destructor = instance(user);
      }
    });

    return () => {
      Destructor?.();
    };
  };
}
