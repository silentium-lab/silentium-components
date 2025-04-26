import { sourceOf, sourceSync, value } from "silentium";
import { jsdomDocument } from "silentium-jsdom";
import { element } from "silentium-web-api";
import { expect, test } from "vitest";
import { path } from "../behaviors";
import { groupActiveClass } from "./GroupActiveClass";

test("GroupActiveClass.test", () => {
  const document = sourceSync(
    jsdomDocument(`<div class="menu">
    <div id="prev-active" class="menu-link active">One</div>
    <div class="menu-link">Two</div>
    <div id="next-active" class="menu-link">Three</div>
  </div>`),
  ).syncValue();
  const groupElements = path(<any>element(".menu", document), "childNodes");
  const activeElement = sourceOf<HTMLElement>();
  sourceSync(groupActiveClass("active", activeElement, groupElements));

  value(element("#next-active", document), activeElement);

  expect(document.body.outerHTML).toContain(
    'id="next-active" class="menu-link active"',
  );

  expect(document.body.innerHTML).toContain(
    'id="prev-active" class="menu-link"',
  );
});
