import * as silentium from 'silentium';
import { MaybeMessage, MessageType, ConstructorType, DestroyableType, MessageSourceType } from 'silentium';

/**
 * Allows switching between left and right messages depending on condition
 * https://silentium-lab.github.io/silentium-components/#/behaviors/branch
 */
declare function Branch<Then, Else>(_condition: MaybeMessage<boolean>, _left: MaybeMessage<Then>, _right?: MaybeMessage<Else>): silentium.MessageImpl<Then | Else>;

/**
 * Depending on the $condition message,
 * creates a new left or right message.
 * When condition changes, old messages are destroyed
 * and new ones are created.
 */
declare function BranchLazy<Then, Else>($condition: MessageType<boolean>, $left: ConstructorType<[], MessageType<Then>>, $right?: ConstructorType<[], MessageType<Else>>): MessageType<Then | Else> & DestroyableType;

/**
 * Constant value that will be
 * returned on each value from
 * the $trigger message
 */
declare function Constant<T>(permanent: T, $trigger: MessageType): MessageType<T>;

/**
 * Will return an error via error transport if
 * time runs out from $timeout; if $base manages to
 * respond before $timeout then the value from base will be returned
 */
declare function Deadline<T>($base: MessageType<T>, _timeout: MaybeMessage<number>): silentium.MessageImpl<T>;

/**
 * Defer one source after another, gives values Of baseSrc only when triggerSrc responds
 * https://silentium-lab.github.io/silentium-components/#/behaviors/deferred
 */
declare function Deferred<T>($base: MessageType<T>, $trigger: MessageType<unknown>): silentium.MessageImpl<T>;

/**
 * Message separate from the base
 * allows to take one value from the base
 * but not react to new values of the base message
 */
declare function Detached<T>($base: MessageType<T>): MessageType<T>;

/**
 * Takes source and remember it first value
 * returns new record, what will contain only fields what was changed
 * https://silentium-lab.github.io/silentium-components/#/behaviors/dirty
 */
declare function Dirty<T extends Record<string, unknown>>($base: MessageType<T>, keep?: string[], exclude?: string[], cloner?: (v: T) => T): silentium.MessageSourceImpl<T>;

/**
 * Representation Of loading process
 * first message begins loading
 * second message stops loading
 * https://silentium-lab.github.io/silentium-components/#/behaviors/loading
 */
declare function Loading($start: MessageType<unknown>, $finish: MessageType<unknown>): silentium.MessageImpl<boolean>;

/**
 * Allows locking messages
 * if a $lock message arrives
 * https://silentium-lab.github.io/silentium-components/#/behaviors/lock
 */
declare function Lock<T>($base: MessageType<T>, $lock: MessageType<boolean>): silentium.MessageImpl<T>;

/**
 * Didn't respond if new value Of baseSrc equals to old value
 * https://silentium-lab.github.io/silentium-components/#/behaviors/memo
 */
declare function Memo<T>($base: MessageType<T>): silentium.MessageImpl<T>;

/**
 * Есть объект и каждое новое его значение нужно мержить с прошлым
 * чтобы накопить общие изменения
 */
declare function MergeAccumulation<T extends object>($base: MessageType<T>, $reset?: MessageType<T>): MessageType<T>;

/**
 * Represents source what was changed at least once
 * https://silentium-lab.github.io/silentium-components/#/behaviors/only-changed
 */
declare function OnlyChanged<T>($base: MessageType<T>): silentium.MessageImpl<T>;

/**
 * Return source Of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare function Part<R, T extends object | Array<any> = any, K extends string = any>($base: MessageSourceType<T>, key: MaybeMessage<K>): MessageSourceType<R>;

/**
 * Return source Of record path
 * https://silentium-lab.github.io/silentium-components/#/behaviors/path
 */
declare function Path<R, T extends object | Array<any> = any, K extends string = any>($base: MessageType<T>, _keyed: MaybeMessage<K>, def?: MaybeMessage<R>): MessageType<R>;

/**
 * Path with separate empty message
 */
declare function PathExisted<R, T extends object | Array<any> = any, K extends string = any>(_base: MaybeMessage<T>, _keyed: MaybeMessage<K>): silentium.EmptyImpl<R>;

/**
 * Active polling of $base message
 * synchronized with $trigger message
 */
declare function Polling<T>($base: MessageType<T>, $trigger: MessageType<unknown>): silentium.MessageImpl<T>;

/**
 * Helps eliminate unwanted values
 * that shouldn't exist in object fields
 */
declare function RecordTruncated(_record: MaybeMessage<Record<string, unknown>>, _badValues: MaybeMessage<unknown[]>): silentium.MessageImpl<any>;

/**
 * Helps to represent only last fresh value Of some source, refreshing controls by shotSrc
 * https://silentium-lab.github.io/silentium-components/#/behaviors/shot
 */
declare function Shot<T>($target: MessageType<T>, $trigger: MessageType): silentium.MessageImpl<T>;

/**
 * Defer a message to the event loop
 * so that it executes once within
 * a certain timer firing interval
 */
declare function Task<T>(baseSrc: MaybeMessage<T>, delay?: number): silentium.MessageImpl<T>;

/**
 * Accumulates the last value Of the source and returns one result once per tick
 * https://silentium-lab.github.io/silentium-components/#/behaviors/tick
 */
declare function Tick<T>($base: MessageType<T>): silentium.MessageImpl<T>;

/**
 * Modify the object structure
 * with the ability to create new fields based on
 * existing ones in the object
 */
