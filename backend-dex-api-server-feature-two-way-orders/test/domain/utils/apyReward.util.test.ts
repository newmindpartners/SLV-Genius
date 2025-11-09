import {calculateStakeVaultReward} from '~/domain/utils/apyReward.util';

// All values (rewards, API, principal) are coming from this doc:
// https://docs.google.com/spreadsheets/d/1OByah41AoBGJLS-yl7wNR6510Wx6YDlDGIG4Yl6XNbQ/edit?pli=1#gid=0

// We made the precision as 7 digits in the doc, to make sure
// that we are flooring the values but not rounding them to the nearest

const stringToDate = (dateString: string) => {
  const dateParts = dateString.split('/');
  return new Date(+dateParts[2], Number(dateParts[1]) - 1, +dateParts[0]);
};

describe('calculateStakeVaultReward', () => {
  const principal = BigInt(1000 * 1000000);
  const APY = 0.1;

  it('calculates total reward for date 05/01/2023', () => {
    const startDate = stringToDate('01/01/2023');
    const currentDate = stringToDate('05/01/2023');
    const elapsedTime = currentDate.getTime() - startDate.getTime();
    const reward = Math.floor(1045040.8);
    expect(calculateStakeVaultReward(principal, APY, elapsedTime)).toEqual(
      BigInt(reward)
    );
  });

  it('calculates total reward for date 02/01/2023', () => {
    const startDate = stringToDate('01/01/2023');
    const currentDate = stringToDate('02/01/2023');
    const elapsedTime = currentDate.getTime() - startDate.getTime();
    const reward = Math.floor(261157.8);
    expect(calculateStakeVaultReward(principal, APY, elapsedTime)).toEqual(
      BigInt(reward)
    );
  });

  it('calculates total reward for date 20/01/2023', () => {
    const startDate = stringToDate('01/01/2023');
    const currentDate = stringToDate('20/01/2023');
    const elapsedTime = currentDate.getTime() - startDate.getTime();
    const reward = Math.floor(4973679.7);
    expect(calculateStakeVaultReward(principal, APY, elapsedTime)).toEqual(
      BigInt(reward)
    );
  });

  it('calculates total reward for date 11/02/2023', () => {
    const startDate = stringToDate('01/01/2023');
    const currentDate = stringToDate('11/02/2023');
    const elapsedTime = currentDate.getTime() - startDate.getTime();
    const reward = Math.floor(10763590.1);
    expect(calculateStakeVaultReward(principal, APY, elapsedTime)).toEqual(
      BigInt(reward)
    );
  });

  it('calculates total reward for date 14/02/2023', () => {
    const startDate = stringToDate('01/01/2023');
    const currentDate = stringToDate('14/02/2023');
    const elapsedTime = currentDate.getTime() - startDate.getTime();
    const reward = Math.floor(11555703.5);
    expect(calculateStakeVaultReward(principal, APY, elapsedTime)).toEqual(
      BigInt(reward)
    );
  });

  it('calculates total reward for date 20/03/2023', () => {
    const startDate = stringToDate('01/01/2023');
    const currentDate = stringToDate('20/03/2023');
    const elapsedTime = currentDate.getTime() - startDate.getTime();
    const reward = Math.floor(20576490.97);
    expect(calculateStakeVaultReward(principal, APY, elapsedTime)).toEqual(
      BigInt(reward)
    );
  });

  it('calculates total reward for date 31/12/2023', () => {
    const startDate = stringToDate('01/01/2023');
    const currentDate = stringToDate('31/12/2023');
    const elapsedTime = currentDate.getTime() - startDate.getTime();
    const reward = 99712801;
    expect(calculateStakeVaultReward(principal, APY, elapsedTime)).toEqual(
      BigInt(reward)
    );
  });

  it('calculates total reward for date 01/01/2024', () => {
    const startDate = stringToDate('01/01/2023');
    const currentDate = stringToDate('01/01/2024');
    const elapsedTime = currentDate.getTime() - startDate.getTime();
    const reward = 100000000;
    expect(calculateStakeVaultReward(principal, APY, elapsedTime)).toEqual(
      BigInt(reward)
    );
  });

  it('calculates total reward for date 0', () => {
    const reward = 0;
    expect(calculateStakeVaultReward(principal, APY, 0)).toEqual(
      BigInt(reward)
    );
  });

  it('calculates total reward for principal 0', () => {
    const reward = 0;
    expect(calculateStakeVaultReward(BigInt(0), APY, 172800)).toEqual(
      BigInt(reward)
    );
  });

  it('calculates total reward for APY 0', () => {
    const reward = 0;
    expect(calculateStakeVaultReward(principal, 0, 172800)).toEqual(
      BigInt(reward)
    );
  });

  it('calculates total reward for negative APY', () => {
    const reward = 0;
    expect(calculateStakeVaultReward(principal, -10, 172800)).toEqual(
      BigInt(reward)
    );
  });
});
