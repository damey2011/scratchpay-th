import {register} from "ts-node"; // https://stackoverflow.com/a/65708470/6791750

register({
    project: "tsconfig.json",
});

export default async (): Promise<void> => {
    console.log("global teardown")
};
