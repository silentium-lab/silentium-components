import {
  All,
  ConstructorType,
  DestroyableType,
  DestroyContainer,
  Message,
  MessageType,
  Of,
} from "silentium";

import { RegexpMatched } from "../system";

export interface Route<T> {
  pattern: string;
  patternFlags?: string;
  message: ConstructorType<[], MessageType<T>>;
}

/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
export function Router<T = string>(
  $url: MessageType<string>,
  $routes: MessageType<Route<T>[]>,
  $default: ConstructorType<[], MessageType<T>>,
): MessageType<T> & DestroyableType {
  return Message<T>(function RouterImpl(r) {
    const dc = DestroyContainer();
    const destructor = () => {
      dc.destroy();
    };
    All($routes, $url).then(([routes, url]) => {
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
      $matches.then((matches) => {
        const index = matches.findIndex((v) => v === true);

        if (index === -1) {
          const instance = $default();
          dc.add(instance);
          instance.then(r);
        }

        if (index > -1) {
          const instance = routes[index].message();
          dc.add(instance);
          instance.then(r);
        }
      });
    });

    return destructor;
  });
}
