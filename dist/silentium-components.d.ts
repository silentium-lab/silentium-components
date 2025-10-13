import { EventType, ConstructorType, EventUserType, SourceType } from 'silentium';

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
declare function Branch<Then, Else>(conditionSrc: EventType<boolean>, leftSrc: EventType<Then>, rightSrc?: EventType<Else>): EventType<Then | Else>;

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
declare function BranchLazy<Then, Else>(conditionSrc: EventType<boolean>, leftSrc: ConstructorType<[], EventType<Then>>, rightSrc?: ConstructorType<[], EventType<Else>>): EventType<Then | Else>;

declare function Constant<T>(permanentValue: T, triggerSrc: EventType): EventType<T>;

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare function Deadline<T>(error: EventUserType<Error>, baseSrc: EventType<T>, timeoutSrc: EventType<number>): EventType<T>;

/**
 * Defer one source after another, gives values Of baseSrc only when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
declare function Deferred<T>(baseSrc: EventType<T>, triggerSrc: EventType<unknown>): EventType<T>;

declare function Detached<T>(baseSrc: EventType<T>): EventType<T>;

/**
 * Takes source and remember it first value
 * returns new record, what will contain only fields what was changed
 * https://silentium-lab.github.io/silentium-components/#/behaviors/dirty
 */
declare function Dirty<T>(baseEntitySource: EventType<T>, alwaysKeep?: string[], excludeKeys?: string[], cloneFn?: (v: T) => T): SourceType<T>;

/**
 * Representation Of loading process
 * first informatin source begins loading
 * second information source stops loading
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
declare function Loading(loadingStartSrc: EventType<unknown>, loadingFinishSrc: EventType<unknown>): EventType<boolean>;

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
declare function Lock<T>(baseSrc: EventType<T>, lockSrc: EventType<boolean>): EventType<T>;

/**
 * Didn't respond if new value Of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
declare function Memo<T>(baseSrc: EventType<T>): EventType<T>;

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
declare function OnlyChanged<T>(baseSrc: EventType<T>): EventType<T>;

/**
 * Return source Of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare function Part<R, T extends Record<string, unknown> | Array<unknown> = any, K extends string = any>(baseSrc: SourceType<T>, keySrc: EventType<K>): SourceType<R>;

/**
 * Return source Of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare function Path<R, T extends Record<string, unknown> | Array<unknown> = any, K extends string = any>(baseSrc: EventType<T>, keySrc: EventType<K>): EventType<R>;

declare function Polling<T>(baseSrc: EventType<T>, triggerSrc: EventType<T>): EventType<T>;

/**
 * Helps to represent only last fresh value Of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
declare function Shot<T>(targetSrc: EventType<T>, triggerSrc: EventType): EventType<T>;

declare function Task<T>(baseSrc: EventType<T>, delay?: number): EventType<T>;

/**
 * Accumulates the last value Of the source and returns one result once per tick
 * https://silentium-lab.github.io/silentium-components/#/behaviors/tick
 */
declare function Tick<T>(baseSrc: EventType<T>): EventType<T>;

/**
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
declare function HashTable<T>(baseSrc: EventType<[string, unknown]>): EventType<T>;

type UnInformation<T> = T extends EventType<infer U> ? U : never;
/**
 * Returns record Of data from record Of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
declare function RecordOf<T extends EventType>(recordSrc: Record<string, T>): EventType<Record<string, UnInformation<T>>>;

/**
 * Join sources Of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
declare function Concatenated(sources: EventType<string>[], joinPartSrc?: EventType<string>): EventType<string>;

declare function Template(theSrc?: EventType<string>, placesSrc?: EventType<Record<string, unknown>>): {
    value: EventType<string>;
    template: (value: string) => void;
    /**
     * Ability to register variable
     * in concrete place Of template
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
declare function Router<T = "string">(urlSrc: EventType<string>, routesSrc: EventType<Route<T>[]>, defaultSrc: ConstructorType<[], EventType<T>>): EventType<T>;

/**
 * Boolean source what checks what string matches pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
declare function RegexpMatched(patternSrc: EventType<string>, valueSrc: EventType<string>, flagsSrc?: EventType<string>): EventType<boolean>;

/**
 * Returns string replaced by regular expression pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-replaced
 */
declare function RegexpReplaced(valueSrc: EventType<string>, patternSrc: EventType<string>, replaceValueSrc: EventType<string>, flagsSrc?: EventType<string>): EventType<string>;

/**
 * First match Of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
declare function RegexpMatch(patternSrc: EventType<string>, valueSrc: EventType<string>, flagsSrc?: EventType<string>): EventType<string[]>;

/**
 * Ability to mutate some object, helpful when integrate to procedure systems
 * https://silentium-lab.github.io/silentium-components/#/system/set
 */
declare function Set<T extends Record<string, unknown>>(baseSrc: EventType<T>, keySrc: EventType<string>, valueSrc: EventType<unknown>): EventType<T>;

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/and
 */
declare function And(oneSrc: EventType<boolean>, twoSrc: EventType<boolean>): EventType<boolean>;

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
declare function Or(oneSrc: EventType<boolean>, twoSrc: EventType<boolean>): EventType<boolean>;

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
declare function Not(baseSrc: EventType<boolean>): EventType<boolean>;

/**
 * Convert Any source to boolean source
 * https://silentium-lab.github.io/silentium-components/#/boolean/bool
 */
declare function Bool(baseSrc: EventType): EventType<boolean>;

/**
 * Represents object from json
 */
declare function FromJson<T = Record<string, unknown>>(jsonSrc: EventType<string>, errorOwner?: EventUserType): EventType<T>;

/**
 * Represents json from object
 */
declare function ToJson(dataSrc: EventType, errorOwner?: EventUserType): EventType<string>;

/**
 * Represents the first element Of an array.
 */
declare function First<T extends Array<unknown>>(baseSrc: EventType<T>): EventType<T[0]>;

export { And, Bool, Branch, BranchLazy, Concatenated, Constant, Deadline, Deferred, Detached, Dirty, First, FromJson, HashTable, Loading, Lock, Memo, Not, OnlyChanged, Or, Part, Path, Polling, RecordOf, RegexpMatch, RegexpMatched, RegexpReplaced, Router, Set, Shot, Task, Template, Tick, ToJson };
export type { Route };
