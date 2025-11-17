import {
  All,
  DestroyableType,
  DestroyContainer,
  Message,
  MessageType,
  Of,
  Tap,
  TapType,
} from "silentium";
import { RegexpMatched } from "../system";

export interface Route<T> {
  pattern: string;
  patternFlags?: string;
  message: TapType<void, MessageType<T>>;
}

/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
export function Router<T = "string">(
  $url: MessageType<string>,
  $routes: MessageType<Route<T>[]>,
  $default: TapType<void, MessageType<T>>,
): MessageType<T> & DestroyableType {
  return Message<T>(function () {
    const dc = DestroyContainer();
    const destructor = () => {
      dc.destroy();
    };
    All($routes, $url).pipe(
      Tap(([routes, url]) => {
        destructor();
        const $matches = All(
          ...routes.map((r) =>
            RegexpMatched(
              Of(r.pattern),
              Of(url),
              r.patternFlags ? Of(r.patternFlags) : undefined,
            ),
          ),
        );
        $matches.pipe(
          Tap((matches) => {
            const index = matches.findIndex((v) => v === true);

            if (index === -1) {
              const instance = $default.use();
              dc.add(instance);
              instance.pipe(this);
            }

            if (index > -1) {
              const instance = routes[index].message.use();
              dc.add(instance);
              instance.pipe(this);
            }
          }),
        );
      }),
    );

    return destructor;
  });
}
