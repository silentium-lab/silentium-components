import { All, Message, MessageType, Tap } from "silentium";

/**
 * Ability to mutate some object, helpful when integrate to procedure systems
 * https://silentium-lab.github.io/silentium-components/#/system/set
 */
export function Set<T extends Record<string, unknown>>(
  baseSrc: MessageType<T>,
  keySrc: MessageType<string>,
  valueSrc: MessageType<unknown>,
) {
  return Message<T>(function () {
    All(baseSrc, keySrc, valueSrc).pipe(
      Tap(([base, key, value]) => {
        (base as Record<string, unknown>)[key] = value;
        this.use(base);
      }),
    );
  });
}
