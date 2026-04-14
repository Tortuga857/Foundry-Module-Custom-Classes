import { HEXBLADE, ATTACK_TYPES, HOOKS, MODULE_ID } from "./Consts.js";
import { MrResettiUtils } from "./utils.js"

export class HexbladeWarlock {
  static register() {
    console.log("MrResetti Hexblade warlock hooked")
    Hooks.on(HOOKS.PRE_ROLL_ATTACK, HexbladeWarlock._checkForAttackRollHexbladeCurseFeatureEffects);
    Hooks.on(HOOKS.PRE_DAMAGE_ROLL, HexbladeWarlock._checkForDamageRollHexbladeCurseFeatureEffects);
    Hooks.on(HOOKS.PRE_APPLY_DAMAGE, HexbladeWarlock._checkForHexbladeCursedDeath);
    Hooks.on(HOOKS.PRE_APPLY_DAMAGE, HexbladeWarlock._checkForRemoveCurseIfWarlockDowned);

  }

  static _checkForAttackRollHexbladeCurseFeatureEffects(config, dialog, message) {
    const warlock = HexbladeWarlock._getActor(message);
    if (!warlock || !warlock.isOwner) return true;
    if (!HexbladeWarlock._isActorHexbladeSubclass(warlock)) return true;
    if (!HexbladeWarlock._isMeleeAttack(config)) return true;

    //CONFIG.Dice.randomUniform = () => 0.05  // forces d20 to roll 19


    const target = [...game.user.targets][0];
    const targetActor = target?.actor;
    if (!targetActor) { // is a target currently selected
      MrResettiUtils.createTooltipChatMessage("If I'm attacking a hexblade cursed creature, I need to make sure I hover over my target and press \"T\" to target it before rolling.")
      return true;
    }

    // check if a target is hexed
    if (!HexbladeWarlock._isActorHexedByActor(warlock, targetActor)) {
      return true;
    }


    config.rolls[0].options.criticalSuccess = Math.min(config.rolls[0].options.criticalSuccess, 19); // don't raise to 19 if below 19 from other effects
    MrResettiUtils.createTooltipChatMessage("Hexblade's Curse: Critical hit threshold reduced to 19!")

    return true;
  }

  static _checkForDamageRollHexbladeCurseFeatureEffects(config, dialog, message) {
    const warlock = HexbladeWarlock._getActor(message);
    if (!warlock || !warlock.isOwner) return true;
    if (!HexbladeWarlock._isActorHexbladeSubclass(warlock)) return true;
    if (!HexbladeWarlock._isMeleeAttack(config)) return true;

    // check if a target is hexed
    const target = [...game.user.targets][0];
    const targetActor = target?.actor; // is a target currently selected
    if (!targetActor) { // is a target currently selected
      MrResettiUtils.createTooltipChatMessage("If I'm attacking a hexblade cursed creature, I need to make sure I hover over my target and press \"T\" to target it before rolling.")
      return true;
    }

    if (!HexbladeWarlock._isActorHexedByActor(warlock, targetActor)) {
      return true;
    }

    config.rolls[0].parts.push("@prof")
    MrResettiUtils.createTooltipChatMessage("Target is hexed by you, added proficiency modifier to damage roll!");

  }

  static _checkForHexbladeCursedDeath(cursedActor, dialog, message) {
    if (!game.user.isGM) return true;

    if (!HexbladeWarlock._isActorHexed(cursedActor)) return true;
    const cursedBy = HexbladeWarlock._getActorWhoHexed(cursedActor);
    if (!HexbladeWarlock._isActorHexbladeSubclass(cursedBy)) return true;
    if (!HexbladeWarlock._isActorHexedByActor(cursedBy, cursedActor)) return true;

    if(cursedActor.system.attributes.hp.value > dialog) {
      return true; //actor isn't going to die, so exit
    }
    // remove the curse if the target is incapacitated
    const curse = cursedActor.effects.find(e => e.name === HEXBLADE.CURSE_EFFECT_NAME);
    curse?.delete();

    // if warlock isn't downed, give hp
    if (cursedBy.system.attributes.hp.value > 0) {

    }

    const warlockLevel = cursedBy.classes["warlock"].system.levels;
    const chaMod = cursedBy.system.abilities.cha.mod;
    const healAmount = warlockLevel + chaMod;

    cursedBy.applyDamage(-healAmount);

    MrResettiUtils.createTooltipChatMessage("Warlock was healed");

  }

    static _checkForRemoveCurseIfWarlockDowned(cursedActor, dialog, message) {

    }

  static _checkPreconditions(config, message) {
    const actor = HexbladeWarlock._getActor(message);
    if (!actor) return true;

    if (!HexbladeWarlock._isActorHexbladeSubclass(actor)) return true;
    if (!HexbladeWarlock._isMeleeAttack(config)) return true;

    return false;
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

  static _isActorHexed(targetActor) {
    return targetActor?.effects.some(e => e.name === HEXBLADE.CURSE_EFFECT_NAME && !e.disabled)
  }

  static _isActorHexedByActor(warlockActor, cursedActor) {
    const curse = cursedActor.effects.find(e => e.name === HEXBLADE.CURSE_EFFECT_NAME);
    if (!curse) return false;
    const cursedBy = curse.origin.split(".")[1];
    return warlockActor.id === cursedBy;
  }

  static _getActorWhoHexed(cursedActor) {
    const curse = cursedActor.effects.find(e => e.name === HEXBLADE.CURSE_EFFECT_NAME);
    if (!curse) return undefined;
    const cursedBy = curse.origin.split(".")[1];
    return game.actors.get(cursedBy);
  }
}

/* run in console to report hooks
const _orig = Hooks.call.bind(Hooks);
Hooks.call = function(hook, ...args) {
    if (/roll/i.test(hook)) console.log("Hook fired:", hook, args);
    return _orig(hook, ...args);
};
*/