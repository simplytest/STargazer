import { escape, format, options_t, sanitize } from ".";
import { entry_t } from "../vault";

function selenium({ folder }: options_t)
{
    const variable = ({ name, selector, description }: entry_t) =>
    {
        const type = selector.startsWith("//") ? "xpath" : "css";
        const comment = description ? ` // ${description}` : "";

        return `private By ${name} = By.${type}("${escape(selector)}");${comment}`;
    };

    return format(`public class ${folder.name} 
    {
        private WebDriver driver;
        ${folder.children.map(variable).join("\n")}

        public ${folder.name}(WebDriver driver)
        {
            this.driver = driver;
        }
    }`);
}

function playwright({ folder }: options_t)
{
    const declaration = ({ name }: entry_t) =>
    {
        return `private final Locator ${name};`;
    };

    const initialization = ({ name, selector }: entry_t) =>
    {
        return `this.${name} = page.locator("${escape(selector)}");`;
    };

    return format(`public class ${folder.name} 
    {
        private final Page page;
        ${folder.children.map(declaration).join("\n")}
        
        public ${folder.name}(Page page)
        {
            this.page = page;
            ${folder.children.map(initialization).join("\n")}
        }
    }`);
}

export default function to_java(options: options_t)
{
    const { framework } = options;
    options = sanitize(options);

    if (framework === "playwright")
    {
        return playwright(options);
    }

    return selenium(options);
}