import { TextScorer } from "text-scorer";
import { InspectedElement } from "../utils";

const excludeList = [
    'jscontroller',
    'jsaction',
    'data-ved',
    'data-iml',
    'data-atf',
    'tabindex',
    'data-frt',
    'jsmodel',
    'jsname',
    'jsdata',
    'height',
    'xmlns',
    'width',
    'style',
    'class'
];

const textScorer = new TextScorer(true, {
    ignoreCase: true,
})

function byAttribute(prefix: string, attribute: string, value: string) {
    return [
        `${prefix}[${attribute} = "${value}"]`,
        `${prefix}[contains(${attribute}, "${value}")]`
    ];
}

export default function (type: 'xpath', dom: Document, inspectedElement: InspectedElement): string[] {
    const { innerText } = inspectedElement;
    const { node } = inspectedElement;

    const results: string[] = [];

    if (!node) {
        return results;
    }

    const tagName = node.tagName.toLowerCase();
    const attributes = node.getAttributeNames().filter(x => !excludeList.includes(x));

    for (const attribute of attributes) {
        results.push(...byAttribute("//*", `@${attribute}`, node.getAttribute(attribute)));
        tagName && results.push(...byAttribute(`//${tagName}`, `@${attribute}`, node.getAttribute(attribute)));
    }

    if (node.getAttributeNames().includes('class')) {
        const attribute = node.getAttribute('class');
        const classes = attribute.split(' ');

        for (const clazz of classes) {
            if (textScorer.getTextScore(clazz) < 0.08) {
                continue;
            }

            results.push(byAttribute("//*", `@class`, clazz)[1]);
            tagName && results.push(byAttribute(`//${tagName}`, `@class`, clazz)[1]);
        }
    }

    if (!innerText) {
        return results;
    }

    const snapshot = [...results];

    for (const result of snapshot) {
        const cResult = result.slice(0, -1);
        const textChecks = byAttribute("", "text()", innerText);

        for (const check of textChecks) {
            results.push(`${cResult} and ${check.substring(1)}`);
        }
    }

    results.push(...byAttribute("//*", "text()", innerText));
    tagName && results.push(...byAttribute(`//${tagName}`, "text()", innerText));

    return results;
};