import generateByAttributes from "./generators/attributes";
import generateByParent from "./generators/parent";

import { InspectedElement } from "./utils";

interface Result {
    selector: string;
    occurrences: number;
};

// TODO: Options setting!
interface Options {
    ignoreNames: boolean;
};

function getOccurrences(type: 'xpath', dom: Document, selector: string) {
    let rtn = 0;

    try {
        switch (type) {
            case 'xpath':
                rtn = dom.evaluate(selector, dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotLength;
                break;
        }
    } catch (error) {
        console.warn(`Encountered Error while checking occurrences: ${error}`);
    }

    return rtn;
}

async function generatePath(type: 'xpath', dom: Document, inspectedElement: InspectedElement): Promise<Result[]> {
    const selectors = [
        ...generateByAttributes(type, dom, inspectedElement),
        ...(await generateByParent(type, dom, inspectedElement)),
    ];

    return selectors.map(selector =>
        ({ selector, occurrences: getOccurrences(type, dom, selector) })
    )
        .filter(x => x.occurrences > 0)
        .sort((a, b) => a.selector.length - b.selector.length)
        .sort((a, b) => a.occurrences - b.occurrences);
}

export {
    Result,
    generatePath
};
