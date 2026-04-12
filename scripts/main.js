import { MrResettiUtils } from "./utils.js";
import { HexbladeWarlock } from "./hexbladeWarlock.js";
import { MODULE_DISPLAY_NAME } from "./Consts.js";
import { MrResettiModuleSettings } from "./moduleSettings.js";

Hooks.once("init", () => {
  MrResettiModuleSettings.registerSettings();
});

Hooks.once("ready", () => {
  game.mrResettiModules = {
    utils: MrResettiUtils
  };

  // Register all hooks
  HexbladeWarlock.register();

  console.log(`${MODULE_DISPLAY_NAME} | Initializing`);
});