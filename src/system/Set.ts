import { ActualMessage, All, Message, MessageType } from "silentium";

/**
 * Ability to mutate some object, helpful when integrate to procedure systems
 * https://silentium-lab.github.io/silentium-components/#/system/set
 */
export function Set<T extends Record<string, unknown>>(
  baseSrc: MessageType<T>,
  keySrc: MessageType<string>,
  valueSrc: MessageType<unknown>,
) {
  const $base = ActualMessage(baseSrc);
  const $key = ActualMessage(keySrc);
  const $value = ActualMessage(valueSrc);
  return Message<T>(function SetImpl(r) {
    All($base, $key, $value).then(([base, key, value]) => {
      (base as Record<string, unknown>)[key] = value;
      r(base);
    });
  });
}
