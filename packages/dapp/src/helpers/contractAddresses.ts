import { Dispatch } from "react-redux";
import { setContractAddress } from "../redux/actionCreators/contractAddresses";
import { CivilHelper } from "../apis/CivilHelper";

export enum ContractAddressKeys {
  TCR_ADDRESS = "TCR_ADDRESS",
  PLCR_ADDRESS = "PLCR_ADDRESS",
  TOKEN_ADDRESS = "TOKEN_ADDRESS",
  PARAMETERIZER_ADDRESS = "PARAMETERIZER_ADDRESS",
}

export async function initializeContractAddresses(helper: CivilHelper, dispatch: Dispatch<any>): Promise<void> {
  const tcr = await helper.getTCR();

  const tcrAddress = tcr.address;
  dispatch(setContractAddress(ContractAddressKeys.TCR_ADDRESS, tcrAddress));

  const votingAddress = await tcr.getVotingAddress();
  dispatch(setContractAddress(ContractAddressKeys.PLCR_ADDRESS, votingAddress));

  const tokenAddress = await tcr.getTokenAddress();
  dispatch(setContractAddress(ContractAddressKeys.TOKEN_ADDRESS, tokenAddress));

  const parameterizerAddress = await tcr.getParameterizerAddress();
  dispatch(setContractAddress(ContractAddressKeys.PARAMETERIZER_ADDRESS, parameterizerAddress));
}
