import {
  Actual,
  All,
  ConstructorType,
  DestroyableType,
  DestroyContainer,
  MaybeMessage,
  Message,
  MessageType,
  Of,
} from "silentium";

import { RegexpMatched } from "../system";

export interface Route<T> {
  pattern?: string;
  patternFlags?: string;
  condition?: (v: unknown) => boolean;
  message: ConstructorType<[], MaybeMessage<T>>;
}

/**
 * Router component what will return template if url matches pattern
 *
 * @url https://silentium.pw/article/router/view
 */
export function Router<T = string>(
  _url: MaybeMessage<string>,
  routes: MaybeMessage<Route<T>[]>,
  $default: ConstructorType<[], MaybeMessage<T>>,
): MessageType<T> & DestroyableType {
  const $routes = Actual(routes);
  const $url = Actual(_url);
  return Message<T>(function RouterImpl(r) {
    const dc = DestroyContainer();
    const destructor = () => {
      dc.destroy();
    };
    All($routes, $url).then(([routes, url]) => {
      destructor();
      const $matches = All(
        ...routes.map((r) =>
          r.pattern
            ? RegexpMatched(
                Of(r.pattern),
                Of(url),
                r.patternFlags ? Of(r.patternFlags) : undefined,
              )
            : r?.condition?.(url),
        ),
      );
      $matches.then((matches) => {
        const index = matches.findIndex((v) => v === true);

        if (index === -1) {
          const instance = Actual($default());
          dc.add(instance);
          instance.then(r);
        }

        if (index > -1) {
          const instance = Actual(routes[index].message());
          dc.add(instance);
          instance.then(r);
        }
      });
    });
    return destructor;
  });
}
