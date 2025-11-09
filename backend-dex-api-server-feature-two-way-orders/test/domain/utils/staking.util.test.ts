import {calcMonthsToDays} from '~/domain/utils/staking.util';

describe('calcMonthsToDays', () => {
  it('returns expected days for a given month input', () => {
    const daysIn0Month = calcMonthsToDays(0);
    const daysIn1Month = calcMonthsToDays(1);
    const daysIn2Month = calcMonthsToDays(2);
    const daysIn3Month = calcMonthsToDays(3);
    const daysIn4Month = calcMonthsToDays(4);
    const daysIn5Month = calcMonthsToDays(5);
    const daysIn6Month = calcMonthsToDays(6);
    const daysIn7Month = calcMonthsToDays(7);
    const daysIn8Month = calcMonthsToDays(8);
    const daysIn9Month = calcMonthsToDays(9);
    const daysIn10Month = calcMonthsToDays(10);
    const daysIn11Month = calcMonthsToDays(11);
    const daysIn12Month = calcMonthsToDays(12);

    expect(daysIn0Month).toEqual(0);
    expect(daysIn1Month).toEqual(31);
    expect(daysIn2Month).toEqual(61);
    expect(daysIn3Month).toEqual(92);
    expect(daysIn4Month).toEqual(122);
    expect(daysIn5Month).toEqual(153);
    expect(daysIn6Month).toEqual(183);
    expect(daysIn7Month).toEqual(214);
    expect(daysIn8Month).toEqual(244);
    expect(daysIn9Month).toEqual(275);
    expect(daysIn10Month).toEqual(305);
    expect(daysIn11Month).toEqual(336);
    expect(daysIn12Month).toEqual(365);
  });
});
