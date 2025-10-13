import { EventType, ConstructorType, EventUserType, SourceType } from 'silentium';

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
declare const branch: <Then, Else>(conditionSrc: EventType<boolean>, leftSrc: EventType<Then>, rightSrc?: EventType<Else>) => EventType<Then | Else>;

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
declare const branchLazy: <Then, Else>(conditionSrc: EventType<boolean>, leftSrc: ConstructorType<[], EventType<Then>>, rightSrc?: ConstructorType<[], EventType<Else>>) => EventType<Then | Else>;

declare const constant: <T>(permanentValue: T, triggerSrc: EventType) => EventType<T>;

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare const deadline: <T>(error: EventUserType<Error>, baseSrc: EventType<T>, timeoutSrc: EventType<number>) => EventType<T>;

/**
 * Defer one source after another, gives values of baseSrc only when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
declare const deferred: <T>(baseSrc: EventType<T>, triggerSrc: EventType<unknown>) => EventType<T>;

declare const detached: <T>(baseSrc: EventType<T>) => EventType<T>;

/**
 * Takes source and remember it first value
 * returns new record, what will contain only fields what was changed
 * https://silentium-lab.github.io/silentium-components/#/behaviors/dirty
 */
declare const dirty: <T>(baseEntitySource: EventType<T>, alwaysKeep?: string[], excludeKeys?: string[], cloneFn?: (v: T) => T) => SourceType<T>;

/**
 * Representation of loading process
 * first informatin source begins loading
 * second information source stops loading
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
declare const loading: (loadingStartSrc: EventType<unknown>, loadingFinishSrc: EventType<unknown>) => EventType<boolean>;

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
declare const lock: <T>(baseSrc: EventType<T>, lockSrc: EventType<boolean>) => EventType<T>;

/**
 * Didn't respond if new value of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
declare const memo: <T>(baseSrc: EventType<T>) => EventType<T>;

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
declare const onlyChanged: <T>(baseSrc: EventType<T>) => EventType<T>;

/**
 * Return source of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare const part: <R, T extends Record<string, unknown> | Array<unknown> = any, K extends string = any>(baseSrc: SourceType<T>, keySrc: EventType<K>) => SourceType<R>;

/**
 * Return source of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare const path: <R, T extends Record<string, unknown> | Array<unknown> = any, K extends string = any>(baseSrc: EventType<T>, keySrc: EventType<K>) => EventType<R>;

declare const polling: <T>(baseSrc: EventType<T>, triggerSrc: EventType<T>) => EventType<T>;

/**
 * Helps to represent only last fresh value of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
declare const shot: <T>(targetSrc: EventType<T>, triggerSrc: EventType) => EventType<T>;

declare const task: <T>(baseSrc: EventType<T>, delay?: number) => EventType<T>;

/**
 * Accumulates the last value of the source and returns one result once per tick
 * https://silentium-lab.github.io/silentium-components/#/behaviors/tick
 */
declare const tick: <T>(baseSrc: EventType<T>) => EventType<T>;

/**
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
declare const hashTable: <T>(baseSrc: EventType<[string, unknown]>) => EventType<T>;

type UnInformation<T> = T extends EventType<infer U> ? U : never;
/**
 * Returns record of data from record of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
declare const recordOf: <T extends EventType>(recordSrc: Record<string, T>) => EventType<Record<string, UnInformation<T>>>;

/**
 * Join sources of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
declare const concatenated: (sources: EventType<string>[], joinPartSrc?: EventType<string>) => EventType<string>;

declare const template: (theSrc?: EventType<string>, placesSrc?: EventType<Record<string, unknown>>) => {
    value: EventType<string>;
    template: (value: string) => void;
    /**
     * Ability to register variable
     * in concrete place of template
     */
    var: (src: EventType<string>) => string;
    destroy(): void;
};

interface Route<T> {
    pattern: string;
    patternFlags?: string;
    template: ConstructorType<[], EventType<T>>;
}
/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
declare const router: <T = "string">(urlSrc: EventType<string>, routesSrc: EventType<Route<T>[]>, defaultSrc: ConstructorType<[], EventType<T>>) => EventType<T>;

/**
 * Boolean source what checks what string matches pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
declare const regexpMatched: (patternSrc: EventType<string>, valueSrc: EventType<string>, flagsSrc?: EventType<string>) => EventType<boolean>;

/**
 * Returns string replaced by regular expression pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-replaced
 */
declare const regexpReplaced: (valueSrc: EventType<string>, patternSrc: EventType<string>, replaceValueSrc: EventType<string>, flagsSrc?: EventType<string>) => EventType<string>;

/**
 * First match of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
declare const regexpMatch: (patternSrc: EventType<string>, valueSrc: EventType<string>, flagsSrc?: EventType<string>) => EventType<string[]>;

/**
 * Ability to mutate some object, helpful when integrate to procedure systems
 * https://silentium-lab.github.io/silentium-components/#/system/set
 */
declare const set: <T extends Record<string, unknown>>(baseSrc: EventType<T>, keySrc: EventType<string>, valueSrc: EventType<unknown>) => EventType<T>;

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/and
 */
declare const and: (oneSrc: EventType<boolean>, twoSrc: EventType<boolean>) => EventType<boolean>;

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
declare const or: (oneSrc: EventType<boolean>, twoSrc: EventType<boolean>) => EventType<boolean>;

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
declare const not: (baseSrc: EventType<boolean>) => EventType<boolean>;

/**
 * Convert any source to boolean source
 * https://silentium-lab.github.io/silentium-components/#/boolean/bool
 */
declare const bool: (baseSrc: EventType) => EventType<boolean>;

/**
 * Represents object from json
 */
declare const fromJson: <T = Record<string, unknown>>(jsonSrc: EventType<string>, errorOwner?: EventUserType) => EventType<T>;

/**
 * Represents json from object
 */
declare const toJson: (dataSrc: EventType, errorOwner?: EventUserType) => EventType<string>;

/**
 * Represents the first element of an array.
 */
declare const first: <T extends Array<unknown>>(baseSrc: EventType<T>) => EventType<T[0]>;

export { and, bool, branch, branchLazy, concatenated, constant, deadline, deferred, detached, dirty, first, fromJson, hashTable, loading, lock, memo, not, onlyChanged, or, part, path, polling, recordOf, regexpMatch, regexpMatched, regexpReplaced, router, set, shot, task, template, tick, toJson };
export type { Route };
