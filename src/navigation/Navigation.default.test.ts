import { give, GuestType, PrivateClass, SourceWithPool } from "silentium";
import { expect, test } from "vitest";
import { PageFake } from "../page/PageFake";
import { Navigation } from "./Navigation";
import { RoutePageTransportType } from "./PageFetchTransport";

class FakeTransport implements RoutePageTransportType {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    basePath = null,
    private template = "null",
  ) {}
  content(guest: GuestType<string>): void {
    give(this.template, guest);
  }
}

test("navigation", () => {
  const pageLoading = new SourceWithPool(false);
  const basePath = new SourceWithPool("/some/path/#");
  const currentPage = new SourceWithPool("/some/path/unknown-page");
  const display = {
    display(content: string) {
      expect(content).toBe("default.html");
    },
  };

  const navigation = new Navigation(
    pageLoading,
    basePath,
    currentPage,
    display,
    new PrivateClass(FakeTransport),
  );

  navigation.routes([
    {
      url: "/",
      template: "main.html",
      aliases: ["/some/path/"],
      page: new PageFake(),
    },
    {
      url: "",
      template: "default.html",
      aliases: ["/some/path/"],
      page: new PageFake(),
      default: true,
    },
  ]);

  expect(true).toBe(true);
});
