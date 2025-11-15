import { Message, MessageType, Primitive, Transport } from "silentium";

/**
 * Allows switching between left and right messages depending on condition
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
export function Branch<Then, Else>(
  $condition: MessageType<boolean>,
  $left: MessageType<Then>,
  $right?: MessageType<Else>,
) {
  return Message<Then | Else>((transport) => {
    const left = Primitive($left);
    let right: ReturnType<typeof Primitive<Else>>;
    if ($right !== undefined) {
      right = Primitive($right);
    }
    $condition.to(
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
