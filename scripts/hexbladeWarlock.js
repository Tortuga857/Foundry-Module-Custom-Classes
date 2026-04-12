import { HEXBLADE, ATTACK_TYPES, HOOKS } from "./Consts.js";
import { MrResettiUtils } from "./utils.js"

export class HexbladeWarlock {
  static register() {
    console.log("MrResetti Hexblade warlock hooked")
    Hooks.on(HOOKS.PRE_ROLL_ATTACK, HexbladeWarlock._checkForAttackRollHexbladeCurseFeatureEffects);
    Hooks.on(HOOKS.PRE_DAMAGE_ROLL, HexbladeWarlock._checkForDamageRollHexbladeCurseFeatureEffects);
  }

  static _checkForAttackRollHexbladeCurseFeatureEffects(config, dialog, message) {

    if (HexbladeWarlock._checkPreconditions(config, dialog, message)) return true;

    CONFIG.Dice.randomUniform = () => 0.05  // forces d20 to roll 19

    // check if a target is hexed
    const target = [...game.user.targets][0];
    const targetActor = target?.actor; // is a target currently selected
    if (!targetActor) { // is a target currently selected
      MrResettiUtils.createTooltipChatMessage("If I'm attacking a hexblade cursed creature, I need to make sure I hover over my target and press \"T\" to target it before rolling.")
      return true;
    }

    if (!HexbladeWarlock._isActorHexed(targetActor)) {
      return true;
    }


    config.rolls[0].options.criticalSuccess = Math.min(config.rolls[0].options.criticalSuccess, 19); // don't raise to 19 if below 19 from other effects
    MrResettiUtils.createTooltipChatMessage("Hexblade's Curse: Critical hit threshold reduced to 19!")

    return true;
  }

  static _checkForDamageRollHexbladeCurseFeatureEffects(config, dialog, message) {

    if (HexbladeWarlock._checkPreconditions(config, dialog, message)) return true;

    CONFIG.Dice.randomUniform = () => 0.05  // forces d20 to roll 19

    // check if a target is hexed
    const target = [...game.user.targets][0];
    const targetActor = target?.actor; // is a target currently selected
    if (!targetActor) { // is a target currently selected
      MrResettiUtils.createTooltipChatMessage("If I'm attacking a hexblade cursed creature, I need to make sure I hover over my target and press \"T\" to target it before rolling.")
      return true;
    }

    if (!HexbladeWarlock._isActorHexed(targetActor)) {
      return true;
    }


  }

  static _checkPreconditions(config, dialog, message) {
    const actor = HexbladeWarlock._getActor(message);
    if (!actor) return true;

    if (!HexbladeWarlock._isActorHexbladeSubclass(actor)) return true;

    if (!HexbladeWarlock._isMeleeAttack(config)) return true;
    if (!HexbladeWarlock._isAnyActorInstanceHexed()) return true;
  }

  static _getActor(message) {
    const actorId = message.data.speaker.actor;
    return game.actors.get(actorId);
  }

  static _isActorHexbladeSubclass(actor) {
    const hexbladeClass = actor.items.getName(HEXBLADE.SUBCLASS_NAME);
    return hexbladeClass?.type === 'subclass'; // check if hexblade exists on character and the type is subclass
  }

  static _isMeleeAttack(config) {
    return config.subject.attack.type.value === ATTACK_TYPES.MELEE;
  }

  static _isAnyActorInstanceHexed() {
    return canvas.tokens.placeables.some(t =>
      t.actor?.effects.some(e => e.name === HEXBLADE.CURSE_EFFECT_NAME && !e.disabled)
    )
  }

  static _isActorHexed(targetActor) {
    return targetActor?.effects.some(e => e.name === HEXBLADE.CURSE_EFFECT_NAME && !e.disabled)
  }
}

/* run in console to report hooks
const _orig = Hooks.call.bind(Hooks);
Hooks.call = function(hook, ...args) {
    if (/roll/i.test(hook)) console.log("Hook fired:", hook, args);
    return _orig(hook, ...args);
};
*/