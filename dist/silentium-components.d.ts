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
 * https://silentium-lab.github.io/silentium-components/#/behaviors/dirty
 */
declare const dirty: <T extends object>(baseEntitySource: SourceType<T>, becomePatronAuto?: boolean, alwaysKeep?: string[], excludeKeys?: string[]) => SourceChangeableType<Partial<T>>;

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
declare const loading: (loadingStartSource: SourceType<unknown>, loadingFinishSource: SourceType<unknown>) => silentium.SourceExecutorType<boolean>;

/**
 * Return source of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare const path: <T extends Record<string, unknown> | Array<unknown>, K extends string>(baseSrc: SourceType<T>, keySrc: SourceType<K>) => silentium.SourceExecutorType<unknown>;

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare const deadline: <T>(error: GuestType<Error>, baseSrc: SourceType<T>, timeoutSrc: SourceType<number>) => (g: GuestType<T>) => void;

/**
 * Accumulates the last value of the source and returns one result once per tick
 * https://silentium-lab.github.io/silentium-components/#/behaviors/tick
 */
declare const tick: <T>(baseSrc: SourceType<T>) => silentium.SourceChangeableType<T>;

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/dirty
 */
declare const fork: <T, Then, Else>(conditionSrc: SourceType<T>, predicate: (v: T) => boolean, thenSrc: SourceType<Then>, elseSrc?: SourceType<Else>) => SourceType<Then | Else>;

/**
 * Defer one source after another, gives values of baseSrc only once when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
declare const deferred: <T>(baseSrc: SourceType<T>, triggerSrc: SourceType<unknown>) => silentium.SourceExecutorType<T>;

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
declare const branch: <Then, Else>(conditionSrc: SourceType<boolean>, thenSrc: SourceType<Then>, elseSrc?: SourceType<Else>) => SourceType<Then | Else>;

/**
 * Didn't respond if new value of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
declare const memo: <T>(baseSrc: SourceType<T>) => silentium.SourceExecutorType<T>;

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
declare const lock: <T>(baseSrc: SourceType<T>, lockSrc: SourceType<unknown>) => silentium.SourceExecutorType<unknown>;

/**
 * Get's value from source in moment of component call and than return this value every time
 * https://silentium-lab.github.io/silentium-components/#/behaviors/moment
 */
declare const moment: <T>(baseSrc: SourceType<T>, defaultValue?: T) => SourceType<T>;

/**
 * Helps to represent only last fresh value of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
declare const shot: <T>(baseSrc: SourceType<T>, shotSrc: SourceType<unknown>) => silentium.SourceChangeableType<T>;

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
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
declare const concatenated: (sources: SourceType<string>[], joinPartSrc?: SourceType<string>) => SourceType<string>;

interface Route<T> {
    pattern: string;
    patternFlags?: string;
    template: T | SourceType<T>;
}
/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
declare const router: <T = "string">(urlSrc: SourceType<string>, routesSrc: SourceType<Route<T>[]>, defaultSrc: SourceType<T>) => silentium.SourceExecutorType<T>;

/**
 * Boolean source what checks what string matches pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
declare const regexpMatched: (patternSrc: SourceType<string>, valueSrc: SourceType<string>, flagsSrc?: SourceType<string>) => SourceType<boolean>;

/**
 * Returns string replaced by regular expression pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-replaced
 */
declare const regexpReplaced: (valueSrc: SourceType<string>, patternSrc: SourceType<string>, replaceValueSrc: SourceType<string>, flagsSrc?: SourceType<string>) => SourceType<string>;

/**
 * First match of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
declare const regexpMatch: (patternSrc: SourceType<string>, valueSrc: SourceType<string>, flagsSrc?: SourceType<string>) => SourceType<string[]>;

/**
 * Ability to mutate some object, helpful when integrate to procedure systems
 * https://silentium-lab.github.io/silentium-components/#/system/set
 */
declare const set: <T extends Record<string, unknown>>(baseSrc: SourceType<T>, keySrc: SourceType<string>, valueSrc: SourceType<unknown>) => SourceType<T>;

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/and
 */
declare const and: (oneSrc: SourceType<boolean>, twoSrc: SourceType<boolean>) => SourceType<boolean>;

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
declare const or: (oneSrc: SourceType<boolean>, twoSrc: SourceType<boolean>) => SourceType<boolean>;

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
declare const not: (baseSrc: SourceType<boolean>) => (g: GuestType<boolean>) => void;

export { and, branch, concatenated, deadline, deferred, dirty, fork, groupActiveClass, hashTable, loading, lock, memo, moment, not, or, path, record, regexpMatch, regexpMatched, regexpReplaced, router, set, shot, tick };
export type { Route };
