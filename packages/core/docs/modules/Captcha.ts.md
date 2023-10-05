---
title: Captcha.ts
nav_order: 1
parent: Modules
---

## Captcha overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Captcha (interface)](#captcha-interface)
  - [CaptchaError (class)](#captchaerror-class)
    - [\_tag (property)](#_tag-property)
  - [createHttpMiddleware](#createhttpmiddleware)
  - [tag](#tag)

---

# utils

## Captcha (interface)

**Signature**

```ts
export interface Captcha {
  /**
   * Sends the given token to the captcha service to be validated.
   */
  validateToken: (token: string) => Effect.Effect<never, CaptchaError, boolean>
}
```

Added in v1.0.0

## CaptchaError (class)

**Signature**

```ts
export declare class CaptchaError {
  constructor(readonly details?: string)
}
```

Added in v1.0.0

### \_tag (property)

**Signature**

```ts
readonly _tag: "CaptchaError"
```

Added in v1.0.0

## createHttpMiddleware

HTTP Middleware that validates the captcha and rejects the request if it's invalid.

**Signature**

```ts
export declare const createHttpMiddleware: (
  headerKey: string
) => <R, E>(
  httpApp: Default<R, E>
) => Effect.Effect<R | ServerRequest.ServerRequest | Captcha, E | CaptchaError, ServerResponse>
```

Added in v1.0.0

## tag

**Signature**

```ts
export declare const tag: Context.Tag<Captcha, Captcha>
```

Added in v1.0.0
