import { TheInformation, TheOwner, From } from 'silentium';

/**
 * Takes source and remember it first value
 * returns new record, what will contain only fields what was changed
 * https://silentium-lab.github.io/silentium-components/#/behaviors/dirty
 */
declare class Dirty<T> extends TheInformation<T> {
    private baseEntitySource;
    private alwaysKeep;
    private excludeKeys;
    private comparingSrc;
    constructor(baseEntitySource: TheInformation<T>, alwaysKeep?: string[], excludeKeys?: string[]);
    value(o: TheOwner<T>): this;
    owner(): From<T>;
}

/**
 * Representation of loading process
 * first informatin source begins loading
 * second information source stops loading
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
declare class Loading extends TheInformation<boolean> {
    private loadingStartSrc;
    private loadingFinishSrc;
    constructor(loadingStartSrc: TheInformation<unknown>, loadingFinishSrc: TheInformation<unknown>);
    value(o: TheOwner<boolean>): this;
}

/**
 * Return source of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare class Path<R, T extends Record<string, unknown> | Array<unknown> = any, K extends string = any> extends TheInformation<R> {
    private baseSrc;
    private keySrc;
    constructor(baseSrc: TheInformation<T>, keySrc: TheInformation<K>);
    value(o: TheOwner<R>): this;
}

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare class Deadline<T> extends TheInformation<T> {
    private error;
    private baseSrc;
    private timeoutSrc;
    constructor(error: TheOwner<Error>, baseSrc: TheInformation<T>, timeoutSrc: TheInformation<number>);
    value(o: TheOwner<T>): this;
}

/**
 * Accumulates the last value of the source and returns one result once per tick
 * https://silentium-lab.github.io/silentium-components/#/behaviors/tick
 */
declare class Tick<T> extends TheInformation<T> {
    private baseSrc;
    constructor(baseSrc: TheInformation<T>);
    value(o: TheOwner<T>): this;
}

/**
 * Defer one source after another, gives values of baseSrc only once when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
declare class Deferred<T> extends TheInformation<T> {
    private baseSrc;
    private triggerSrc;
    constructor(baseSrc: TheInformation<T>, triggerSrc: TheInformation<unknown>);
    value(o: TheOwner<T>): this;
}

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
declare class Branch<Then, Else> extends TheInformation<Then | Else> {
    private conditionSrc;
    private leftSrc;
    private rightSrc?;
    constructor(conditionSrc: TheInformation<boolean>, leftSrc: TheInformation<Then>, rightSrc?: TheInformation<Else> | undefined);
    value(o: TheOwner<Then | Else>): this;
}

/**
 * Didn't respond if new value of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
declare class Memo<T> extends TheInformation<T> {
    private baseSrc;
    constructor(baseSrc: TheInformation<T>);
    value(o: TheOwner<T>): this;
}

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
declare class Lock<T> extends TheInformation<T> {
    private baseSrc;
    private lockSrc;
    constructor(baseSrc: TheInformation<T>, lockSrc: TheInformation<boolean>);
    value(o: TheOwner<T>): this;
}

/**
 * Helps to represent only last fresh value of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
declare class Shot<T> extends TheInformation<T> {
    private targetSrc;
    private triggerSrc;
    constructor(targetSrc: TheInformation<T>, triggerSrc: TheInformation);
    value(o: TheOwner<T>): this;
}

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
declare class OnlyChanged<T> extends TheInformation<T> {
    private baseSrc;
    constructor(baseSrc: TheInformation<T>);
    value(o: TheOwner<T>): this;
}

/**
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
declare class HashTable<T> extends TheInformation<T> {
    private baseSrc;
    constructor(baseSrc: TheInformation<[string, unknown]>);
    value(o: TheOwner<T>): this;
}

type UnInformation<T> = T extends TheInformation<infer U> ? U : never;
/**
 * Returns record of data from record of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
declare class RecordOf<T extends TheInformation> extends TheInformation<Record<string, UnInformation<T>>> {
    private recordSrc;
    constructor(recordSrc: Record<string, T>);
    value(o: TheOwner<Record<string, UnInformation<T>>>): this;
}

/**
 * Join sources of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
declare class Concatenated extends TheInformation<string> {
    private sources;
    private joinPartSrc;
    constructor(sources: TheInformation<string>[], joinPartSrc?: TheInformation<string>);
    value(o: TheOwner<string>): this;
}

interface Route<T> {
    pattern: string;
    patternFlags?: string;
    template: T | TheInformation<T>;
}
/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
declare class Router<T = "string"> extends TheInformation<T> {
    private urlSrc;
    private routesSrc;
    private defaultSrc;
    constructor(urlSrc: TheInformation<string>, routesSrc: TheInformation<Route<T>[]>, defaultSrc: TheInformation<T>);
    value(o: TheOwner<T>): this;
}

/**
 * Boolean source what checks what string matches pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
declare class RegexpMatched extends TheInformation<boolean> {
    private patternSrc;
    private valueSrc;
    private flagsSrc;
    constructor(patternSrc: TheInformation<string>, valueSrc: TheInformation<string>, flagsSrc?: TheInformation<string>);
    value(o: TheOwner<boolean>): this;
}

/**
 * Returns string replaced by regular expression pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-replaced
 */
