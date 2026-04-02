import {
  Actual,
  DestroyContainer,
  MaybeMessage,
  Message,
  MessageType,
} from "silentium";

/**
 * Switch between many messages by known value
 */
export function Switch<T, K>(
  _base: MaybeMessage,
  options: [K | K[], MessageType<T>][],
) {
  const $base = Actual(_base);
  return Message<T>(function SwitchImpl(resolve, reject) {
    const dc = DestroyContainer();
    dc.add(
      $base
        .then(function switchBaseSub(v) {
          const msg = options.find(function switchBaseFind(entry) {
            return Array.isArray(entry[0])
              ? entry[0].includes(v as K)
              : entry[0] === v;
          });
          if (msg) {
            dc.add(msg[1].then(resolve).catch(reject));
          }
        })
        .catch(reject),
    );
    return dc.destructor();
  });
}
