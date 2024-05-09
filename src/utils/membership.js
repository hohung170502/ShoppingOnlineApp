import {
    MAX_DISCOUNT_AMOUNT,
    MAX_DISCOUNT_PERCENT,
    MEMBERSHIP,
    MEMBERSHIP_THRESHOLDS,
  } from '~/constants';
  
  export const getMaxDiscountValue = (membershipType, orderValue) => {
    const maxDiscountPercent = MAX_DISCOUNT_PERCENT[membershipType];
    const maxDiscountValue = orderValue * maxDiscountPercent;
    const maxDiscountAmount = MAX_DISCOUNT_AMOUNT[membershipType];
    return Math.min(maxDiscountValue, maxDiscountAmount);
  };
  
  export const getMembershipLevel = (totalMoney) => {
    for (const [membership, thresholds] of Object.entries(
      MEMBERSHIP_THRESHOLDS,
    )) {
      if (totalMoney >= thresholds.min && totalMoney < thresholds.max) {
        return membership;
      }
    }
    return MEMBERSHIP.SILVER;
  };
  