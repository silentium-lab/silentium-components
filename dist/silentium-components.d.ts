import * as silentium from 'silentium';
import { GuestType, SourceWithPoolType, SourceType, PrivateType, GuestObjectType, SourceObjectType } from 'silentium';
import { RoutePageTransportType as RoutePageTransportType$1 } from 'src/navigation/PageFetchTransport';
import { RouteDisplayType as RouteDisplayType$1 } from 'src/navigation/RouteDisplay';
import { RoutePageType as RoutePageType$1 } from 'src/navigation/RoutePageType';

interface RoutePageTransportType {
    content(guest: GuestType<string>): void;
}
/**
 * Not needed anymore same thing in web api existed
 * @deprecated
 */
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
 * @deprecated move to web api
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
    pool(): silentium.PatronPool<string>;
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
    pool(): silentium.PatronPool<InputValue>;
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

/**
 * @deprecated Move to web api
 */
declare class Page implements RoutePageType {
    private title;
    constructor(title: string);
    mounted(): void;
}

/**
 * @deprecated not needed
 */
declare class EntryPointPage implements RoutePageType {
    private title;
    private entryPointUrl;
    constructor(title: string, entryPointUrl: string);
    mounted(): void;
}

/**
 * Takes source and remember it first value
 * returns new record, what will contain only fields what was changed
 */
declare class Dirty<T extends object> implements SourceObjectType<Partial<T>>, GuestObjectType<T> {
    private alwaysKeep;
    private excludeKeys;
    private comparingSource;
    private all;
    constructor(baseEntitySource: SourceType<T>, alwaysKeep?: string[], excludeKeys?: string[], becomePatronAuto?: boolean);
    give(value: T): this;
    value(guest: GuestType<Partial<T>>): unknown;
}

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
declare class Loading implements SourceObjectType<boolean> {
    private loadingStartSource;
    private loadingFinishSource;
    private loadingSource;
    constructor(loadingStartSource: SourceType<unknown>, loadingFinishSource: SourceType<unknown>);
    value(guest: GuestType<boolean>): this;
}

declare class Touched {
}

declare class Path<T extends Record<string, unknown>, K extends string> implements SourceObjectType<T[K]> {
    private baseSource;
    private keyType;
    constructor(baseSource: SourceType<T>, keyType: SourceType<K>);
    value(guest: GuestType<T[K]>): this;
}

/**
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
declare class HashTable implements SourceObjectType<Record<string, unknown>> {
    private source;
    constructor(baseSource: SourceType<[string, unknown]>);
    value(guest: GuestType<Record<string, unknown>>): this;
}

export { ComputedElement, CurrentPage, Dirty, EntryPointPage, GroupActiveClass, HashTable, Input, Link, Loading, Navigation, Page, PageFetchTransport, Path, RouteDisplay, type RouteDisplayType, type RouteDocument, type RoutePageTransportType, type RoutePageType, Router, Text, Touched, Visible };
