import { escape, format, options_t } from ".";
import { entry_t } from "../vault";

function selenium({ folder }: options_t)
{
    const variable = ({ name, selector, description }: entry_t) =>
    {
        const type = selector.startsWith("//") ? "XPath" : "CSS";
        const comment = description ? ` // ${description}` : "";

        return `[FindsBy(How = How.${type}, Using = "${escape(selector)}")]
        private IWebElement ${name};${comment}`;
    };

    return format(`class ${folder.name} 
    {
        private IWebDriver driver;

        public ${folder.name}(IWebDriver driver)
        {
            this.driver = driver;
            PageFactory.initElements(driver, this);
        }

        ${folder.children.map(variable).join("\n")}
    }`);
}

function playwright({ folder }: options_t)
{
    const declaration = ({ name }: entry_t) =>
    {
        return `private readonly ILocator ${name};`;
    };

    const initialization = ({ name, selector }: entry_t) =>
    {
        return `this.${name} = page.Locator("${escape(selector)}");`;
    };

    return format(`class ${folder.name} 
    {
        private readonly IPage page;
        ${folder.children.map(declaration).join("\n")}
        
        public ${folder.name}(IPage page)
        {
            this.page = page;
            ${folder.children.map(initialization).join("\n")}
        }
    }`);
}

export default function to_csharp(options: options_t)
{
    const { framework } = options;

    if (framework === "playwright")
    {
        return playwright(options);
    }

    return selenium(options);
}