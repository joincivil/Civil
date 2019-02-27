// Returns the time of the last mined block in seconds
export default async function latestTime(): Promise<any> {
  return new Promise((resolve, reject) => {
    web3.eth.getBlock("latest", (error: any, result: any) => {
      if (error) {
        reject(error);
      }
      resolve(result.timestamp);
    });
  });
}
