import {
  give,
  guestCast,
  GuestType,
  sourceAll,
  SourceType,
  value,
} from "silentium";

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
  return (g: GuestType<HTMLElement>) => {
    value(
      sourceAll([activeClassSrc, activeElementSrc, groupElementsSrc]),
      guestCast(g, ([activeClass, activeElement, groupElements]) => {
        groupElements.forEach((el) => {
          if (el.classList) {
            el.classList.remove(activeClass);
          }
        });
        activeElement.classList.add(activeClass);
        give(activeElement, g);
      }),
    );
  };
};
