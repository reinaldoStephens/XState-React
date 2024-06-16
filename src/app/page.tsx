"use client";
import { useMachine } from "@xstate/react";
import { assign, createMachine, enqueueActions, fromPromise, setup } from "xstate";
import type { NextPage } from "next";

const initialContext = {
    feedback: "",
    receivedFeedback: null,
};

const feedbackValid = (_: any, params: { feedback: string }) => {
    return params.feedback.trim().length > 0;
};

const feedbackMachine = setup({
    types: {
        context: {} as { feedback: string; receivedFeedback: string | null },
    },
    actions: {
        updateFeedback: assign({
            feedback: ({ event }) => {
                return event.value;
            },
        }),
        reset: assign(initialContext),
    },
    actors: {
        sendFeedback: fromPromise(
            async ({
                input,
            }: {
                input: {
                    feedback: string;
                };
            }) => {
                await new Promise((r) => setTimeout(r, 1000));
                return { feedbackSubmitted: input.feedback };
            }
        ),
    },
    guards: {
        feedbackValid,
    },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgAcAnAe1TIBcBiAMzEgCMsBrEqKqiANoAGALqJQZKrFx1cVfOJAAPRAGYA7ADYSAVgCMQgCzqhegByqzm1aoA0IAJ6IATAZJCPHvQE4L355o6ZgC+wfZoWHiEpJQ09MysEByY3ByCooqS0rLyiioIGtr6RibmltZ2joh6qnokmg0N6gF66r5WoeEYOATEJExUFKgMyZzCYkggWTJyCpP5hobaVkuL6m1BrvZOCGZ1eo2a3jrOQhY2zp0gET3R-YPDsACubKgy45lSM7nziJrGJEMZm8mj2QR0xkW20QwJIzh0nlqNUWlj0VxuUT6mAANlJIAwKHA6OgKHQPpNpjk5qB8noge5POZ1DZ1iZ1NDdt5dIYDkdvEJvOpDPzNKEwiB8Pw4IoMb0iJ9srM8ogALSaDkqnQkbw63V6vWqdHdTExai0OgK77U5QuHRa4qGfSOjxWcwc-nuHkNMweZyGDyqUXi2V3AZDS1U5UICF1IEgzTOMz6I7Mjmw9QIrynTQC-RGyJykh0bDofCceAUr6R34IDPqEgafR01SCoWC931zxeJY6DTOAL525Y3GwSARpU1wzOd1CT28n1CP0BoOhIA */
    context: {
        feedback: "",
        receivedFeedback: null,
    },
    initial: "prompt",
    states: {
        prompt: {
            initial: "loading",
            states: {
                loading: {
                    tags: ["loading"],
                    after: {
                        1000: "ready",
                    },
                },
                ready: {},
            },
            on: {
                "feedback.good": {
                    target: "thanks",
                },
                "feedback.bad": {
                    target: "form",
                },
            },
        },
        form: {
            on: {
                "feedback.reset": {
                    actions: { type: "reset" },
                },
                "feedback.update": {
                    actions: [{ type: "updateFeedback" }],
                },
                back: {
                    target: "prompt",
                },
                submit: {
                    guard: {
                        type: "feedbackValid",
                        params: ({ context }) => ({
                            feedback: context.feedback,
                        }),
                    },
                    target: "submitting",
                },
            },
        },
        error: {},
        submitting: {
            invoke: {
                src: "sendFeedback",
                input: ({ context }) => ({
                    feedback: context.feedback,
                }),
                onDone: {
                    actions: assign({
                        receivedFeedback: ({ event }) => event.output.feedbackSubmitted,
                    }),
                    target: "thanks",
                },
            },
            after: {
                2000: {
                    target: "error",
                },
            },
        },
        thanks: {},
        closed: {
            on: {
                restart: { target: "prompt" },
            },
        },
    },
    on: {
        close: ".closed",
    },
});

const Home: NextPage = () => {
    const [state, send] = useMachine(feedbackMachine);

    return (
        <>
            <h1>Aprendiendo XState</h1>
            {state.hasTag("loading") && <div>Loading...</div>}

            <div className="feedback">
                <button
                    className="close'button"
                    onClick={() => {
                        send({ type: "close" });
                    }}
                >
                    Close
                </button>
                {state.matches("prompt") && (
                    <div className="step">
                        <h2>How was your experience?</h2>
                        <button className="button" onClick={() => send({ type: "feedback.good" })}>
                            Good
                        </button>
                        <button className="button" onClick={() => send({ type: "feedback.bad" })}>
                            Bad
                        </button>
                    </div>
                )}

                {state.matches("submitting") && (
                    <div className="step">
                        <h2>Submitting...</h2>
                    </div>
                )}

                {state.matches("error") && (
                    <div className="step">
                        <h2>Something went wrong...</h2>
                    </div>
                )}

                {state.matches("thanks") && (
                    <div className="step">
                        <h2>Thanks for your feedback.</h2>
                        {state.context.feedback.length > 0 && <p>{state.context.receivedFeedback ?? "---"}</p>}
                    </div>
                )}

                {state.matches("form") && (
                    <div className="step">
                        <form
                            className="step"
                            onSubmit={(ev) => {
                                ev.preventDefault();
                                send({
                                    type: "submit",
                                });
                            }}
                        >
                            <h2>What can we do better?</h2>
                            <button
                                onClick={() =>
                                    send({
                                        type: "feedback.reset",
                                    })
                                }
                            >
                                Reset
                            </button>
                            <textarea
                                name="feedback"
                                rows={4}
                                placeholder="So many things..."
                                value={state.context.feedback}
                                onChange={(ev) => {
                                    send({
                                        type: "feedback.update",
                                        value: ev.target.value,
                                    });
                                }}
                            />
                            <button className="button" disabled={!state.can({ type: "submit" })}>
                                Submit
                            </button>
                            <button
                                className="button"
                                onClick={() =>
                                    send({
                                        type: "back",
                                    })
                                }
                            >
                                Back
                            </button>
                        </form>
                    </div>
                )}

                {JSON.stringify(state)}
            </div>
        </>
    );
};

export default Home;
