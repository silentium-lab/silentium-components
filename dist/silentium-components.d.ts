import { TheInformation, InformationType, OwnerType, Lazy } from 'silentium';

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
declare class Branch<Then, Else> extends TheInformation<Then | Else> {
    private conditionSrc;
    private leftSrc;
    private rightSrc?;
    constructor(conditionSrc: InformationType<boolean>, leftSrc: InformationType<Then>, rightSrc?: InformationType<Else> | undefined);
    value(o: OwnerType<Then | Else>): this;
}

declare class Const<T> extends TheInformation<T> {
    private permanentValue;
    private triggerSrc;
    constructor(permanentValue: T, triggerSrc: InformationType);
    value(o: OwnerType<T>): this;
}

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare class Deadline<T> extends TheInformation<T> {
    private error;
    private baseSrc;
    private timeoutSrc;
    constructor(error: OwnerType<Error>, baseSrc: InformationType<T>, timeoutSrc: InformationType<number>);
    value(o: OwnerType<T>): this;
}

/**
 * Defer one source after another, gives values of baseSrc only once when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
declare class Deferred<T> extends TheInformation<T> {
    private baseSrc;
    private triggerSrc;
    constructor(baseSrc: InformationType<T>, triggerSrc: InformationType<unknown>);
    value(o: OwnerType<T>): this;
}

/**
 * Takes source and remember it first value
 * returns new record, what will contain only fields what was changed
 * https://silentium-lab.github.io/silentium-components/#/behaviors/dirty
 */
declare class Dirty<T> extends TheInformation<T> implements OwnerType<T> {
    private baseEntitySource;
    private alwaysKeep;
    private excludeKeys;
    private comparingSrc;
    constructor(baseEntitySource: InformationType<T>, alwaysKeep?: string[], excludeKeys?: string[]);
    value(o: OwnerType<T>): this;
    give(value: T): this;
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
    constructor(loadingStartSrc: InformationType<unknown>, loadingFinishSrc: InformationType<unknown>);
    value(o: OwnerType<boolean>): this;
}

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
declare class Lock<T> extends TheInformation<T> {
    private baseSrc;
    private lockSrc;
    constructor(baseSrc: InformationType<T>, lockSrc: InformationType<boolean>);
    value(o: OwnerType<T>): this;
}

/**
 * Didn't respond if new value of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
declare class Memo<T> extends TheInformation<T> {
    private baseSrc;
    constructor(baseSrc: InformationType<T>);
    value(o: OwnerType<T>): this;
}

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
declare class OnlyChanged<T> extends TheInformation<T> {
    private baseSrc;
    constructor(baseSrc: InformationType<T>);
    value(o: OwnerType<T>): this;
}

/**
 * Return source of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare class Path<R, T extends Record<string, unknown> | Array<unknown> = any, K extends string = any> extends TheInformation<R> {
    private baseSrc;
    private keySrc;
    constructor(baseSrc: InformationType<T>, keySrc: InformationType<K>);
    value(o: OwnerType<R>): this;
}

/**
 * Helps to represent only last fresh value of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
declare class Shot<T> extends TheInformation<T> {
    private targetSrc;
    private triggerSrc;
    constructor(targetSrc: InformationType<T>, triggerSrc: InformationType);
    value(o: OwnerType<T>): this;
}

declare class Sync<T> extends TheInformation<T> {
    private baseSrc;
    private theValue;
    private isInit;
    constructor(baseSrc: InformationType<T>);
    value(o: OwnerType<T>): this;
    valueExisted(): boolean;
    valueSync(): T;
    initOwner(): this;
}

/**
 * Accumulates the last value of the source and returns one result once per tick
 * https://silentium-lab.github.io/silentium-components/#/behaviors/tick
 */
declare class Tick<T> extends TheInformation<T> {
    private baseSrc;
    constructor(baseSrc: InformationType<T>);
    value(o: OwnerType<T>): this;
}

/**
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
declare class HashTable<T> extends TheInformation<T> {
    private baseSrc;
    constructor(baseSrc: InformationType<[string, unknown]>);
    value(o: OwnerType<T>): this;
}

type UnInformation<T> = T extends InformationType<infer U> ? U : never;
/**
 * Returns record of data from record of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
declare class RecordOf<T extends InformationType> extends TheInformation<Record<string, UnInformation<T>>> {
    private recordSrc;
    constructor(recordSrc: Record<string, T>);
    value(o: OwnerType<Record<string, UnInformation<T>>>): this;
}

/**
 * Join sources of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
declare class Concatenated extends TheInformation<string> {
    private sources;
    private joinPartSrc;
    constructor(sources: InformationType<string>[], joinPartSrc?: InformationType<string>);
    value(o: OwnerType<string>): this;
}

declare class Template extends TheInformation<string> {
    private placesSrc;
    private source;
    private placesCounter;
    private vars;
    constructor(theSrc?: InformationType<string> | string, placesSrc?: InformationType<Record<string, unknown>>);
    value(guest: OwnerType<string>): this;
    template(value: string): this;
    /**
     * Ability to register variable
     * in concrete place of template
     */
    var(src: InformationType<string>): string;
}

