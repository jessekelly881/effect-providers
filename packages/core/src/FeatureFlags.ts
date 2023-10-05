import * as Effect from "effect/Effect"
import * as Stream from "effect/Stream"
import * as Context from "effect/Context"
import * as AppError from "./Error";
import * as ParseResult from "@effect/schema/ParseResult";
import * as Schema from "@effect/schema/Schema";

/**
 * @example
 * 
 * get() // unknown
 * get.boolean() // boolean
 * get.number() // number
 */
export interface Get {
    (flagName: string): Effect.Effect<never, AppError.AppError, unknown>,
    boolean(flagName: string): Effect.Effect<never, AppError.AppError | ParseResult.ParseError, boolean>;
    number(flagName: string): Effect.Effect<never, AppError.AppError | ParseResult.ParseError, number>;
    string(flagName: string): Effect.Effect<never, AppError.AppError | ParseResult.ParseError, string>;
}

// @internal
class GetImpl {

    private constructor( // constructable via `create()`
        readonly fn: (flagName: string) => Effect.Effect<never, AppError.AppError, unknown>
    ) {}

    public call(flagName: string): Effect.Effect<never, AppError.AppError, unknown> {
        return this.fn(flagName)
    }

    public boolean(flagName: string): Effect.Effect<never, AppError.AppError | ParseResult.ParseError, boolean> {
        return this.call(flagName).pipe(Effect.flatMap(Schema.parse(Schema.boolean)))
    }

    public number(flagName: string): Effect.Effect<never, AppError.AppError | ParseResult.ParseError, number> {
        return this.call(flagName).pipe(Effect.flatMap(Schema.parse(Schema.number)))
    }

    public string(flagName: string): Effect.Effect<never, AppError.AppError | ParseResult.ParseError, string> {
        return this.call(flagName).pipe(Effect.flatMap(Schema.parse(Schema.string)))
    }

    public static create(fn: (flagName: string) => Effect.Effect<never, AppError.AppError, unknown>): Get {
        const instance = new GetImpl(fn);
        return Object.assign(
            (flagName: string) => instance.call(flagName),
            {
                boolean: (flagName: string) => instance.boolean(flagName),
                number: (flagName: string) => instance.number(flagName),
                string: (flagName: string) => instance.string(flagName)
            }
        );
    }
}

/**
 * @example
 * 
 * get() // unknown
 * get.boolean() // boolean
 * get.number() // number
 */
export interface GetStream {
    (flagName: string): Stream.Stream<never, AppError.AppError, unknown>,
    boolean(flagName: string): Stream.Stream<never, AppError.AppError | ParseResult.ParseError, boolean>;
    number(flagName: string): Stream.Stream<never, AppError.AppError | ParseResult.ParseError, number>;
    string(flagName: string): Stream.Stream<never, AppError.AppError | ParseResult.ParseError, string>;
}

// @internal
class GetStreamImpl {

    private constructor( // constructable via `create()`
        readonly fn: (flagName: string) => Stream.Stream<never, AppError.AppError, unknown>
    ) {}

    public call(flagName: string): Stream.Stream<never, AppError.AppError, unknown> {
        return this.fn(flagName)
    }

    public boolean(flagName: string): Stream.Stream<never, AppError.AppError | ParseResult.ParseError, boolean> {
        return this.call(flagName).pipe(Stream.flatMap(Schema.parse(Schema.boolean)))
    }

    public number(flagName: string): Stream.Stream<never, AppError.AppError | ParseResult.ParseError, number> {
        return this.call(flagName).pipe(Stream.flatMap(Schema.parse(Schema.number)))
    }

    public string(flagName: string): Stream.Stream<never, AppError.AppError | ParseResult.ParseError, string> {
        return this.call(flagName).pipe(Stream.flatMap(Schema.parse(Schema.string)))
    }

    public static create(fn: (flagName: string) => Stream.Stream<never, AppError.AppError, unknown>): GetStream {
        const instance = new GetStreamImpl(fn);
        return Object.assign(
            (flagName: string) => instance.call(flagName),
            {
                boolean: (flagName: string) => instance.boolean(flagName),
                number: (flagName: string) => instance.number(flagName),
                string: (flagName: string) => instance.string(flagName)
            }
        );
    }
}

/**
 * Effect.flatMap(FeatureFlags.tag, (flags) => flags.get.boolean("my-flag"))
 */
export interface FeatureFlags {
    /**
     * Gets the current value of a given feature flag.
     */
    get: Get,

    /**
     * Gets a stream of values for a given feature flag. Emits whenever a flag is updated.
     */
    getStream: GetStream
}

export const tag = Context.Tag<FeatureFlags>() // TODO: Add name

export const make = (impl: {
    get: (flagName: string) => Effect.Effect<never, AppError.AppError, unknown>,
    getStream?: (flagName: string) => Stream.Stream<never, AppError.AppError, unknown>
}): FeatureFlags => {
    return tag.of({
        get: GetImpl.create(impl.get),
        getStream: GetStreamImpl.create(impl.getStream ?? ((fileName) => Stream.repeatEffect(impl.get(fileName))))
    })
}