import {
  DestroyableType,
  Event,
  EventType,
  isDestroyable,
  Transport,
  TransportType,
} from "silentium";

export function BranchLazy<Then, Else>(
  $condition: EventType<boolean>,
  $left: TransportType<void, EventType<Then>>,
  $right?: TransportType<void, EventType<Else>>,
): EventType<Then | Else> & DestroyableType {
  return Event((transport) => {
    let destroyable: DestroyableType | undefined;
    const destructor = () => {
      if (destroyable !== undefined) {
        destroyable.destroy();
        destroyable = undefined;
      }
    };
    $condition.event(
      Transport((v) => {
        destructor();
        let instance: EventType<Then | Else> | undefined;
        if (v) {
          instance = $left.use();
        } else if ($right) {
          instance = $right.use();
        }
        if (instance !== undefined) {
          instance.event(transport);
          if (isDestroyable(instance)) {
            destroyable = instance;
          }
        }
      }),
    );
    return destructor;
  });
}