interface Route<T> {
    pattern: string;
    patternFlags?: string;
    template: Lazy<T>;
}
/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
declare class Router<T = "string"> extends TheInformation<T> {
    private urlSrc;
    private routesSrc;
    private defaultSrc;
    constructor(urlSrc: InformationType<string>, routesSrc: InformationType<Route<T>[]>, defaultSrc: InformationType<T>);
    value(o: OwnerType<T>): this;
}

/**
 * Boolean source what checks what string matches pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
declare class RegexpMatched extends TheInformation<boolean> {
    private patternSrc;
    private valueSrc;
    private flagsSrc;
    constructor(patternSrc: InformationType<string>, valueSrc: InformationType<string>, flagsSrc?: InformationType<string>);
    value(o: OwnerType<boolean>): this;
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
    constructor(valueSrc: InformationType<string>, patternSrc: InformationType<string>, replaceValueSrc: InformationType<string>, flagsSrc?: InformationType<string>);
    value(o: OwnerType<string>): this;
}

/**
 * First match of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
declare class RegexpMatch extends TheInformation<string[]> {
    private patternSrc;
    private valueSrc;
    private flagsSrc;
    constructor(patternSrc: InformationType<string>, valueSrc: InformationType<string>, flagsSrc?: InformationType<string>);
    value(o: OwnerType<string[]>): this;
}

/**
 * Ability to mutate some object, helpful when integrate to procedure systems
 * https://silentium-lab.github.io/silentium-components/#/system/set
 */
declare class Set<T extends Record<string, unknown>> extends TheInformation<T> {
    private baseSrc;
    private keySrc;
    private valueSrc;
    constructor(baseSrc: InformationType<T>, keySrc: InformationType<string>, valueSrc: InformationType<unknown>);
    value(o: OwnerType<T>): this;
}

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/and
 */
declare class And extends TheInformation<boolean> {
    private oneSrc;
    private twoSrc;
    constructor(oneSrc: InformationType<boolean>, twoSrc: InformationType<boolean>);
    value(o: OwnerType<boolean>): this;
}

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
declare class Or extends TheInformation<boolean> {
    private oneSrc;
    private twoSrc;
    constructor(oneSrc: InformationType<boolean>, twoSrc: InformationType<boolean>);
    value(o: OwnerType<boolean>): this;
}

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
declare class Not extends TheInformation<boolean> {
    private baseSrc;
    constructor(baseSrc: InformationType<boolean>);
    value(o: OwnerType<boolean>): this;
}

/**
 * Convert any source to boolean source
 * https://silentium-lab.github.io/silentium-components/#/boolean/bool
 */
declare class Bool extends TheInformation<boolean> {
    private baseSrc;
    constructor(baseSrc: InformationType);
    value(o: OwnerType<boolean>): this;
}

/**
 * Represents object from json
 */
declare class FromJson<T> extends TheInformation<T> {
    private jsonSrc;
    private errorOwner?;
    constructor(jsonSrc: InformationType<string>, errorOwner?: OwnerType | undefined);
    value(o: OwnerType<T>): this;
}

/**
 * Represents json from object
 */
declare class ToJson extends TheInformation<string> {
    private dataSrc;
    private errorOwner?;
    constructor(dataSrc: InformationType, errorOwner?: OwnerType | undefined);
    value(o: OwnerType<string>): this;
}

/**
 * Represents the first element of an array.
 */
declare class First<T extends Array<unknown>> extends TheInformation<T[0]> {
    private baseSrc;
    constructor(baseSrc: InformationType<T>);
    value(o: OwnerType<T[0]>): this;
}

export { And, Bool, Branch, Concatenated, Const, Deadline, Deferred, Dirty, First, FromJson, HashTable, Loading, Lock, Memo, Not, OnlyChanged, Or, Path, RecordOf, RegexpMatch, RegexpMatched, RegexpReplaced, Router, Set, Shot, Sync, Template, Tick, ToJson };
export type { Route };
