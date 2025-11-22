import {
  ConstructorType,
  DestroyableType,
  DestroyContainer,
  Message,
  MessageType,
} from "silentium";

/**
 * Depending on the $condition message,
 * creates a new left or right message.
 * When condition changes, old messages are destroyed
 * and new ones are created.
 */
export function BranchLazy<Then, Else>(
  $condition: MessageType<boolean>,
  $left: ConstructorType<[], MessageType<Then>>,
  $right?: ConstructorType<[], MessageType<Else>>,
): MessageType<Then | Else> & DestroyableType {
  return Message(function BranchLazyImpl(r) {
    const dc = DestroyContainer();
    const destructor = () => {
      dc.destroy();
    };
    $condition.then((v) => {
      destructor();
      let instance: MessageType<Then | Else> | undefined;
      if (v) {
        instance = $left();
      } else if ($right) {
        instance = $right();
      }
      if (instance !== undefined) {
        instance.then(r);
        dc.add(instance);
      }
    });
    return destructor;
  });
}
