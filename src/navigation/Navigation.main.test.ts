import { give, GuestType, PrivateClass, SourceChangeable } from "silentium";
import { expect, test } from "vitest";
import { PageFake } from "../page/PageFake";
import { Navigation } from "./Navigation";
import { RoutePageTransportType } from "./PageFetchTransport";

class FakeTransport implements RoutePageTransportType {
  public constructor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    basePath = null,
    private template = "null",
  ) {}

  public content(guest: GuestType<string>): void {
    give(this.template, guest);
  }
}

test("navigation", () => {
  const pageLoading = new SourceChangeable(false);
  const basePath = new SourceChangeable("/some/path/#");
  const currentPage = new SourceChangeable("/some/path/");
  const display = {
    display(content: string) {
      expect(content).toBe("main.html");
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
  ]);

  expect(true).toBe(true);
});
