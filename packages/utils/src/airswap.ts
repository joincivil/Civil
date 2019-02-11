export const airswapScript = "https://cdn.airswap.io/gallery/airswap-trader.js";

export function getAirswapCvlAddress(network: string | number): string | undefined {
  let networkKey = network;
  if (typeof networkKey === "string") {
    networkKey = parseInt(networkKey, 10);
  }

  const airswapCvlAddress: { [index: number]: string } = {
    1: "",
    4: "0x3e39fa983abcd349d95aed608e798817397cf0d1",
  };

  return airswapCvlAddress[networkKey];
}

export function getAirswapEnv(network: string | number): string | undefined {
  let networkKey = network;
  if (typeof networkKey === "string") {
    networkKey = parseInt(networkKey, 10);
  }

  const airswapEnv: { [index: number]: string } = {
    1: "production",
    4: "sandbox",
  };

  return airswapEnv[networkKey];
}
