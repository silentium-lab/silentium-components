import { patron, sourceAll, SourceType, value } from "silentium";

/**
 * Sets activeClass to one element of group
 * and resets activeClass on other group elements
 * suitable for menu active class
 */
export const groupActiveClass = (
  activeClassSrc: SourceType<string>,
  activeElementSrc: SourceType<HTMLElement>,
  groupElementsSrc: SourceType<HTMLElement[]>,
) => {
  value(
    sourceAll([activeClassSrc, activeElementSrc, groupElementsSrc]),
    patron(([activeClass, activeElement, groupElements]) => {
      groupElements.forEach((el) => {
        if (el.classList) {
          el.classList.remove(activeClass);
        }
      });
      activeElement.classList.add(activeClass);
    }),
  );

  return groupElementsSrc;
};
