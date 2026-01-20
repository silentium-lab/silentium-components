import {
  Actual,
  MaybeMessage,
  Message,
  MessageType,
  Primitive,
} from "silentium";

/**
 * Allows switching between left and right messages depending on condition
 * https://silentium.pw/article/branch/view
 */
export function Branch<Then, Else>(
  _condition: MaybeMessage<boolean>,
  _left: MaybeMessage<Then>,
  _right?: MaybeMessage<Else>,
) {
  const $condition = Actual(_condition);
  const $left = Actual(_left);
  const $right = Actual(_right);
  return Message<Then | Else>(function BranchImpl(r) {
    const left = Primitive($left);
    let right: ReturnType<typeof Primitive<Else>>;
    if (_right !== undefined) {
      right = Primitive($right as MessageType<Else>);
    }
    $condition.then((v) => {
      if (typeof v !== "boolean") {
        throw new Error("Branch received not boolean value");
      }
      let result: Then | Else | null = null;
      if (v === true) {
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
