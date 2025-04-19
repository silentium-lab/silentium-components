import { give, SourceAll, value, Patron, SourceChangeable, GuestCast, PatronOnce, PrivateClass, Source, sourceOf, SourceFiltered } from 'silentium';
import { HistoryNewPage, HistoryPoppedPage } from 'silentium-web-api';

class PageFetchTransport {
  constructor(basePath, template) {
    this.basePath = basePath;
    this.template = template;
  }
  content(guest) {
    fetch(this.basePath + "/" + this.template).then((result) => {
      return result.text();
    }).then((result) => {
      give(result, guest);
    });
  }
}

class Navigation {
  constructor(loading, basePath, currentPage, display, pageTransport) {
    this.loading = loading;
    this.basePath = basePath;
    this.currentPage = currentPage;
    this.display = display;
    this.pageTransport = pageTransport;
  }
  routes(routes) {
    const defaultRoute = routes.find((route) => route.default);
    const all = new SourceAll();
    value(this.basePath, new Patron(all.guestKey("basePath")));
    value(this.currentPage, new Patron(all.guestKey("currentPage")));
    all.value(
      new Patron(({ basePath, currentPage }) => {
        const urlWithoutBasePath = currentPage.replace(basePath, "");
        const routeMatchedToAlias = routes.find(
          (route2) => route2.aliases && (route2.aliases.includes(currentPage) || route2.aliases.includes(urlWithoutBasePath))
        );
        if (routeMatchedToAlias) {
          const correctUrl = basePath + routeMatchedToAlias.url;
          if (correctUrl !== currentPage) {
            give(correctUrl, this.currentPage);
            return;
          }
        }
        let route = routes.find((route2) => {
          if (route2.url.indexOf("*") >= 0) {
            const regexp = new RegExp(
              route2.url.replaceAll("*", ".*").replaceAll("/", "/")
            );
            return regexp.test(urlWithoutBasePath);
          }
          return route2.url.replaceAll("*", "") === urlWithoutBasePath;
        });
        if (!route && defaultRoute) {
          route = defaultRoute;
        }
        if (route) {
          const basePathWithoutHash = basePath.replace("/#", "").replace("#", "").replace(/[^/]+\.html$/, "");
          give(true, this.loading);
          this.pageTransport.get(basePathWithoutHash, route.template).content((templateContent) => {
            this.display.display(templateContent);
            route.page.mounted();
            give(false, this.loading);
          });
        } else {
          throw new Error("No matching route in Navigation");
        }
      })
    );
  }
}

class RouteDisplay {
  constructor(selector) {
    this.selector = selector;
  }
  display(content) {
    const contentEl = document.querySelector(this.selector);
    if (contentEl) {
      contentEl.innerHTML = content;
    }
  }
}

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, key + "" , value);
class CurrentPage {
  constructor() {
    __publicField$3(this, "source");
    const correctUrl = location.href.replace(location.origin, "");
    this.source = new SourceChangeable(correctUrl);
  }
  give(value) {
    this.source.give(value);
    return this;
  }
  value(guest) {
    this.source.value(guest);
    return guest;
  }
  pool() {
    return this.source.pool();
  }
}

class Input {
  constructor(source, selector) {
    this.source = source;
    const el = document.querySelector(selector);
    this.source.value(
      new Patron((value) => {
        el.value = String(value);
      })
    );
    el.addEventListener("keyup", () => {
      this.give(el.value);
    });
    el.addEventListener("change", () => {
      this.give(el.value);
    });
  }
  value(guest) {
    this.source.value(guest);
    return this;
  }
  give(value) {
    this.source.give(value);
    return this;
  }
  pool() {
    return this.source.pool();
  }
}

class Visible {
  constructor(selector) {
    this.selector = selector;
  }
  give(isVisible) {
    const el = document.querySelector(this.selector);
    if (el) {
      el.style.display = isVisible ? "block" : "none";
    }
    return this;
  }
}

class Text {
  constructor(selector) {
    this.selector = selector;
  }
  give(value) {
    const element = document.querySelector(this.selector);
    if (element) {
      element.innerText = String(value);
    }
    return this;
  }
}

