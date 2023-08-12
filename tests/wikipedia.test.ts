import { readFileSync } from "fs";
import { JSDOM } from "jsdom";
import path from "path";
import { generator } from "../src/generator";
import { set_inspected, setup } from "./setup";

const html = readFileSync(path.join(__dirname, "wikipedia.html")).toString();
const { window } = new JSDOM(html);

describe("Wikipedia", () =>
{
    beforeAll(() =>
    {
        setup(window.document);
    });

    it("Selectors for Search-Input", async () =>
    {
        set_inspected(window.document.querySelector("#txtSearch"));

        const selectors = await generator.generate();
        const top = selectors.slice(0, 3);

        expect(top.findIndex(x => x.selector === "#txtSearch")).toBeGreaterThan(-1);
        expect(top.findIndex(x => x.selector === "[name=\"q\"]")).toBeGreaterThan(-1);
    });

    it("Selectors for Search-Icon", async () =>
    {
        set_inspected(window.document.querySelector(".search-icon"));

        const selectors = await generator.generate();
        const top = selectors.slice(0, 3);

        expect(top.findIndex(x => x.selector === ".search-icon")).toBeGreaterThan(-1);
    });

    it("Selectors for Logo", async () =>
    {
        set_inspected(window.document.querySelector(".wikipedia-logo a img"));

        const selectors = await generator.generate();
        const top = selectors.slice(0, 5);

        expect(top.findIndex(x => x.selector === "[src*=\"Wikipedia-logo-v2-de.svg\"]")).toBeGreaterThan(-1);
        expect(top.findIndex(x => x.selector === ".wikipedia-logo :nth-child(1) :nth-child(1)")).toBeGreaterThan(-1);
    });
});
