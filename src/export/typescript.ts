import { escape, format, options_t } from ".";
import { entry_t } from "../vault";

function selenium({ folder }: options_t)
{
    const variable = ({ name, selector, description }: entry_t) =>
    {
        const type = selector.startsWith("//") ? "xpath" : "css";
        const comment = description ? ` // ${description}` : "";

        return `private ${name} = By.${type}("${escape(selector)}");${comment}`;
    };

    return format(`export class ${folder.name} 
    {
        private driver: WebDriver;
        ${folder.children.map(variable).join("\n")}

        constructor(driver)
        {
            this.driver = driver;
        }
    }`);
}

function playwright({ folder }: options_t)
{
    const declaration = ({ name }: entry_t) =>
    {
        return `private readonly ${name}: Locator;`;
    };

    const initialization = ({ name, selector }: entry_t) =>
    {
        return `this.${name} = page.locator("${escape(selector)}");`;
    };

    return format(`export class ${folder.name} 
    {
        private readonly page: Page;
        ${folder.children.map(declaration).join("\n")}

        constructor(page: Page)
        {
            this.page = page;
            ${folder.children.map(initialization).join("\n")}
        }
    }`);
}

export default function to_typescript(options: options_t)
{
    const { framework } = options;

    if (framework === "playwright")
    {
        return playwright(options);
    }

    return selenium(options);
}