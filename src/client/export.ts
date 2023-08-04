import { highlighter } from "./highlight";
import { picker } from "./picker";
import { sidebar } from "./sidebar";
import { worker } from "./worker";

global.highlighter = highlighter;
global.sidebar = sidebar;
global.picker = picker;
global.worker = worker;