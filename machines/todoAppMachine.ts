import { setup } from "xstate";

export const toDoMachine = setup({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgBsB7dCAqAFQoBEKBiS62h5gMXVzMgBtAAwBdRKAAOFWLgAuuCvgkgAnogDMAdgAsJAKwAaEAA9EAJh3CSWrcIAcG-fa0A2He-s6Avt+NosPEJSdhp8eiZWUM5IgGUAV0xMOFgRcSQQaVkFJRUzBEtrWwcnF3dPHWN1BB1tXz8QfAoIOBUAnAJiFSz5RWUM-IBaHXsqi2FXG2FzDVmtAE57efMARjdffwwO4JI5SIAZKhaIbple3IHx+ZIdZZ19fXmVkZ0V7TGEfRX7G4fHB3MgJW8w2IHaQWI5COMWYp2yfTyiGEH20en0oPBnRC0PCXAoAFEAE6EiiEuHnfqgfJrDQkYSPYT0tb6VyrLQfczzWn2VxLeZuFz2fSWereIA */
    types: {
        events: {} as { type: "loadingToDoSuccess"; todos: string[] } | { type: "loadingToDoFailed"; errorMessage: string },
    },
    actions: {
        consoleLogToDos: ({ event }) => {
            alert(JSON.stringify(event));
        },
    },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOgBsB7dCAqAFQoBEKBiS62h5gZQFdNMcWAG0ADAF1EoAA4VYuAC64K+KSAAeiAIwAOAGwkArDoDMJw1sOGA7AE5jW6wBoQAT0Q6tJLXt+-POgBMACzWhiYAvhEuaFh4hKTsNPj0TKxJnGkAYui4ZJBikkggsvJKKmqaCLoGxmYWVnYOzm7a1gZ2Pr4mnsG21iaBUdEg+BQQcGqxOATEaqWKyqrFVQC0ei7uCKuGJLb7+9bWwYGBonqBejqGUTEYMwnkVMmpzPNyixUriCeb2lqiEh6YJ1QLWUSBWyiHpDEbTeLEEgKNIAGWekHeZSWlR+oi81l0RzMx36gUMG1a1VEwRIp1sPhshmCwS09mCtxA8NmiWemWYAFEAE6CiiCzGfZagKrBPEkAk6IkmEnWMkUraOay0+l6cKkswQ6zDCJAA */
    initial: "loadingToDo",
    states: {
        loadingToDo: {
            on: {
                loadingToDoSuccess: { target: "toDoLoaded", actions: "consoleLogToDos" },
                loadingToDoFailed: { target: "loadingToDoError" },
            },
        },
        toDoLoaded: {},
        loadingToDoError: {},
    },
});
