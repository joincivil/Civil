import latestTime from "./latestTime";

// Increases testrpc time by the passed duration in seconds
export default async function increaseTime(dur: number): Promise<any> {
  const id = Date.now();

  return new Promise((resolve, reject) => {
    web3.currentProvider.sendAsync(
      {
        jsonrpc: "2.0",
        method: "evm_increaseTime",
        params: [dur],
        id,
      },
      (err1: any) => {
        if (err1) {
          return reject(err1);
        }

        web3.currentProvider.sendAsync(
          {
            jsonrpc: "2.0",
            method: "evm_mine",
            id: id + 1,
          },
          (err2: any, res: any) => {
            return err2 ? reject(err2) : resolve(res);
          },
        );
      },
    );
  });
}

/**
 * Beware that due to the need of calling two separate testrpc methods and rpc calls overhead
 * it's hard to increase time precisely to a target point so design your test to tolerate
 * small fluctuations from time to time.
 *
 * @param target time in seconds
 */
export async function increaseTimeTo(target: number): Promise<any> {
  const now = await latestTime();
  if (target < now) {
    throw Error(`Cannot increase current time(${now}) to a moment in the past(${target})`);
  }
  const diff = target - now;
  return increaseTime(diff);
}

export const duration: any = {};
duration.seconds = (val: number): number => {
  return val;
};
duration.minutes = (val: number): number => {
  return val * duration.seconds(60);
};
duration.hours = (val: number): number => {
  return val * duration.minutes(60);
};
duration.days = (val: number): number => {
  return val * duration.hours(24);
};
duration.weeks = (val: number): number => {
  return val * duration.days(7);
};
duration.years = (val: number): number => {
  return val * duration.days(365);
};
