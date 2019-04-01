import { ethers } from "ethers";
import { BigNumber } from "ethers/utils";

import * as UniswapExchangeArtifact from "@joincivil/artifacts/v1/UniswapExchange.json";
import * as UniswapFactoryArtifact from "@joincivil/artifacts/v1/UniswapFactory.json";
import * as CVLTokenArtifact from "@joincivil/artifacts/v1/CVLToken.json";

// const ALLOWED_SLIPPAGE = 0.025;
// const TOKEN_ALLOWED_SLIPPAGE = 0.04;

export class UniswapService {
  private signer: ethers.Signer | undefined;
  private networkID: number;
  private factory: ethers.Contract;
  private exchange: ethers.Contract;
  private token: ethers.Contract;
  private provider: ethers.providers.Provider;
  public constructor(provider: ethers.providers.Provider, signer: ethers.Signer | undefined, networkID: number) {
    this.provider = provider;
    this.networkID = networkID;
    if (!(CVLTokenArtifact as any).networks[this.networkID]) {
      throw new Error("unsupported network: " + this.networkID);
    }
    const exchangeAddress = (UniswapExchangeArtifact as any).networks[this.networkID].address;
    const cvlAddress = (CVLTokenArtifact as any).networks[this.networkID].address;
    const factoryAddress = (UniswapFactoryArtifact as any).networks[this.networkID].address;
    this.factory = new ethers.Contract(factoryAddress, (UniswapFactoryArtifact as any).abi, provider);

    this.exchange = new ethers.Contract(exchangeAddress, (UniswapExchangeArtifact as any).abi, provider);

    this.token = new ethers.Contract(cvlAddress, (CVLTokenArtifact as any).abi, provider);
    this.signer = signer;
    if (signer) {
      this.factory = this.factory.connect(signer);
      this.exchange = this.exchange.connect(signer);
      this.token = this.token.connect(signer);
    }
  }

  public createExchange(): any {
    const cvlAddr = (CVLTokenArtifact as any).networks[this.networkID].address;

    return this.factory.createExchange(cvlAddr);
  }

  public async priceToBuyCVL(tokensToBuy: BigNumber): Promise<BigNumber> {
    // Buy ERC20 with ETH

    const outputAmount = tokensToBuy;
    const inputReserve = await this.provider.getBalance(this.exchange.address);
    const outputReserve = await this.token.balanceOf(this.exchange.address);

    // Cost
    const numerator = outputAmount.mul(inputReserve).mul(1000);
    const denominator = outputReserve.sub(outputAmount).mul(997);
    const etherToPay = numerator.div(denominator).add(1);

    return etherToPay;
  }
  public async quoteETHToCVL(etherToSpend: BigNumber): Promise<BigNumber> {
    // Sell ETH for ERC20
    const inputAmount = etherToSpend;
    const inputReserve = await this.provider.getBalance(this.exchange.address);
    const outputReserve = await this.token.balanceOf(this.exchange.address);

    // Output amount bought
    const numerator = inputAmount.mul(outputReserve).mul(997);
    const denominator = inputReserve.mul(1000).add(inputAmount.mul(997));
    const cvlToReceive = numerator.div(denominator);

    return cvlToReceive;
  }

  // returns the amount of ETH (in wei) you would receive if you sold `cvlToSell` CVL (in wei)
  public async quoteCVLToETH(cvlToSell: BigNumber): Promise<BigNumber> {
    // Sell CVL for ETH
    const inputAmount = cvlToSell;
    const inputReserve = await this.token.balanceOf(this.exchange.address);
    const outputReserve = await this.provider.getBalance(this.exchange.address);

    // Output amount bought
    const numerator = inputAmount.mul(outputReserve).mul(997);
    const denominator = inputReserve.mul(1000).add(inputAmount.mul(997));
    const ethToReceive = numerator.div(denominator);

    return ethToReceive;
  }

  public async approvedSellAmountForAddress(address: string): Promise<BigNumber> {
    return this.token.allowance(address, this.exchange.address);
  }

  public async getApprovedSellAmount(): Promise<BigNumber> {
    if (!this.signer) {
      throw new Error("no signer on UniswapService");
    }
    const address = await this.signer.getAddress();
    return this.token.allowance(address, this.exchange.address);
  }

  public async setApprovedSellAmount(amount: BigNumber): Promise<BigNumber> {
    return this.token.approve(this.exchange.address, amount);
  }

  public async executeETHToCVL(ethToSpend: BigNumber, minTokensToReceive: BigNumber): Promise<void> {
    console.log("executeETHToCVL", ethers.utils.formatEther(ethToSpend), ethers.utils.formatEther(minTokensToReceive));
    const deadline = await this.getBlockDeadline();
    console.log("block deadline: ", deadline);
    const overrides = {
      value: ethToSpend,
      gasLimit: 100000,
    };

    return this.exchange.ethToTokenSwapInput(
      // TODO: price might move before mined
      // tokens are in WEI, so make sure slippage relevative to ether amount
      // minTokensToReceive.mul(1 - TOKEN_ALLOWED_SLIPPAGE),
      minTokensToReceive,
      deadline,
      overrides,
    );
  }

  public async executeCVLToETH(cvlToSpend: BigNumber, minETHToReceive: BigNumber): Promise<any> {
    const deadline = await this.getBlockDeadline();
    console.log(
      "executeCVLToETH",
      ethers.utils.formatEther(cvlToSpend),
      minETHToReceive.toString(),
      deadline.toString(),
    );

    const overrides = {
      gasLimit: 100000,
    };
    return this.exchange.tokenToEthSwapInput(cvlToSpend, minETHToReceive, deadline, overrides);
  }

  public parseEther(amount: string): BigNumber {
    return ethers.utils.parseEther(amount);
  }
  public weiToEtherNumber(amount: BigNumber): number {
    const etherAmountString = ethers.utils.formatEther(amount);
    const etherAmountNumber = Number.parseFloat(etherAmountString);
    return Math.round(etherAmountNumber * 1000) / 1000;
  }

  private async getBlockDeadline(): Promise<number> {
    const deadline = 600;
    const blockNumber = await this.provider.getBlockNumber();
    if (!blockNumber && blockNumber !== 0) {
      throw new Error("invalid block number");
    }

    const block = await this.provider.getBlock(blockNumber);
    if (!block) {
      throw new Error("invalid block");
    }

    return block.timestamp + deadline;
  }
}
