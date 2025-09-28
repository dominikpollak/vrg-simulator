import artillery from "../assets/images/artillery.png";
import infantry from "../assets/images/infantry.png";
import infantrySniper from "../assets/images/infantry_sniper.png";
import lightInfantry from "../assets/images/light_infantry.png";
import motorisedInfantry from "../assets/images/motorised_infantry.png";
import sniper from "../assets/images/sniper.png";

export const unitIconMap: Record<string, string> = {
  Artillery: artillery,
  Infantry: infantry,
  InfantrySniper: infantrySniper,
  LightInfantry: lightInfantry,
  MotorisedInfantry: motorisedInfantry,
  Sniper: sniper,
};

export const defaultIcon = infantry;
