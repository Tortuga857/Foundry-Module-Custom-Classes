import { MODULE_ID, SETTINGS } from "./Consts.js";

export class MrResettiModuleSettings {

    static registerSettings() {
        game.settings.register(MODULE_ID, SETTINGS.TOOLTIPS, {
            name: "Tool tips",
            hint: "Show chat messages for how to use features",
            scope: "client",   // "world" = GM controlled, "client" = per player
            config: true,
            type: Boolean,
            default: true
        });
    }

    static getIsTooltipsEnabled() {
        return game.settings.get(MODULE_ID, SETTINGS.TOOLTIPS);
    }

}