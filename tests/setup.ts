import { picker } from "../src/client/picker";
import { storage } from "../src/extension/storage";
import { score } from "../src/generator/messages";
import { score as backend_score } from "../src/generator/scorer";
import { chain_t } from "../src/generator/selector";

jest.mock("../src/generator/messages");
jest.mock("../src/extension/storage");

const score_mocked = score as jest.MockedFunction<typeof score>;
score_mocked.mockImplementation(async (chains: chain_t[]) =>
{
    return chains.map(x => ({ score: backend_score(x), chain: x }));
});

const get_mocked = storage.get as jest.MockedFunction<(key: string) => Promise<any>>;
get_mocked.mockImplementation(async (key: string) =>
{
    switch (key)
    {
    case "selector-type":
        return "css";
    case "top-n":
        return 100;
    default:
        return undefined;
    }
});

export function set_inspected(inspected: HTMLElement)
{
    Object.defineProperty(global, "window", {
        value: {
            [picker.INSPECTED_ID]: inspected
        },
        writable: true
    });
}

export function setup(dom: Document)
{
    Object.defineProperty(global, "document", { value: dom });
}