import { InformationType, OwnerType } from 'silentium';

/**
 * Takes source and remember it first value
 * returns new record, what will contain only fields what was changed
 * https://silentium-lab.github.io/silentium-components/#/behaviors/dirty
 */
declare const dirty: <T extends object>(baseEntitySource: InformationType<T>, alwaysKeep?: string[], excludeKeys?: string[]) => readonly [InformationType<Partial<T>>, (v: T) => void];

/**
 * Representation of loading process
 * first informatin source begins loading
 * second information source stops loading
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
declare const loading: (loadingStartSource: InformationType<unknown>, loadingFinishSource: InformationType<unknown>) => InformationType<boolean>;

/**
 * Return source of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare const path: <R, T extends Record<string, unknown> | Array<unknown> = any, K extends string = any>(baseSrc: InformationType<T>, keySrc: InformationType<K>) => InformationType<R>;

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare const deadline: <T>(error: OwnerType<Error>, baseSrc: InformationType<T>, timeoutSrc: InformationType<number>) => InformationType<T>;

/**
 * Accumulates the last value of the source and returns one result once per tick
 * https://silentium-lab.github.io/silentium-components/#/behaviors/tick
 */
declare const tick: <T>(baseSrc: InformationType<T>) => InformationType<T>;

/**
 * Defer one source after another, gives values of baseSrc only once when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
declare const deferred: <T>(baseSrc: InformationType<T>, triggerSrc: InformationType<unknown>) => InformationType<T>;

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
declare const branch: <Then, Else>(condition: InformationType<boolean>, left: InformationType<Then>, right?: InformationType<Else>) => InformationType<Then | Else>;

/**
 * Didn't respond if new value of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
declare const memo: <T>(baseSrc: InformationType<T>) => InformationType<T>;

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
declare const lock: <T>(baseSrc: InformationType<T>, lockSrc: InformationType<boolean>) => InformationType<T>;

/**
 * Helps to represent only last fresh value of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
declare const shot: <T>(targetSrc: InformationType<T>, triggerSrc: InformationType) => InformationType<T>;

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
declare const onlyChanged: <T>(baseSrc: InformationType<T>) => InformationType<T>;

/**
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
declare const hashTable: <T>(base: InformationType<[string, unknown]>) => InformationType<T>;

type UnInformation<T> = T extends InformationType<infer U> ? U : never;
/**
 * Returns record of data from record of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
declare const record: <T extends InformationType>(recordSrc: Record<string, T>) => InformationType<Record<string, UnInformation<T>>>;

/**
 * Join sources of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
declare const concatenated: (sources: InformationType<string>[], joinPartSrc?: InformationType<string>) => InformationType<string>;

interface Route<T> {
    pattern: string;
    patternFlags?: string;
    template: T | InformationType<T>;
}
/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
declare const router: <T = "string">(urlSrc: InformationType<string>, routesSrc: InformationType<Route<T>[]>, defaultSrc: InformationType<T>) => InformationType<T>;

/**
 * Boolean source what checks what string matches pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
declare const regexpMatched: (patternSrc: InformationType<string>, valueSrc: InformationType<string>, flagsSrc?: InformationType<string>) => InformationType<boolean>;

/**
 * Returns string replaced by regular expression pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-replaced
 */
declare const regexpReplaced: (valueSrc: InformationType<string>, patternSrc: InformationType<string>, replaceValueSrc: InformationType<string>, flagsSrc?: InformationType<string>) => InformationType<string>;

/**
 * First match of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
declare const regexpMatch: (patternSrc: InformationType<string>, valueSrc: InformationType<string>, flagsSrc?: InformationType<string>) => InformationType<string[]>;

/**
 * Ability to mutate some object, helpful when integrate to procedure systems
 * https://silentium-lab.github.io/silentium-components/#/system/set
 */
declare const set: <T extends Record<string, unknown>>(baseSrc: InformationType<T>, keySrc: InformationType<string>, valueSrc: InformationType<unknown>) => InformationType<T>;

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/and
 */
declare const and: (oneSrc: InformationType<boolean>, twoSrc: InformationType<boolean>) => InformationType<boolean>;

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
declare const or: (oneSrc: InformationType<boolean>, twoSrc: InformationType<boolean>) => InformationType<boolean>;

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
declare const not: (baseSrc: InformationType<boolean>) => InformationType<boolean>;

/**
 * Represents object from json
 */
declare const fromJson: <T>(jsonSrc: InformationType<string>, errorOwner?: OwnerType) => InformationType<T>;

/**
 * Repreresents json from object
 */
declare const toJson: (dataSrc: InformationType, errorOwner?: OwnerType) => InformationType<string>;

/**
 * Represents the first element of an array.
 */
declare const first: <T extends Array<unknown>>(baseSrc: InformationType<T>) => InformationType<T[0]>;

export { and, branch, concatenated, deadline, deferred, dirty, first, fromJson, hashTable, loading, lock, memo, not, onlyChanged, or, path, record, regexpMatch, regexpMatched, regexpReplaced, router, set, shot, tick, toJson };
export type { Route };
