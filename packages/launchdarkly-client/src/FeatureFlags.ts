import * as LDClient from 'launchdarkly-js-client-sdk';
import * as Layer from "effect/Layer"
import * as Chunk from "effect/Chunk"
import * as Effect from "effect/Effect"
import * as Stream from "effect/Stream"
import * as FeatureFlags from "@effect-providers/core/dist/FeatureFlags"
import * as AppError from "@effect-providers/core/dist/Error"


// @internal
type InitProps = Parameters<typeof LDClient.initialize>

// @internal
const init = (...props: InitProps) => Effect.async<never, Error, LDClient.LDClient>((resume) => {
    const client = LDClient.initialize(...props);
    client.on('ready', () => { resume(Effect.succeed(client)) })
    client.on('failed', () => { resume(Effect.fail(new Error(""))) })
})

// @internal
const release = (client: LDClient.LDClient) => Effect.promise(() => client.close())

export const layer = (...props: InitProps) => Layer.effect(
    FeatureFlags.tag, 
    Effect.flatMap(
        init(...props), 
        (client) => Effect.succeed(FeatureFlags.make({
            get: (flagName) => Effect.sync(() => client.variation(flagName)),
            getStream: (flagName) => Stream.async<never, AppError.AppError, unknown>((emit) => {
                emit(Effect.succeed(Chunk.of(client.variation(flagName))))

                client.on(`change:${flagName}`, (value) => {
                    emit(Effect.succeed(Chunk.of(value)))
                });
            })
        }))
    )
)