class Link {
  constructor(linkSource, basePath) {
    this.linkSource = linkSource;
    this.basePath = basePath;
  }
  watchClick(selector, subselector) {
    const wrapperEl = document.querySelectorAll(selector);
    if (wrapperEl.length) {
      wrapperEl.forEach((theElement) => {
        theElement.addEventListener("click", (e) => {
          if (subselector) {
            theElement.querySelectorAll(subselector).forEach((theSubElement) => {
              if (e?.target === theSubElement || e?.currentTarget === theSubElement) {
                this.handleClick({
                  preventDefault: e.preventDefault.bind(e),
                  target: theSubElement
                });
              }
            });
          } else {
            this.handleClick(e);
          }
        });
      });
    } else {
      throw new Error(`Link wrapper not found for selector ${selector}`);
    }
  }
  handleClick(e) {
    let href = e?.target?.getAttribute("href");
    if (!href) {
      href = e?.currentTarget?.getAttribute("href");
    }
    if (href && href.indexOf("http") !== 0) {
      e.preventDefault();
      value(this.basePath, (basePath) => {
        this.linkSource.give(basePath + href);
      });
    }
  }
}

class ComputedElement {
  constructor(sources, selectorTemplate) {
    this.sources = sources;
    this.selectorTemplate = selectorTemplate;
  }
  element(guest) {
    const chain = new SourceAll();
    this.sources.forEach((source) => {
      source.source.value(
        new GuestCast(guest, chain.guestKey(source.placeholder))
      );
    });
    chain.value(
      new GuestCast(
        guest,
        (placeholders) => {
          let selectorTemplate = this.selectorTemplate;
          Object.entries(placeholders).map((entry) => {
            selectorTemplate = selectorTemplate.replaceAll(entry[0], entry[1]);
          });
          const element = document.querySelector(
            selectorTemplate
          );
          if (element) {
            give(element, guest);
          }
        }
      )
    );
  }
}

class GroupActiveClass {
  constructor(activeClass, groupSelector, document) {
    this.activeClass = activeClass;
    this.groupSelector = groupSelector;
    this.document = document;
  }
  give(element) {
    value(
      this.document,
      new PatronOnce((document) => {
        document.querySelectorAll(this.groupSelector).forEach((el) => {
          el.classList.remove(this.activeClass);
        });
        element.classList.add(this.activeClass);
      })
    );
    return this;
  }
}

class Router {
  constructor(loaderSelector, navigationResultSelector, menuSelector) {
    this.loaderSelector = loaderSelector;
    this.navigationResultSelector = navigationResultSelector;
    this.menuSelector = menuSelector;
  }
  routes(routes, currentPage, basePathSource, afterPageLoaded) {
    if (!currentPage) {
      currentPage = new CurrentPage();
    }
    currentPage.value(new Patron(new HistoryNewPage()));
    const [basePath] = location.href.replace(location.origin, "").split("#");
    if (!basePathSource) {
      basePathSource = new SourceChangeable(
        `${basePath}#`.replace("index.html", "").replace("//", "/")
      );
    }
    const pageLoading = new SourceChangeable(false);
    pageLoading.value(new Patron(new Visible(this.loaderSelector)));
    const historyPoppedPage = new HistoryPoppedPage(currentPage);
    historyPoppedPage.watchPop();
    const navigation = new Navigation(
      pageLoading,
      basePathSource,
      currentPage,
      new RouteDisplay(this.navigationResultSelector),
      new PrivateClass(PageFetchTransport)
    );
    navigation.routes(routes);
    const link = new Link(currentPage, basePathSource);
    link.watchClick(this.menuSelector);
    const urlChain = new SourceAll();
    basePathSource.value(new Patron(urlChain.guestKey("basePath")));
    currentPage.value(new Patron(urlChain.guestKey("page")));
    const url = new Source((guest) => {
      urlChain.value(
        new GuestCast(guest, ({ basePath: basePath2, page }) => {
          give(page.replace(basePath2, ""), guest);
        })
      );
    });
    const activeLink = new ComputedElement(
      [{ source: url, placeholder: "{url}" }],
      `${this.menuSelector} a[href="{url}"]`
    );
    activeLink.element(
      new Patron(
        new GroupActiveClass(
          "active",
          `${this.menuSelector} a`,
          sourceOf(document)
        )
      )
    );
    pageLoading.value(
      new Patron((isInLoading) => {
        if (isInLoading) {
          return;
        }
        if (afterPageLoaded) {
          afterPageLoaded();
        }
        const divDestination = document.querySelector(
          this.navigationResultSelector
        );
        if (divDestination) {
          divDestination.querySelectorAll("script").forEach((x) => {
            const sc = document.createElement("script");
            sc.setAttribute("type", "module");
            sc.appendChild(document.createTextNode(x.innerText));
            divDestination.appendChild(sc);
          });
        }
      })
    );
  }
}

class Page {
  constructor(title) {
    this.title = title;
  }
  mounted() {
    document.title = this.title;
  }
}

