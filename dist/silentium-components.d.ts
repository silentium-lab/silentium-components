import { DataType, DataUserType, SourceType, ValueType } from 'silentium';

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
declare const branch: <Then, Else>(conditionSrc: DataType<boolean>, leftSrc: DataType<Then>, rightSrc?: DataType<Else>) => DataType<Then | Else>;

declare const constant: <T>(permanentValue: T, triggerSrc: DataType) => DataType<T>;

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare const deadline: <T>(error: DataUserType<Error>, baseSrc: DataType<T>, timeoutSrc: DataType<number>) => DataType<T>;

/**
 * Defer one source after another, gives values of baseSrc only when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
declare const deferred: <T>(baseSrc: DataType<T>, triggerSrc: DataType<unknown>) => DataType<T>;

/**
 * Takes source and remember it first value
 * returns new record, what will contain only fields what was changed
 * https://silentium-lab.github.io/silentium-components/#/behaviors/dirty
 */
declare const dirty: <T>(baseEntitySource: DataType<T>, alwaysKeep?: string[], excludeKeys?: string[], cloneFn?: (v: T) => T) => SourceType<T>;

/**
 * Representation of loading process
 * first informatin source begins loading
 * second information source stops loading
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
declare const loading: (loadingStartSrc: DataType<unknown>, loadingFinishSrc: DataType<unknown>) => DataType<boolean>;

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
declare const lock: <T>(baseSrc: DataType<T>, lockSrc: DataType<boolean>) => DataType<T>;

/**
 * Didn't respond if new value of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
declare const memo: <T>(baseSrc: DataType<T>) => DataType<T>;

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
declare const onlyChanged: <T>(baseSrc: DataType<T>) => DataType<T>;

/**
 * Return source of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare const part: <R, T extends Record<string, unknown> | Array<unknown> = any, K extends string = any>(baseSrc: SourceType<T>, keySrc: DataType<K>) => SourceType<R>;

/**
 * Return source of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare const path: <R, T extends Record<string, unknown> | Array<unknown> = any, K extends string = any>(baseSrc: DataType<T>, keySrc: DataType<K>) => DataType<R>;

declare const polling: <T>(baseSrc: DataType<T>, triggerSrc: DataType<T>) => DataType<T>;

/**
 * Helps to represent only last fresh value of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
declare const shot: <T>(targetSrc: DataType<T>, triggerSrc: DataType) => DataType<T>;

/**
 * Accumulates the last value of the source and returns one result once per tick
 * https://silentium-lab.github.io/silentium-components/#/behaviors/tick
 */
declare const tick: <T>(baseSrc: DataType<T>) => DataType<T>;

declare const task: <T>(baseSrc: DataType<T>, delay?: number) => DataType<T>;

/**
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
declare const hashTable: <T>(baseSrc: DataType<[string, unknown]>) => DataType<T>;

type UnInformation<T> = T extends DataType<infer U> ? U : never;
/**
 * Returns record of data from record of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
declare const recordOf: <T extends DataType>(recordSrc: Record<string, T>) => DataType<Record<string, UnInformation<T>>>;

/**
 * Join sources of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
declare const concatenated: (sources: DataType<string>[], joinPartSrc?: DataType<string>) => DataType<string>;

declare const template: (theSrc?: DataType<string>, placesSrc?: DataType<Record<string, unknown>>) => {
    value: DataType<string>;
    template: (value: string) => void;
    /**
     * Ability to register variable
     * in concrete place of template
     */
    var: (src: DataType<string>) => string;
    destroy(): void;
};

interface Route<T> {
    pattern: string;
    patternFlags?: string;
    template: ValueType<[], DataType<T>>;
}
/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
declare const router: <T = "string">(urlSrc: DataType<string>, routesSrc: DataType<Route<T>[]>, defaultSrc: ValueType<[], DataType<T>>) => DataType<T>;

/**
 * Boolean source what checks what string matches pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
declare const regexpMatched: (patternSrc: DataType<string>, valueSrc: DataType<string>, flagsSrc?: DataType<string>) => DataType<boolean>;

/**
 * Returns string replaced by regular expression pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-replaced
 */
declare const regexpReplaced: (valueSrc: DataType<string>, patternSrc: DataType<string>, replaceValueSrc: DataType<string>, flagsSrc?: DataType<string>) => DataType<string>;

/**
 * First match of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
declare const regexpMatch: (patternSrc: DataType<string>, valueSrc: DataType<string>, flagsSrc?: DataType<string>) => DataType<string[]>;

/**
 * Ability to mutate some object, helpful when integrate to procedure systems
 * https://silentium-lab.github.io/silentium-components/#/system/set
 */
declare const set: <T extends Record<string, unknown>>(baseSrc: DataType<T>, keySrc: DataType<string>, valueSrc: DataType<unknown>) => DataType<T>;

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/and
 */
declare const and: (oneSrc: DataType<boolean>, twoSrc: DataType<boolean>) => DataType<boolean>;

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
declare const or: (oneSrc: DataType<boolean>, twoSrc: DataType<boolean>) => DataType<boolean>;

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
declare const not: (baseSrc: DataType<boolean>) => DataType<boolean>;

/**
 * Convert any source to boolean source
 * https://silentium-lab.github.io/silentium-components/#/boolean/bool
 */
declare const bool: (baseSrc: DataType) => DataType<boolean>;

/**
 * Represents object from json
 */
declare const fromJson: <T = Record<string, unknown>>(jsonSrc: DataType<string>, errorOwner?: DataUserType) => DataType<T>;

/**
 * Represents json from object
 */
declare const toJson: (dataSrc: DataType, errorOwner?: DataUserType) => DataType<string>;

/**
 * Represents the first element of an array.
 */
declare const first: <T extends Array<unknown>>(baseSrc: DataType<T>) => DataType<T[0]>;

export { and, bool, branch, concatenated, constant, deadline, deferred, dirty, first, fromJson, hashTable, loading, lock, memo, not, onlyChanged, or, part, path, polling, recordOf, regexpMatch, regexpMatched, regexpReplaced, router, set, shot, task, template, tick, toJson };
export type { Route };
