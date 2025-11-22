import { ActualMessage, MaybeMessage, Message, Primitive } from "silentium";

/**
 * Allows switching between left and right messages depending on condition
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
export function Branch<Then, Else>(
  _condition: MaybeMessage<boolean>,
  _left: MaybeMessage<Then>,
  _right?: MaybeMessage<Else>,
) {
  const $condition = ActualMessage(_condition);
  const $left = ActualMessage(_left);
  const $right = _right && ActualMessage(_right);
  return Message<Then | Else>(function BranchImpl(r) {
    const left = Primitive($left);
    let right: ReturnType<typeof Primitive<Else>>;
    if ($right !== undefined) {
      right = Primitive($right);
    }
    $condition.then((v) => {
      let result: Then | Else | null = null;
      if (v) {
        result = left.primitive();
      } else if (right) {
        result = right.primitive();
      }
      if (result !== null) {
        r(result);
      }
    });
  });
}