class EntryPointPage {
  constructor(title, entryPointUrl) {
    this.title = title;
    this.entryPointUrl = entryPointUrl;
  }
  mounted() {
    document.title = this.title;
    import(this.entryPointUrl).then((module) => {
      if (module.main) {
        module.main();
      }
    });
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value2) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
var __publicField$2 = (obj, key, value2) => __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value2);
class Dirty {
  constructor(baseEntitySource, alwaysKeep = [], excludeKeys = [], becomePatronAuto = false) {
    this.alwaysKeep = alwaysKeep;
    this.excludeKeys = excludeKeys;
    __publicField$2(this, "comparingSource", new SourceChangeable());
    __publicField$2(this, "all", new SourceAll());
    this.comparingSource.value(new Patron(this.all.guestKey("comparing")));
    value(baseEntitySource, new Patron(this.all.guestKey("base")));
    if (becomePatronAuto) {
      value(baseEntitySource, new PatronOnce(this));
    }
  }
  give(value2) {
    give(JSON.parse(JSON.stringify(value2)), this.comparingSource);
    return this;
  }
  value(guest) {
    this.all.value(
      new GuestCast(guest, ({ comparing, base }) => {
        if (!comparing) {
          return;
        }
        give(
          Object.fromEntries(
            Object.entries(comparing).filter(([key, value2]) => {
              if (this.alwaysKeep.includes(key)) {
                return true;
              }
              if (this.excludeKeys.includes(key)) {
                return false;
              }
              return value2 !== base[key];
            })
          ),
          guest
        );
      })
    );
    return this;
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value2) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
var __publicField$1 = (obj, key, value2) => __defNormalProp$1(obj, key + "" , value2);
class Loading {
  constructor(loadingStartSource, loadingFinishSource) {
    this.loadingStartSource = loadingStartSource;
    this.loadingFinishSource = loadingFinishSource;
    __publicField$1(this, "loadingSource", new SourceChangeable());
  }
  value(guest) {
    value(
      this.loadingStartSource,
      new GuestCast(guest, () => {
        this.loadingSource.give(true);
      })
    );
    value(
      this.loadingFinishSource,
      new GuestCast(guest, () => {
        this.loadingSource.give(false);
      })
    );
    this.loadingSource.value(guest);
    return this;
  }
}

class Touched {
}

class Path {
  constructor(baseSource, keyType) {
    this.baseSource = baseSource;
    this.keyType = keyType;
  }
  value(guest) {
    const all = new SourceAll(["base", "key"]);
    value(this.baseSource, new GuestCast(guest, all.guestKey("base")));
    value(this.keyType, new GuestCast(guest, all.guestKey("key")));
    all.value(
      new GuestCast(guest, ({ base, key }) => {
        const keyChunks = key.split(".");
        let value2 = base;
        keyChunks.forEach((keyChunk) => {
          value2 = value2[keyChunk];
        });
        if (value2 !== void 0 && value2 !== base) {
          give(value2, guest);
        }
      })
    );
    return this;
  }
}

class Deadline {
  constructor(baseSource, errorSource, timeout) {
    this.baseSource = baseSource;
    this.errorSource = errorSource;
    this.timeout = timeout;
  }
  value(guest) {
    value(
      this.timeout,
      new GuestCast(guest, (timeout) => {
        let timeoutReached = false;
        setTimeout(() => {
          if (timeoutReached) {
            return;
          }
          timeoutReached = true;
          give(
            new Error("Timeout reached in Deadline class"),
            this.errorSource
          );
        }, timeout);
        new SourceFiltered(this.baseSource, () => !timeoutReached).value(guest);
        value(
          this.baseSource,
          new PatronOnce(() => {
            timeoutReached = true;
          })
        );
      })
    );
    return this;
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value2) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value: value2 }) : obj[key] = value2;
var __publicField = (obj, key, value2) => __defNormalProp(obj, key + "" , value2);
class HashTable {
  constructor(baseSource) {
    __publicField(this, "source", new SourceChangeable({}));
    value(
      baseSource,
      new Patron(([key, value2]) => {
        this.source.value((lastRecord) => {
          lastRecord[key] = value2;
        });
      })
    );
  }
  value(guest) {
    value(this.source, guest);
    return this;
  }
}

export { ComputedElement, CurrentPage, Deadline, Dirty, EntryPointPage, GroupActiveClass, HashTable, Input, Link, Loading, Navigation, Page, PageFetchTransport, Path, RouteDisplay, Router, Text, Touched, Visible };
//# sourceMappingURL=silentium-components.js.map
