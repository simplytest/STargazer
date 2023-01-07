import { getParentOfInspected, InspectedElement } from "../utils";
import getPrimitive from "./attributes";

export default async function (type: 'xpath', dom: Document, inspectedElement: InspectedElement): Promise<string[]> {
    const parent = await getParentOfInspected();
    const parentElement = parent.node!;
    const { node } = inspectedElement;
    const results: string[] = [];

    const children = Array.from(parentElement.children).filter(child => child.tagName === node.tagName);
    const index = children.indexOf(children.find(x => x.outerHTML === node.outerHTML));

    const parentTag = parentElement.tagName.toLowerCase();
    const tagName = inspectedElement.node!.tagName.toLowerCase();

    if (!parentElement) {
        return results;
    }

    const parentSelectors = getPrimitive(type, dom, parent);
    const selectors = getPrimitive(type, dom, inspectedElement);

    if (parentTag && index !== -1) {
        results.push(`//${parentTag}/${tagName}[${index + 1}]`);
    }

    if (parentSelectors.length === 0) {
        return results;
    }

    for (const selector of selectors) {
        results.push(`//${parentTag}${selector.substring(1)}`);
        results.push(`//${parentTag}${selector.substring(1)}[${index + 1}]`);
    }

    for (const parentSelector of parentSelectors) {
        if (tagName && index !== -1) {
            results.push(`${parentSelector}/${tagName}[${index + 1}]`);
        }

        for (const selector of selectors) {
            results.push(`${parentSelector}${selector.substring(1)}`);
        }
    }

    return results;
};