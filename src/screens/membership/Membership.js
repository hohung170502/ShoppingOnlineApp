import React from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';

import { Divider, Header, Text } from '~/components';
import {
  MAX_DISCOUNT_AMOUNT,
  MAX_DISCOUNT_PERCENT,
  MEMBERSHIP,
} from '~/constants';
import { moneyFormat } from '~/utils';
import { colors } from '~/styles';

export const Membership = () => {
  const { t } = useTranslation();

  const activationThreshold = {
    [MEMBERSHIP.BRONZE]: '0',
    [MEMBERSHIP.SILVER]: '0-20',
    [MEMBERSHIP.GOLD]: '20-40',
    [MEMBERSHIP.PLATINUM]: '40-60',
    [MEMBERSHIP.SUPER_VIP]: '> 60',
  };

  const membershipData = Object.entries(MEMBERSHIP).map(([key, value]) => ({
    key,
    value,
    discountPercent: `${MAX_DISCOUNT_PERCENT[value] * 100}%`,
    maxDiscountAmount: MAX_DISCOUNT_AMOUNT[value],
    activationThreshold: activationThreshold[value],
  }));

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text>
        + {t(item.value)}: &nbsp;
        <Text>
          {t('discount')} {item.discountPercent}{' '}
        </Text>
        <Text>
          {'('}
          {t('maxDiscountAmount')} {moneyFormat(item.maxDiscountAmount)}
          {')'}
        </Text>
      </Text>
      <Text>
        {t('activationThreshold')}: &nbsp;
        {item.activationThreshold} {t('million')}
      </Text>
    </View>
  );

  return (
    <>
      <Header title={t('screenNames.membership')} />
      <View style={styles.container}>
        <FlatList
          data={membershipData}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider />}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  item: {
    padding: 12,
    backgroundColor: colors.surface,
  },
});
