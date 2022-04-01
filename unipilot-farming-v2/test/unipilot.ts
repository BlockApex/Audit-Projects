import { use } from "chai";
import { solidity } from "ethereum-waffle";

import { shouldBehaveLikeUnipilotFarm } from "./UnipilotFarm/unipilotFarm.behaviour";

use(solidity);

describe("Invokes Unipilot Farm Tests", async () => {
  await shouldBehaveLikeUnipilotFarm();
});
