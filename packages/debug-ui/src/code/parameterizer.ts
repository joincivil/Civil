import { Civil, ParamProp } from "@joincivil/core";
import * as marked from "marked";
import BigNumber from "bignumber.js";
import { deployNewsroom } from "../../scripts/deploy-newsroom";
import { proposeReparameterization } from "../../scripts/parameterizerActions";
import { initializeDebugUI } from "../../scripts/civilActions";
import { Parameterizer } from "../../../core/build/src/contracts/tcr/parameterizer";
let civilInstance: any;
initializeDebugUI(async civil => {
  civilInstance = civil;
  setParameterizerListeners();
  const tcr = await civilInstance.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  document.getElementById("parameterizerInfo")!.innerHTML +=
    "<br>Parameterizer: " + (await tcr.getParameterizerAddress());

  const keys = [
    "minDeposit",
    "pMinDeposit",
    "applyStageLen",
    "pApplyStageLen",
    "commitStageLen",
    "pCommitStageLen",
    "revealStageLen",
    "pRevealStageLen",
    "dispensationPct",
    "pDispensationPct",
    "voteQuorum",
    "pVoteQuorum",
    "pProcessBy",
    "challengeAppealLen",
    "challengeAppealCommitLen",
    "challengeAppealRevealLen",
  ];

  keys.forEach(async k => {
    const value = await parameterizer.getParameterValue(k);
    document.getElementById("parameterValues")!.innerHTML += "<br>" + k + ": " + value;
  });

  parameterizer
    .paramPropsInApplicationPhase()
    .subscribe((propID: string) => updateSectionWithParamProps("propApplications", propID));
  parameterizer
    .paramPropsInChallengeCommitPhase()
    .subscribe((propID: string) => updateSectionWithParamProps("challengedCommitProps", propID));
  parameterizer
    .paramPropsInChallengeRevealPhase()
    .subscribe((propID: string) => updateSectionWithParamProps("challengedRevealProps", propID));
  parameterizer
    .paramPropsToProcess()
    .subscribe((propID: string) => updateSectionWithParamProps("propsToBeUpdated", propID));
  parameterizer
    .paramPropsForResolvedChallenged()
    .subscribe((propID: string) => updateSectionWithParamProps("completedChallenges", propID));
});

async function updateSectionWithParamProps(section: string, propID: string): Promise<void> {
  const tcr = await civilInstance.tcrSingletonTrusted();
  const parameterizer = await tcr.getParameterizer();
  const prop = await parameterizer.getProposal(propID);
  let html = "<br><a href='../prop.html?id=" + propID + "'>" + prop.paramName + " -> " + prop.proposedValue;
  if (prop.pollID) {
    html += " (" + prop.pollID! + ")";
  }
  html += "</a>";
  document.getElementById(section)!.innerHTML += html;
}

function setParameterizerListeners(): void {
  const reparamButton = document.getElementById("param-proposeReparameterization")!;
  reparamButton.onclick = async event => {
    const parameterKey = (document.getElementById("param-paramKey")! as HTMLInputElement).value;
    const parameterValue = (document.getElementById("param-paramValue")! as HTMLInputElement).value;

    await proposeReparameterization(parameterKey, new BigNumber(parameterValue));
  };
}
