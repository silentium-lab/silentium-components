import * as silentium from 'silentium';
import { SourceType, SourceChangeableType, GuestType } from 'silentium';

/**
 * Sets activeClass to one element of group
 * and resets activeClass on other group elements
 * suitable for menu active class
 */
declare const groupActiveClass: (activeClassSrc: SourceType<string>, activeElementSrc: SourceType<HTMLElement>, groupElementsSrc: SourceType<HTMLElement[]>) => SourceType<HTMLElement[]>;

/**
 * Takes source and remember it first value
 * returns new record, what will contain only fields what was changed
 */
declare const dirty: <T extends object>(baseEntitySource: SourceType<T>, becomePatronAuto?: boolean, alwaysKeep?: string[], excludeKeys?: string[]) => SourceChangeableType<Partial<T>>;

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
declare const loading: (loadingStartSource: SourceType<unknown>, loadingFinishSource: SourceType<unknown>) => silentium.SourceExecutorType<boolean>;

declare const path: <T extends Record<string, unknown>, K extends string>(baseSrc: SourceType<T>, keySrc: SourceType<K>) => silentium.SourceExecutorType<T[K]>;

declare const deadline: <T>(error: GuestType<Error>, baseSrc: SourceType<T>, timeoutSrc: SourceType<number>) => (g: GuestType<T>) => void;

/**
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
declare const hashTable: (baseSource: SourceType<[string, unknown]>) => silentium.SourceExecutorType<Record<string, unknown>>;

/**
 * Returns record of data from record of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
declare const record: (recordSrc: Record<string, SourceType>) => SourceType<Record<string, any>>;

/**
 * Join sources of strings to one source
 */
declare const concatenated: (sources: SourceType<string>[], joinPartSrc?: SourceType<string>) => SourceType<string>;

interface Route<T> {
    pattern: string;
    patternFlags?: string;
    template: T | SourceType<T>;
}
/**
 * Router component what will return template if url matches pattern
 */
declare const router: <T = "string">(urlSrc: SourceType<string>, routesSrc: SourceType<Route<T>[]>, defaultSrc: SourceType<T>) => silentium.SourceExecutorType<T>;

export { type Route, concatenated, deadline, dirty, groupActiveClass, hashTable, loading, path, record, router };
