import { readFileSync } from "fs";
import { JSDOM } from "jsdom";
import path from "path";
import { generator } from "../src/generator";
import { setup, set_inspected } from "./setup";

const html = readFileSync(path.join(__dirname, "netflix.html")).toString();
const { window } = new JSDOM(html);

describe("Netflix", () =>
{
    beforeAll(() =>
    {
        setup(window.document);
    });

    it("Selectors for Language-Select", async () =>
    {
        set_inspected(window.document.querySelector("#lang-switcher-select"));

        const selectors = await generator.generate();
        const top = selectors.slice(0, 3);

        expect(top.findIndex(x => x.selector === "[data-uia=\"language-picker\"]")).toBeGreaterThan(-1);
        expect(top.findIndex(x => x.selector === "#lang-switcher-select")).toBeGreaterThan(-1);
    });

    it("Selectors for Step-Indicator", async () =>
    {
        set_inspected(window.document.querySelector(".stepIndicator :nth-child(1)"));

        const selectors = await generator.generate();
        const top = selectors.slice(0, 3);

        expect(top.findIndex(x => x.selector === ".stepIndicator :nth-child(1)")).toBeGreaterThan(-1);
    });

    it("Selectors for Continue-Button", async () =>
    {
        set_inspected(window.document.querySelector("[data-uia=\"continue-button\"]"));

        const selectors = await generator.generate();
        const top = selectors.slice(0, 3);

        expect(top.findIndex(x => x.selector === "[data-uia=\"continue-button\"]")).toBeGreaterThan(-1);
    });
});
