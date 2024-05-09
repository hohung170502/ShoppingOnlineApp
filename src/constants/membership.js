export const MEMBERSHIP = {
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  SUPER_VIP: 'superVip',
};

export const MAX_DISCOUNT_PERCENT = {
  [MEMBERSHIP.SILVER]: 0.1, // 10%
  [MEMBERSHIP.GOLD]: 0.15, // 15%
  [MEMBERSHIP.PLATINUM]: 0.2, // 20%
  [MEMBERSHIP.SUPER_VIP]: 0.3, // 30%
};

export const MAX_DISCOUNT_AMOUNT = {
  [MEMBERSHIP.SILVER]: 1000000, // 200 nghìn
  [MEMBERSHIP.GOLD]: 2000000, // 500 nghìn
  [MEMBERSHIP.PLATINUM]: 30000000, // 1 triệu
  [MEMBERSHIP.SUPER_VIP]: 50000000, // 10 triệu
};

// Xác định ngưỡng thành viên
export const MEMBERSHIP_THRESHOLDS = {
  
  [MEMBERSHIP.SILVER]: {
    min: 0,
    max: 20000000,
  },
  [MEMBERSHIP.GOLD]: {
    min: 20000000,
    max: 40000000,
  },
  [MEMBERSHIP.PLATINUM]: {
    min: 40000000,
    max: 60000000,
  },
  [MEMBERSHIP.SUPER_VIP]: {
    min: 60000000,
    max: Infinity,
  },
};


