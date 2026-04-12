import { MrResettiModuleSettings } from "./moduleSettings.js"


export class MrResettiUtils {
    static getActorFromId(actorId) {
    return game.actors.get(actorId);
  }

  static createTooltipChatMessage(message) {
        if (MrResettiModuleSettings.getIsTooltipsEnabled()) {
          const entireMessage = message + "<br><br> (If you don't like these messages, they can be disabled in Game Settings -> Game Settings -> MrResetti module -> tool tips Off)"
          ChatMessage.create({
            content: entireMessage ,
            speaker: ChatMessage.getSpeaker({ actor: game.user })
          });
        }
  }
}