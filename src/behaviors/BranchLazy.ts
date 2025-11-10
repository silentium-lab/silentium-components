import {
  DestroyableType,
  DestroyContainer,
  Event,
  EventType,
  Transport,
  TransportType,
} from "silentium";

export function BranchLazy<Then, Else>(
  $condition: EventType<boolean>,
  $left: TransportType<void, EventType<Then>>,
  $right?: TransportType<void, EventType<Else>>,
): EventType<Then | Else> & DestroyableType {
  return Event((transport) => {
    const dc = DestroyContainer();
    const destructor = () => {
      dc.destroy();
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
          dc.add(instance);
        }
      }),
    );
    return destructor;
  });
}
