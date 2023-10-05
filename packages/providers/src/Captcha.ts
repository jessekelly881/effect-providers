import * as Effect from "effect/Effect"
import * as Context from "effect/Context"
import * as Middleware from "@effect/platform/Http/Middleware"
import * as ServerRequest from "@effect/platform/Http/ServerRequest"


export class CaptchaError {
    readonly _tag = "CaptchaError"
    constructor(readonly details?: string) {}
}

export interface Captcha {
    /**
     * Sends the given token to the captcha service to be validated.
     */
    validateToken: (token: string) => Effect.Effect<never, CaptchaError, boolean>
}

export const tag = Context.Tag<Captcha>() // TODO: Add name

/**
 * HTTP Middleware that validates the captcha and rejects the request if it's invalid. 
 */
export const createHttpMiddleware = (headerKey: string) => Middleware.make((httpApp) =>
  Effect.flatMap(
    ServerRequest.ServerRequest,
    (request) => Effect.tap(
        httpApp,
        () => Effect.flatMap(tag, ({ validateToken }) => 
            request.headers[headerKey] ? 
            validateToken(request.headers[headerKey]) : 
            Effect.fail(new CaptchaError("Missing request header"))
        )
    ),
  )
)