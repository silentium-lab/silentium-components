import { EventType, TransportType, DestroyableType, SourceType, ConstructorType } from 'silentium';

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
declare function Branch<Then, Else>($condition: EventType<boolean>, $left: EventType<Then>, $right?: EventType<Else>): EventType<Then | Else>;

declare function BranchLazy<Then, Else>($condition: EventType<boolean>, $left: TransportType<void, EventType<Then>>, $right?: TransportType<void, EventType<Else>>): EventType<Then | Else> & DestroyableType;

declare function Constant<T>(permanent: T, $trigger: EventType): EventType<T>;

declare function Deadline<T>(error: TransportType<Error>, $base: EventType<T>, $timeout: EventType<number>): EventType<T>;

/**
 * Defer one source after another, gives values Of baseSrc only when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
declare function Deferred<T>($base: EventType<T>, $trigger: EventType<unknown>): EventType<T>;

declare function Detached<T>($base: EventType<T>): EventType<T>;

/**
 * Takes source and remember it first value
 * returns new record, what will contain only fields what was changed
 * https://silentium-lab.github.io/silentium-components/#/behaviors/dirty
 */
declare function Dirty<T>($base: EventType<T>, keep?: string[], exclude?: string[], cloner?: (v: T) => T): SourceType<T>;

/**
 * Representation Of loading process
 * first event begins loading
 * second event stops loading
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
declare function Loading($loadingStart: EventType<unknown>, $loadingFinish: EventType<unknown>): EventType<boolean>;

/**
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
declare function Lock<T>($base: EventType<T>, $lock: EventType<boolean>): EventType<T>;

/**
 * Didn't respond if new value Of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
declare function Memo<T>($base: EventType<T>): EventType<T>;

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
declare function OnlyChanged<T>($base: EventType<T>): EventType<T>;

/**
 * Return source Of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare function Part<R, T extends object | Array<any> = any, K extends string = any>($base: SourceType<T>, $key: EventType<K>): SourceType<R>;

/**
 * Return source Of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare function Path<R, T extends object | Array<any> = any, K extends string = any>($base: EventType<T>, $keyed: EventType<K>): EventType<R>;

declare function Polling<T>($base: EventType<T>, $trigger: EventType<T>): EventType<T>;

/**
 * Helps to represent only last fresh value Of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
declare function Shot<T>($target: EventType<T>, $trigger: EventType): EventType<T>;

declare function Task<T>(baseSrc: EventType<T>, delay?: number): EventType<T>;

/**
 * Accumulates the last value Of the source and returns one result once per tick
 * https://silentium-lab.github.io/silentium-components/#/behaviors/tick
 */
declare function Tick<T>($base: EventType<T>): EventType<T>;

/**
 * Do something on event value.
 * Each event value will create new eventBuilder instance
 */
declare function Transaction<T, R = unknown>($base: EventType<T>, eventBuilder: ConstructorType<[
    EventType<T>,
    ...EventType<any>[]
], EventType<R>>, ...args: EventType[]): EventType<R>;

/**
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
declare function HashTable<T>($base: EventType<[string, unknown]>): EventType<T>;

type UnInformation<T> = T extends EventType<infer U> ? U : never;
/**
 * Returns record Of data from record Of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
declare function RecordOf<T extends EventType>(record: Record<string, T>): EventType<Record<string, UnInformation<T>>>;

/**
 * Join sources Of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
declare function Concatenated(sources: EventType<string>[], joinPartSrc?: EventType<string>): EventType<string>;

declare function Template($src?: EventType<string>, $places?: EventType<Record<string, unknown>>): TemplateEvent;
declare class TemplateEvent implements EventType<string>, DestroyableType {
    private $src;
    private $places;
    private dc;
    private vars;
    constructor($src?: EventType<string>, $places?: EventType<Record<string, unknown>>);
    event(transport: TransportType<string, null>): this;
    template(value: string): void;
    /**
     * Ability to register variable
     * in concrete place Of template
     */
    var(src: EventType<string>): string;
    destroy(): this;
}

interface Route<T> {
    pattern: string;
    patternFlags?: string;
    event: TransportType<[], EventType<T>>;
}
/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
declare function Router<T = "string">($url: EventType<string>, $routes: EventType<Route<T>[]>, $default: TransportType<void, EventType<T>>): EventType<T> & DestroyableType;

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
declare function And($one: EventType<boolean>, $two: EventType<boolean>): EventType<boolean>;

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
declare function Or($one: EventType<boolean>, $two: EventType<boolean>): EventType<boolean>;

/**
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
declare function Not($base: EventType<boolean>): EventType<boolean>;

/**
 * Convert Any source to boolean source
 * https://silentium-lab.github.io/silentium-components/#/boolean/bool
 */
declare function Bool($base: EventType): EventType<boolean>;

/**
 * Represents object from json
 */
declare function FromJson<T = Record<string, unknown>>($json: EventType<string>, error?: TransportType): EventType<T>;

/**
 * Represents json from object
 */
declare function ToJson($data: EventType, error?: TransportType): EventType<string>;

/**
 * Represents the first element Of an array.
 */
declare function First<T extends Array<unknown>>($base: EventType<T>): EventType<T[0]>;

export { And, Bool, Branch, BranchLazy, Concatenated, Constant, Deadline, Deferred, Detached, Dirty, First, FromJson, HashTable, Loading, Lock, Memo, Not, OnlyChanged, Or, Part, Path, Polling, RecordOf, RegexpMatch, RegexpMatched, RegexpReplaced, Router, Set, Shot, Task, Template, Tick, ToJson, Transaction };
export type { Route };
