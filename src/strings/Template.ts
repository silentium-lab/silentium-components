import {
  All,
  Applied,
  EventType,
  Destructor,
  DestructorType,
  Of,
} from "silentium";
import { RecordOf } from "../structures";

export function Template(
  theSrc: EventType<string> = Of(""),
  placesSrc: EventType<Record<string, unknown>> = Of({}),
) {
  let placesCounter = 0;
  const vars: Record<string, EventType> = {
    $TPL: Of("$TPL"),
  };
  const destructors: DestructorType[] = [];
  return {
    value: <EventType<string>>((user) => {
      const varsSrc = RecordOf(vars);
      Applied(All(theSrc, placesSrc, varsSrc), ([base, rules, vars]) => {
        Object.entries(rules).forEach(([ph, val]) => {
          base = base.replaceAll(ph, String(val));
        });
        Object.entries(vars).forEach(([ph, val]) => {
          base = base.replaceAll(ph, String(val));
        });

        return base;
      })(user);
    }),
    template: (value: string) => {
      theSrc = Of(value);
    },
    /**
     * Ability to register variable
     * in concrete place Of template
     */
    var: (src: EventType<string>) => {
      const varName = `$var${placesCounter}`;
      placesCounter += 1;
      vars[varName] = Destructor(src, (d: DestructorType) => {
        destructors.push(d);
      }).event;
      return varName;
    },
    destroy() {
      destructors.forEach((d) => d());
    },
  };
}