declare function Transformed<T extends Record<string, any>>(_base: MaybeMessage<T>, transformRules: Record<string, ConstructorType<[MaybeMessage<any>]>>): silentium.MessageImpl<unknown>;

declare function TransformedList<T extends any[]>(_base: MaybeMessage<T>, transformRules: Record<string, ConstructorType<[MaybeMessage<any>]>>): silentium.MessageImpl<unknown[]>;

/**
 * Logical AND over two messages
 * https://silentium-lab.github.io/silentium-components/#/boolean/and
 */
declare function And($one: MessageType<boolean>, $two: MessageType<boolean>): silentium.MessageImpl<boolean>;

/**
 * Convert Any source to boolean source
 * https://silentium-lab.github.io/silentium-components/#/boolean/bool
 */
declare function Bool($base: MessageType): silentium.MessageImpl<boolean>;

/**
 * Logical negation of message
 * https://silentium-lab.github.io/silentium-components/#/boolean/not
 */
declare function Not($base: MessageType<boolean>): silentium.MessageImpl<boolean>;

/**
 * Logical OR over two messages
 * https://silentium-lab.github.io/silentium-components/#/boolean/or
 */
declare function Or($one: MessageType<boolean>, $two: MessageType<boolean>): silentium.MessageImpl<boolean>;

/**
 * Represents object from json
 */
declare function FromJson<T = Record<string, unknown>>($json: MessageType<string>): silentium.MessageImpl<T>;

/**
 * Represents json from object
 */
declare function ToJson($data: MessageType): silentium.MessageImpl<string>;

/**
 * Represents the first element Of an array.
 */
declare function First<T extends Array<unknown>>($base: MessageType<T>): silentium.MessageImpl<T[0]>;

interface Route<T> {
    pattern: string;
    patternFlags?: string;
    message: ConstructorType<[], MessageType<T>>;
}
/**
 * Router component what will return template if url matches pattern
 * https://silentium-lab.github.io/silentium-components/#/navigation/router
 */
declare function Router<T = string>($url: MessageType<string>, routes: MaybeMessage<Route<T>[]>, $default: ConstructorType<[], MessageType<T>>): MessageType<T> & DestroyableType;

/**
 * Join sources Of strings to one source
 * https://silentium-lab.github.io/silentium-components/#/string/concatenated
 */
declare function Concatenated(sources: MessageType<string>[], joinPartSrc?: MessageType<string>): silentium.MessageImpl<string>;

/**
 * Allows creating a string template with
 * variables inserted into it; when variables change,
 * the template value will change
 */
declare function Template(src?: MaybeMessage<string> | ((t: TemplateImpl) => string), $places?: MaybeMessage<Record<string, unknown>>): TemplateImpl;
declare class TemplateImpl implements MessageType<string>, DestroyableType {
    private $src;
    private $places;
    private dc;
    private rejections;
    private vars;
    constructor($src?: MessageType<string>, $places?: MessageType<Record<string, unknown>>);
    then(transport: ConstructorType<[string]>): this;
    template(value: string): void;
    /**
     * Ability to register variable
     * in concrete place Of template
     */
    var(src: MessageType<unknown>): string;
    catch(rejected: ConstructorType<[unknown]>): this;
    destroy(): this;
}

/**
 * By receiving a message with a key and value, collects a table
 * of all previously received messages in the form of a structure
 * https://silentium-lab.github.io/silentium-components/#/structures/hash-table
 */
declare function HashTable<T>($base: MessageType<[string, unknown]>): silentium.MessageImpl<T>;

type UnWrap<T> = T extends MessageType<infer U> ? U : T;
/**
 * Returns record Of data from record Of sources
 * https://silentium-lab.github.io/silentium-components/#/structures/record
 */
declare function Record$1<T>(record: Record$1<string, T>): silentium.MessageImpl<Record$1<string, UnWrap<T>>>;

/**
 * First match Of regexp
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
declare function RegexpMatch(patternSrc: MaybeMessage<string>, valueSrc: MaybeMessage<string>, flagsSrc?: MaybeMessage<string>): silentium.MessageImpl<string[]>;

/**
 * Boolean source what checks what string matches pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-matched
 */
declare function RegexpMatched(patternSrc: MaybeMessage<string>, valueSrc: MaybeMessage<string>, flagsSrc?: MaybeMessage<string>): silentium.MessageImpl<boolean>;

/**
 * Returns string replaced by regular expression pattern
 * https://silentium-lab.github.io/silentium-components/#/system/regexp-replaced
 */
declare function RegexpReplaced(valueSrc: MaybeMessage<string>, patternSrc: MaybeMessage<string>, replaceValueSrc: MaybeMessage<string>, flagsSrc?: MaybeMessage<string>): silentium.MessageImpl<string>;

/**
 * Ability to mutate some object, helpful when integrate to procedure systems
 * https://silentium-lab.github.io/silentium-components/#/system/set
 */
declare function Set<T extends Record<string, unknown>>(baseSrc: MessageType<T>, keySrc: MessageType<string>, valueSrc: MessageType<unknown>): silentium.MessageImpl<T>;

export { And, Bool, Branch, BranchLazy, Concatenated, Constant, Deadline, Deferred, Detached, Dirty, First, FromJson, HashTable, Loading, Lock, Memo, MergeAccumulation, Not, OnlyChanged, Or, Part, Path, PathExisted, Polling, Record$1 as Record, RecordTruncated, RegexpMatch, RegexpMatched, RegexpReplaced, Router, Set, Shot, Task, Template, Tick, ToJson, Transformed, TransformedList };
export type { Route };
