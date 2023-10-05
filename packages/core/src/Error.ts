import * as Data from "effect/Data";

export type AppErrorTypeId = typeof AppErrorTypeId

export const AppErrorTypeId = Symbol.for(
    "@effect/platform/Error/PlatformErrorTypeId"
)

export interface AppError extends Data.Case {
    readonly [AppErrorTypeId]: typeof AppErrorTypeId
    readonly _tag: string
    readonly module: "Captcha" | "FeatureFlags"
    readonly method: string
    readonly message: string
}

export const make =
  <A extends AppError>(tag: A["_tag"]) => (props: Omit<A, AppErrorTypeId | "_tag">): A =>
    Data.struct({
      [AppErrorTypeId]: AppErrorTypeId,
      _tag: tag,
      ...props
    } as A)