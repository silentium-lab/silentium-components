import {
  ConstructorType,
  DestroyableType,
  Event,
  EventType,
  Transport,
} from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
export function BranchLazy<Then, Else>(
  $condition: EventType<boolean>,
  $left: ConstructorType<[], EventType<Then>>,
  $right?: ConstructorType<[], EventType<Else>>,
): EventType<Then | Else> {
  return Event((transport) => {
    let destructor: () => void | void;
    $condition.event(
      Transport((v) => {
        if (destructor !== undefined && typeof destructor === "function") {
          destructor();
        }
        let instance: EventType<Then | Else> | null = null;
        if (v) {
          instance = $left();
        } else if ($right) {
          instance = $right();
        }
        if (instance) {
          instance.event(transport);
          destructor = (instance as unknown as DestroyableType).destroy;
        }
      }),
    );
    return () => {
      destructor?.();
    };
  });
}