declare class RegexpReplaced extends TheInformation<string> {
    private valueSrc;
    private patternSrc;
    private replaceValueSrc;
    private flagsSrc;
    constructor(valueSrc: TheInformation<string>, patternSrc: TheInformation<string>, replaceValueSrc: TheInformation<string>, flagsSrc?: TheInformation<string>);
    value(o: TheOwner<string>): this;
}

/**
 * First match of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
declare class RegexpMatch extends TheInformation<string[]> {
    private patternSrc;
    private valueSrc;
    private flagsSrc;
    constructor(patternSrc: TheInformation<string>, valueSrc: TheInformation<string>, flagsSrc?: TheInformation<string>);
    value(o: TheOwner<string[]>): this;
}

/**
 * Ability to mutate some object, helpful when integrate to procedure systems
 * https://silentium-lab.github.io/silentium-components/#/system/set
 */
declare class Set<T extends Record<string, unknown>> extends TheInformation<T> {
    private baseSrc;
    private keySrc;
    private valueSrc;
    constructor(baseSrc: TheInformation<T>, keySrc: TheInformation<string>, valueSrc: TheInformation<unknown>);
    value(o: TheOwner<T>): this;
}

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/and
 */
declare class And extends TheInformation<boolean> {
    private oneSrc;
    private twoSrc;
    constructor(oneSrc: TheInformation<boolean>, twoSrc: TheInformation<boolean>);
    value(o: TheOwner<boolean>): this;
}

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
declare class Or extends TheInformation<boolean> {
    private oneSrc;
    private twoSrc;
    constructor(oneSrc: TheInformation<boolean>, twoSrc: TheInformation<boolean>);
    value(o: TheOwner<boolean>): this;
}

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
declare class Not extends TheInformation<boolean> {
    private baseSrc;
    constructor(baseSrc: TheInformation<boolean>);
    value(o: TheOwner<boolean>): this;
}

/**
 * Convert any source to boolean source
 * https://silentium-lab.github.io/silentium-components/#/boolean/bool
 */
declare class Bool extends TheInformation<boolean> {
    private baseSrc;
    constructor(baseSrc: TheInformation);
    value(o: TheOwner<boolean>): this;
}

/**
 * Represents object from json
 */
declare class FromJson<T> extends TheInformation<T> {
    private jsonSrc;
    private errorOwner?;
    constructor(jsonSrc: TheInformation<string>, errorOwner?: TheOwner | undefined);
    value(o: TheOwner<T>): this;
}

/**
 * Represents json from object
 */
declare class ToJson extends TheInformation<string> {
    private dataSrc;
    private errorOwner?;
    constructor(dataSrc: TheInformation, errorOwner?: TheOwner | undefined);
    value(o: TheOwner<string>): this;
}

/**
 * Represents the first element of an array.
 */
declare class First<T extends Array<unknown>> extends TheInformation<T[0]> {
    private baseSrc;
    constructor(baseSrc: TheInformation<T>);
    value(o: TheOwner<T[0]>): this;
}

export { And, Bool, Branch, Concatenated, Deadline, Deferred, Dirty, First, FromJson, HashTable, Loading, Lock, Memo, Not, OnlyChanged, Or, Path, RecordOf, RegexpMatch, RegexpMatched, RegexpReplaced, Router, Set, Shot, Tick, ToJson };
export type { Route };
