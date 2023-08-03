import { selector_t } from "../../../selector";
import { scores } from "../../scores";
import preval from "preval.macro";

const lower_words = preval`
const enwords = require("enwords");
const words = enwords.words.map(x => [x.toLowerCase(), undefined]);

module.exports = words;
`;

const to_test = [/^data.+$/, /^class$/, /^name$/, /^id$/];
const words = new Map(lower_words);
const exclude = ["ln"];

export default function (selector: selector_t)
{
    if (!("key" in selector))
    {
        return scores.worse;
    }

    if (!to_test.find(regex => selector.key.match(regex)))
    {
        return scores.neutral;
    }

    let rtn = 0;

    /*
    # Words that rapidly switch casing are considered bad
    */
    if (selector.value.search(/[a-zA-Z]+[0-9]+[a-zA-Z]+/g) !== -1)
    {
        rtn += scores.worst;
    }

    const text = selector.value.replace(/([A-Z-])/g, " $1").replace("-", " ");
    const text_words = text.split(" ");

    /*
    # Words that are one character long are also undesired
    */
    if (text_words.length > 1 && text_words.some(x => x.length === 1))
    {
        rtn += scores.worst;
    }

    const good_words = text_words.filter(word => word.length > 1 && !exclude.includes(word) && words.has(word.toLowerCase()));
    rtn += Math.min(good_words.length, 2) * scores.best;

    return rtn;
}