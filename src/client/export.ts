import { highlighter } from "./highlight";
import { meta } from "./meta";
import { picker } from "./picker";
import { sidebar } from "./sidebar";
import { worker } from "./worker";

global.highlighter = highlighter;
global.sidebar = sidebar;
global.picker = picker;
global.worker = worker;
global.meta = meta;