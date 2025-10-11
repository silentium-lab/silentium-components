import {
  all,
  applied,
  EventType,
  destructor,
  DestructorType,
  of,
} from "silentium";
import { recordOf } from "../structures";

export const template = (
  theSrc: EventType<string> = of(""),
  placesSrc: EventType<Record<string, unknown>> = of({}),
) => {
  let placesCounter = 0;
  const vars: Record<string, EventType> = {
    $TPL: of("$TPL"),
  };
  const destructors: DestructorType[] = [];
  return {
    value: <EventType<string>>((u) => {
      const varsSrc = recordOf(vars);
      applied(all(theSrc, placesSrc, varsSrc), ([base, rules, vars]) => {
        Object.entries(rules).forEach(([ph, val]) => {
          base = base.replaceAll(ph, String(val));
        });
        Object.entries(vars).forEach(([ph, val]) => {
          base = base.replaceAll(ph, String(val));
        });

        return base;
      })(u);
    }),
    template: (value: string) => {
      theSrc = of(value);
    },
    /**
     * Ability to register variable
     * in concrete place of template
     */
    var: (src: EventType<string>) => {
      const varName = `$var${placesCounter}`;
      placesCounter += 1;
      vars[varName] = destructor(src, (d: DestructorType) => {
        destructors.push(d);
      }).value;
      return varName;
    },
    destroy() {
      destructors.forEach((d) => d());
    },
  };
};
