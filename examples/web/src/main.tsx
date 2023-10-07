import React from 'react'
import ReactDOM from 'react-dom/client'
import * as FeatureFlags from "@effect-providers/core/dist/FeatureFlags"
import { Stream } from "effect"
import * as LDFlags from "@effect-providers/launchdarkly-client/dist/FeatureFlags"
import * as Match from "@effect/match";
import * as Rx from "@effect-rx/rx/Rx";
import * as RxReact from "@effect-rx/rx-react";

const context = {
  kind: "user",
  key: "example-context-key",
  name: "Sandy"
};

const flagsLayer = LDFlags.layer("64d563d746975713915e0195", context)

const program = Stream.flatMap(FeatureFlags.tag, flags => flags.getStream.boolean("test"))

const rx = Rx.streamPull(() => program.pipe(Stream.provideLayer(flagsLayer)));

export const App = () => {
  const result = RxReact.useRxValue(rx)

  const text = Match.value(result).pipe(
    Match.tag("Initial", () => ""),
    Match.tag("Success", (res) => res.value ? "On" : "Off"),
    Match.tag("Waiting", () => "..."),
    Match.tag("Failure", (err) => err.cause.toString()),
    Match.exhaustive
  )

  return <span>{ text }</span>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

export default {}