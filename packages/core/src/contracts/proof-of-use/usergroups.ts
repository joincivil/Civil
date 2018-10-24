import { EthApi } from "@joincivil/ethapi";
import { EthAddress } from "@joincivil/typescript-types";
import { CivilErrors } from "@joincivil/utils";
import { BigNumber } from "bignumber.js";
import { TwoStepEthTransaction } from "../../types";
import { BaseWrapper } from "../basewrapper";
import { UserGroupsContract } from "../generated/wrappers/user_groups";
import { createTwoStepSimple } from "../utils/contracts";

export interface UsedAndTotalTokens {
  usedTokens: BigNumber;
  totalTokens: BigNumber;
}

export interface GroupData {
  root: EthAddress;
  size: BigNumber;
}

export class UserGroups extends BaseWrapper<UserGroupsContract> {
  public static async singleton(ethApi: EthApi): Promise<UserGroups> {
    const instance = await UserGroupsContract.singletonTrusted(ethApi);
    if (!instance) {
      throw new Error(CivilErrors.UnsupportedNetwork);
    }
    return new UserGroups(ethApi, instance);
  }

  private constructor(ethApi: EthApi, instance: UserGroupsContract) {
    super(ethApi, instance);
  }

  public async getMaxGroupSize(): Promise<number> {
    return (await this.instance.maxGroupSize.callAsync()).toNumber();
  }

  public async getGroup(member: EthAddress): Promise<GroupData> {
    const [root, size] = await this.instance.find.callAsync(member);
    return {
      root,
      size,
    };
  }

  public async getMaxGroupSizeUpdateNonce(): Promise<number> {
    return (await this.instance.changeGroupSizeNonce.callAsync()).toNumber();
  }

  public async getUsedAndTotalTokens(groupMember: EthAddress): Promise<UsedAndTotalTokens> {
    const [usedTokens, totalTokens] = await this.instance.usedAndTotalTokensForGroup.callAsync(groupMember);
    return {
      usedTokens,
      totalTokens,
    };
  }

  public async setMaxGroupSize(size: number, signature: string): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(
      this.ethApi,
      await this.instance.setMaxGroupSize.sendTransactionAsync(new BigNumber(size), signature),
    );
  }

  public async forceUnion(a: EthAddress, b: EthAddress, signature: string): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.ethApi, await this.instance.forceUnion.sendTransactionAsync(a, b, signature));
  }

  public async allowGlobalGroupTransfers(who: EthAddress): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.ethApi, await this.instance.allowGlobalGroupTransfers.sendTransactionAsync(who));
  }

  public async allowInGroupTransfers(a: EthAddress, b: EthAddress): Promise<TwoStepEthTransaction> {
    return createTwoStepSimple(this.ethApi, await this.instance.allowInGroupTransfers.sendTransactionAsync(a, b));
  }
}
