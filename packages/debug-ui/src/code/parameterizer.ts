import { Civil, ParamProp } from "@joincivil/core";
import * as marked from "marked";
import BigNumber from "bignumber.js";
import { deployNewsroom } from "../../scripts/deploy-newsroom";
import { proposeReparameterization } from "../../scripts/parameterizerActions";
import { initializeDebugUI } from "../../scripts/civilActions";

initializeDebugUI(async civil => {
  setParameterizerListeners();
  const tcr = await civil.tcrSingletonTrusted();
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
  ];

  keys.forEach(async k => {
    const value = await parameterizer.getParameterValue(k);
    document.getElementById("parameterValues")!.innerHTML += "<br>" + k + ": " + value;
  });

  parameterizer.paramPropsInApplicationPhase().subscribe(args => updateSectionWithParamProps("propApplications", args));
  parameterizer
    .paramPropsInChallengeCommitPhase()
    .subscribe(args => updateSectionWithParamProps("challengedCommitProps", args));
  parameterizer
    .paramPropsInChallengeRevealPhase()
    .subscribe(args => updateSectionWithParamProps("challengedRevealProps", args));
  parameterizer.paramPropsToProcess().subscribe(args => updateSectionWithParamProps("propsToBeUpdated", args));
  parameterizer
    .paramPropsForResolvedChallenged()
    .subscribe(args => updateSectionWithParamProps("completedChallenges", args));
});

function updateSectionWithParamProps(section: string, paramProp: ParamProp): void {
  let html =
    "<br><a href='../prop.html?id=" + paramProp.propID + "'>" + paramProp.paramName + " -> " + paramProp.proposedValue;
  if (paramProp.pollID) {
    html += " (" + paramProp.pollID! + ")";
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
