import { createMachine } from "xstate";

export const myMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QAoC2BDAxgCwJYDswBKAOnwHsAXACXIDcwAnSAYgFkB5AVQGUBRDgDU+AJQDaABgC6iUAAdysXJVzl8skAA9EAWgCMAFhIA2U6b0B2CwE4JADgCs1gDQgAnogBME4ydMW9PQBmCwlDO2sggF8o1zQsPEJSbHomVk5eAS4AFUkZJBAFJRU1DW0EHU89EiDakNq7C2MHIIMgu1cPBFs-M1sHewdPIOsY2JAKCDgNeJwCYg0i5VV1AvL9CyNrawMA62GLTwNTTsQgkgGJK89PG0aLJ0aYuIw5pLIqWgZmCEXFZdKa0QemGNVqAwinjsxkCxlOCEMvjqQSGbVMVRCzxAs0SxBIKW+kD+xRWZV0IN8212en2ISOJ3cwOOYPBRyC6MMYyiQA */
    initial: "notHovered",
    states: {
        notHovered: {
            on: {
                MOUSEOVER: {
                    target: "hovered",
                },
            },
        },
        hovered: {
            on: {
                MOUSEOUT: {
                    target: "notHovered",
                },
            },
        },
    },
});
