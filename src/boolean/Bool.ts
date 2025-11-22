import { Applied, Message, MessageType } from "silentium";

/**
 * Convert Any source to boolean source
 * https://silentium-lab.github.io/silentium-components/#/boolean/bool
 */
export function Bool($base: MessageType) {
  return Message<boolean>(function BoolImpl(r) {
    Applied($base, Boolean).then(r);
  });
}
