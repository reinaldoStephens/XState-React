"use client";
import { useMachine } from "@xstate/react";
import { assign, createMachine, setup } from "xstate";
import type { NextPage } from "next";

const context = {
    feedback: "",
};

const feedbackMachine = setup({
    actions: {
        updateFeedback: assign({
            feedback: ({ event }) => {
                return event.value;
            },
        }),
        reset: assign(context),
    },
    guards: {
        feedbackValid: ({ context }) => {
            return context.feedback.trim().length > 0;
        },
    },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgAcAnAe1TIBcBiAMzEgCMsBrEqKqiANoAGALqJQZKrFx1cVfOJAAPRAGYA7ADYSAVgCMQgCzqhegByqzm1aoA0IAJ6IATAZJCPHvQE4L355o6ZgC+wfZoWHiEpJQ09MysEByY3ByCooqS0rLyiioIGtr6RibmltZ2joh6qnokmg0N6gF66r5WoeEYOATEJExUFKgMyZzCYkggWTJyCpP5hobaVkuL6m1BrvZOCGZ1eo2a3jrOQhY2zp0gET3R-YPDsACubKgy45lSM7nziJrGJEMZm8mj2QR0xkW20QwJIzh0nlqNUWlj0VxuUT6mAANlJIAwKHA6OgKHQPpNpjk5qB8noge5POZ1DZ1iZ1NDdt5dIYDkdvEJvOpDPzNKEwiB8Pw4IoMb0iJ9srM8ogALSaDkqnQkbw63V6vWqdHdTExai0OgK77U5QuHRa4qGfSOjxWcwc-nuHkNMweZyGDyqUXi2V3AZDS1U5UICF1IEgzTOMz6I7Mjmw9QIrynTQC-RGyJykh0bDofCceAUr6R34IDPqEgafR01SCoWC931zxeJY6DTOAL525Y3GwSARpU1wzOd1CT28n1CP0BoOhIA */
    context,
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
                "feedback.reset": {
                    actions: { type: "reset" },
                },
            },
        },
        form: {
            on: {
                "feedback.update": {
                    actions: { type: "updateFeedback" },
                },
                back: {
                    target: "prompt",
                },
                submit: {
                    guard: {
                        type: "feedbackValid",
                    },
                    target: "thanks",
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
        close: {
            target: ".closed",
        },
    },
});

const Home: NextPage = () => {
    const [state, send] = useMachine(feedbackMachine);

    return (
        <>
            <h1>Aprendiendo XState</h1>
            {state.hasTag("loading") && <div>Loading...</div>}

            <div className="feedback">
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

                {state.matches("thanks") && (
                    <div className="step">
                        <h2>Thanks for your feedback.</h2>
                        {state.context.feedback.length > 0 && <p>"{state.context.feedback}"</p>}
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
                            <textarea
                                name="feedback"
                                rows={4}
                                placeholder="So many things..."
                                onChange={(ev) => {
                                    send({
                                        type: "feedback.update",
                                        value: ev.target.value,
                                    });
                                }}
                            />
                            <p>{state.context.feedback}</p>
                            <button className="button" disabled={!state.can({ type: "submit" })}>
                                Submit
                            </button>
                            <button className="button">Back</button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default Home;
