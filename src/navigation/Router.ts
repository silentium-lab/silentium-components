import {
  All,
  Applied,
  DestroyableType,
  Event,
  EventType,
  Of,
  Transport,
  TransportDestroyable,
  TransportEvent,
  TransportType,
} from "silentium";
import { BranchLazy } from "../behaviors";
import { RegexpMatched } from "../system";

export interface Route<T> {
  pattern: string;
  patternFlags?: string;
  event: TransportType<[], EventType<T>>;
}

const $empty = TransportEvent(() => Of(false));

/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
export function Router<T = "string">(
  $url: EventType<string>,
  $routes: EventType<Route<T>[]>,
  $default: TransportType<void, EventType<T>>,
) {
  return Event<T>((transport) => {
    const destructors: DestroyableType[] = [];
    const destructor = () => {
      destructors.forEach((d) => d.destroy());
      destructors.length = 0;
    };
    All($routes, $url).event(
      Transport(([routes, url]) => {
        destructor();
        const instance = All(
          $default.use(),
          All(
            ...routes.map((r) => {
              const $template = TransportDestroyable(r.event);
              destructors.push($template);
              return BranchLazy(
                RegexpMatched(
                  Of(r.pattern),
                  Of(url),
                  r.patternFlags ? Of(r.patternFlags) : undefined,
                ),
                $template,
                $empty,
              );
            }),
          ),
        );

        // Return first not false or default
        Applied(instance, (r) => {
          const first = r[1].find((r: unknown) => r !== false);
          if (first) {
            return first as T;
          }
          return r[0];
        }).event(transport);
      }),
    );

    return destructor;
  });
}
