import {
  DestroyableType,
  DestroyContainer,
  Message,
  MessageType,
  Tap,
  TapType,
} from "silentium";

/**
 * Depending on the $condition message,
 * creates a new left or right message.
 * When condition changes, old messages are destroyed
 * and new ones are created.
 */
export function BranchLazy<Then, Else>(
  $condition: MessageType<boolean>,
  $left: TapType<void, MessageType<Then>>,
  $right?: TapType<void, MessageType<Else>>,
): MessageType<Then | Else> & DestroyableType {
  return Message(function () {
    const dc = DestroyContainer();
    const destructor = () => {
      dc.destroy();
    };
    $condition.pipe(
      Tap((v) => {
        destructor();
        let instance: MessageType<Then | Else> | undefined;
        if (v) {
          instance = $left.use();
        } else if ($right) {
          instance = $right.use();
        }
        if (instance !== undefined) {
          instance.pipe(this);
          dc.add(instance);
        }
      }),
    );
    return destructor;
  });
}
