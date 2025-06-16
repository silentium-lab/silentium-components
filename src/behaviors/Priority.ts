import { give, GuestType, SourceType, value } from "silentium";

export const priority = <T>(sources: SourceType<T>[]) => {
  return (g: GuestType<T>) => {
    let highestPriorityIndex = 0;
    let highestPriorityResult;
    sources.forEach((source, index) => {
      value(source, (v) => {
        if (highestPriorityIndex <= index) {
          highestPriorityIndex = index;
          highestPriorityResult = v;
        }
      });
    });

    if (highestPriorityResult !== undefined) {
      give(highestPriorityResult, g);
    }
  };
};
