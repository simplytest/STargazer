import manifest from "../../manifest.json";
import preval from "preval.macro";

const BUILD_TIME = preval`
const format = new Intl.DateTimeFormat("de" , {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
});
module.exports = format.format(new Date());
`;

class Meta
{
    version()
    {
        return manifest.version;
    }

    build()
    {
        return BUILD_TIME as string;
    }
}

export const meta = new Meta();