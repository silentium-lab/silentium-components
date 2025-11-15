import {
  DestroyableType,
  DestroyContainer,
  Message,
  MessageType,
  Transport,
  TransportType,
} from "silentium";

/**
 * Depending on the $condition message,
 * creates a new left or right message.
 * When condition changes, old messages are destroyed
 * and new ones are created.
 */
export function BranchLazy<Then, Else>(
  $condition: MessageType<boolean>,
  $left: TransportType<void, MessageType<Then>>,
  $right?: TransportType<void, MessageType<Else>>,
): MessageType<Then | Else> & DestroyableType {
  return Message((transport) => {
    const dc = DestroyContainer();
    const destructor = () => {
      dc.destroy();
    };
    $condition.to(
      Transport((v) => {
        destructor();
        let instance: MessageType<Then | Else> | undefined;
        if (v) {
          instance = $left.use();
        } else if ($right) {
          instance = $right.use();
        }
        if (instance !== undefined) {
          instance.to(transport);
          dc.add(instance);
        }
      }),
    );
    return destructor;
  });
}
