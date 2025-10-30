import { Event, EventType, Primitive, Transport } from "silentium";

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
export function Branch<Then, Else>(
  $condition: EventType<boolean>,
  $left: EventType<Then>,
  $right?: EventType<Else>,
): EventType<Then | Else> {
  return Event((transport) => {
    const left = Primitive($left);
    let right: ReturnType<typeof Primitive<Else>>;
    if ($right !== undefined) {
      right = Primitive($right);
    }
    $condition.event(
      Transport((v) => {
        let result: Then | Else | null = null;
        if (v) {
          result = left.primitive();
        } else if (right) {
          result = right.primitive();
        }
        if (result !== null) {
          transport.use(result);
        }
      }),
    );
  });
}
