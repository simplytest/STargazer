import { picker } from "../../src/client/picker";
import { worker } from "../../src/client/worker";
import { scripting } from "../../src/extension/scripting";

chrome.devtools.panels.elements.onSelectionChanged.addListener(() =>
{
    scripting.execute_devtools(`window["${picker.INSPECTED_ID}"] = $0;`).then(() =>
    {
        worker.trigger_generator();
    });
});
