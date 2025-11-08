import {
  All,
  DestroyableType,
  Event,
  EventType,
  isDestroyable,
  Of,
  Transport,
  TransportType,
} from "silentium";
import { RegexpMatched } from "../system";

export interface Route<T> {
  pattern: string;
  patternFlags?: string;
  event: TransportType<void, EventType<T>>;
}

/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
export function Router<T = "string">(
  $url: EventType<string>,
  $routes: EventType<Route<T>[]>,
  $default: TransportType<void, EventType<T>>,
): EventType<T> & DestroyableType {
  return Event<T>((transport) => {
    const destroyableList: DestroyableType[] = [];
    const checkDestroyable = (instance: unknown) => {
      if (isDestroyable(instance)) {
        destroyableList.push(instance);
      }
    };
    const destructor = () => {
      destroyableList.forEach((d) => d.destroy());
      destroyableList.length = 0;
    };
    All($routes, $url).event(
      Transport(([routes, url]) => {
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
        $matches.event(
          Transport((matches) => {
            const index = matches.findIndex((v) => v === true);

            if (index === -1) {
              const instance = $default.use();
              checkDestroyable(instance);
              instance.event(transport);
            }

            if (index > -1) {
              const instance = routes[index].event.use();
              checkDestroyable(instance);
              instance.event(transport);
            }
          }),
        );
      }),
    );

    return destructor;
  });
}
