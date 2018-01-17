import { BaseContract } from "./base_contract";

export class BaseWrapper<InstanceType extends BaseContract> {
  protected instance: InstanceType;

  constructor(instance: InstanceType) {
    this.instance = instance;
  }

  public get address() {
    return this.instance.address;
  }
}
