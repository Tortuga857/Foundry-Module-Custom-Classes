export const MODULE_ID = "mrresetti-custom-classes";
export const MODULE_DISPLAY_NAME = "MrResetti Module";

export const HOOKS = {
    PRE_ROLL_ATTACK: "dnd5e.preRollAttackV2",
    PRE_DAMAGE_ROLL: "dnd5e.preRollDamageV2",
    PRE_ACTIVATE_ACTIVITY: "dnd5e.preUseActivity",
    POST_ACTIVATE_ACTIVITY: "dnd5e.postUseActivity",
    MODIFY_TOKEN_ATTRIBUTES: "modifyTokenAttribute",
    CALCULATE_DAMAGE: "dnd5e.calculateDamage",
    CREATE_ACTIVATE_EFFECT: "createActiveEffect",
    PRE_APPLY_DAMAGE: "dnd5e.preApplyDamage"
};

export const HEXBLADE = {
    SUBCLASS_NAME: "Hexblade",
    SUBCLASS_TYPE: "subclass",
    CURSE_EFFECT_NAME: "Hexblade Cursed",
    CURSE_EFFECT_APPLY: "Apply Hexblade Cursed",
    CURSE_CRIT_THRESHOLD: 19
};

export const ATTACK_TYPES = {
    MELEE: "melee"
};

export const SETTINGS = {
    TOOLTIPS: "toolTips"
};
