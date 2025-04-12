import * as patron_oop from 'patron-oop';
import { GuestType, SourceWithPoolType, SourceType, PrivateType, GuestObjectType, SourceObjectType } from 'patron-oop';
import { RoutePageTransportType as RoutePageTransportType$1 } from 'src/navigation/PageFetchTransport';
import { RouteDisplayType as RouteDisplayType$1 } from 'src/navigation/RouteDisplay';
import { RoutePageType as RoutePageType$1 } from 'src/navigation/RoutePageType';

interface RoutePageTransportType {
    content(guest: GuestType<string>): void;
}
declare class PageFetchTransport implements RoutePageTransportType {
    private basePath;
    private template;
    constructor(basePath: string, template: string);
    content(guest: GuestType<string>): void;
}

interface RouteDocument {
    url: string;
    template: string;
    aliases?: string[];
    page: RoutePageType$1;
    default?: boolean;
}
declare class Navigation {
    private loading;
    private basePath;
    private currentPage;
    private display;
    private pageTransport;
    constructor(loading: SourceWithPoolType<boolean>, basePath: SourceType<string>, currentPage: SourceWithPoolType<string>, display: RouteDisplayType$1, pageTransport: PrivateType<RoutePageTransportType$1>);
    routes(routes: RouteDocument[]): void;
}

interface RouteDisplayType {
    display(content: string): void;
}
/**
 * Renders content on selector
 */
declare class RouteDisplay implements RouteDisplayType {
    private selector;
    constructor(selector: string);
    display(content: string): void;
}

interface RoutePageType {
    mounted(): void;
}

/**
 * @deprecated move to web api
 */
declare class CurrentPage implements SourceWithPoolType<string> {
    private source;
    constructor();
    give(value: string): this;
    value(guest: GuestType<string>): GuestType<string>;
    pool(): patron_oop.PatronPool<string>;
}

type Route = {
    url: string;
    template: string;
    aliases: string[];
    page: any;
};
declare class Router {
    private loaderSelector;
    private navigationResultSelector;
    private menuSelector;
    constructor(loaderSelector: string, navigationResultSelector: string, menuSelector: string);
    routes(routes: Route[], currentPage: any, basePathSource: any, afterPageLoaded?: () => void): void;
}

type InputValue = number | string;
/**
 * @deprecated move to web api
 */
declare class Input implements SourceWithPoolType<InputValue> {
    private source;
    constructor(source: SourceWithPoolType<InputValue>, selector: string);
    value(guest: GuestType<InputValue>): this;
    give(value: InputValue): this;
    pool(): patron_oop.PatronPool<InputValue>;
}

/**
 * @deprecated move to web api
 */
declare class Visible implements GuestObjectType<boolean> {
    private selector;
    constructor(selector: string);
    give(isVisible: boolean): this;
}

/**
 * @deprecated Move to web api
 */
declare class Text implements GuestObjectType {
    private selector;
    constructor(selector: string);
    give(value: unknown): this;
}

/**
 * @deprecated move to web api
 */
declare class Link {
    private linkSource;
    private basePath;
    constructor(linkSource: GuestObjectType<string>, basePath: SourceType<string>);
    watchClick(selector: string, subselector?: string): void;
    private handleClick;
}

type SourceDetailType = {
    source: SourceObjectType<any>;
    placeholder: string;
};
/**
 * @deprecated use https://kosukhin.github.io/patron-web-api/#/dom/element
 */
declare class ComputedElement {
    private sources;
    private selectorTemplate;
    constructor(sources: SourceDetailType[], selectorTemplate: string);
    element(guest: GuestType<HTMLElement>): void;
}

/**
 * Sets activeClass to one element of group
 * and resets activeClass on other group elements
 * suitable for menu active class
 *
 * @deprecated heavily related to web api needs refactoring
 */
declare class GroupActiveClass implements GuestObjectType<HTMLElement> {
    private activeClass;
    private groupSelector;
    private document;
    constructor(activeClass: string, groupSelector: string, document: SourceType<Document>);
    give(element: HTMLElement): this;
}

declare class Page implements RoutePageType {
    private title;
    constructor(title: string);
    mounted(): void;
}

declare class EntryPointPage implements RoutePageType {
    private title;
    private entryPointUrl;
    constructor(title: string, entryPointUrl: string);
    mounted(): void;
}

export { ComputedElement, CurrentPage, EntryPointPage, GroupActiveClass, Input, Link, Navigation, Page, PageFetchTransport, RouteDisplay, type RouteDisplayType, type RouteDocument, type RoutePageTransportType, type RoutePageType, Router, Text, Visible };
