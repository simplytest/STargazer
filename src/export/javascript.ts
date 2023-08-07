import { escape, format, options_t } from ".";
import { entry_t } from "../vault";

function selenium({ folder }: options_t)
{
    const variable = ({ name, selector, description }: entry_t) =>
    {
        const type = selector.startsWith("//") ? "xpath" : "css";
        const comment = description ? ` // ${description}` : "";

        return `${name} = By.${type}("${escape(selector)}");${comment}`;
    };

    return format(`class ${folder.name} 
    {
        ${folder.children.map(variable).join("\n")}

        constructor(driver)
        {
            this.driver = driver;
        }
    }`);
}

function playwright({ folder }: options_t)
{
    const initialization = ({ name, selector }: entry_t) =>
    {
        return `this.${name} = page.locator("${escape(selector)}");`;
    };

    return format(`class ${folder.name} 
    {
        constructor(page)
        {
            this.page = page;
            ${folder.children.map(initialization).join("\n")}
        }
    }`);
}

export default function to_javascript(options: options_t)
{
    const { framework } = options;

    if (framework === "playwright")
    {
        return playwright(options);
    }

    return selenium(options);
}