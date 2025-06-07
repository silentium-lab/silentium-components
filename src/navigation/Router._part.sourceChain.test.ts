import {
  patron,
  sourceChain,
  sourceFiltered,
  sourceOf,
  sourceSync,
  value,
} from "silentium";
import { priority } from "../behaviors/Priority";
import { expect, test, vi } from "vitest";
import { regexpMatched } from "../system";

test("Router._part.sourceChain.test", () => {
  const urlSrc = sourceOf<string>("http://domain.com/some/url/");

  const routeConditionSrc = sourceSync(
    sourceFiltered(regexpMatched("/some/contacts", urlSrc), Boolean),
  );
  const routeDefault = sourceChain(urlSrc, "page/404.html");

  const routeChainSrc = sourceSync(
    priority(
      [routeDefault, sourceChain(routeConditionSrc, "page/contacts.html")],
      urlSrc,
    ),
  );

  const g = vi.fn();
  value(routeChainSrc, g);
  expect(g).toHaveBeenCalledWith("page/404.html");

  const g2 = vi.fn();
  value(routeConditionSrc, g2);
  expect(g2).not.toHaveBeenCalled();

  const responses: string[] = [];
  routeChainSrc.value(
    patron((v) => {
      responses.push(v);
    }),
  );

  urlSrc.give("http://domain.com/some/contacts/");

  expect(responses).toStrictEqual([
    "page/404.html",
    "page/contacts.html",
    "page/404.html",
    "page/contacts.html",
  ]);
  expect(routeConditionSrc.syncValue()).toBe(true);
  expect(routeChainSrc.syncValue()).toBe("page/contacts.html");
});
