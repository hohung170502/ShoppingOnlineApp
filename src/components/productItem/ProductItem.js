import PropTypes from 'prop-types';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { Button, Pressable, SaveCard, Text } from '~/components';
import { SAVE_CARD_HEIGHT, SCREEN_WIDTH } from '~/constants';
import { colors } from '~/styles';
import { getPercentPriceReduction, moneyFormat } from '~/utils';

const ITEM_WIDTH = SCREEN_WIDTH * 0.5 - 4;
const IMAGE_SIZE = ITEM_WIDTH;

export const ProductItem = (props) => {
  const { t } = useTranslation();
  const { data, onDetail, onAddToCart } = props;

  const saveMoney = () => {
    return data.priceOld - data.price;
  };

  return (
    <Pressable onPress={onDetail} style={styles.container}>
      <View>
        <Image source={{ uri: data?.image }} style={styles.image} />
        <SaveCard style={styles.save} money={saveMoney()} />
        <Text numberOfLines={2} style={styles.name}>
          {data?.name}
        </Text>
      </View>
      <View>
        <Text style={styles.price}>
          {data?.price && moneyFormat(data?.price)}
        </Text>
        <Text>
          <Text style={styles.priceOld}>
            {data?.priceOld && moneyFormat(data?.priceOld)}
          </Text>
          <Text style={styles.percent}>
            {getPercentPriceReduction(data?.price, data?.priceOld)}
          </Text>
        </Text>
        <Button
          onPress={onAddToCart}
          block
          size='small'
          variant='outline'
          title={t('aadToCart')}
          style={styles.button}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ITEM_WIDTH,
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 4,
    justifyContent: 'space-between',
    margin: 2,
  },
  image: {
    width: '100%',
    height: IMAGE_SIZE,
    alignSelf: 'center',
  },
  save: {
    position: 'absolute',
    top: -SAVE_CARD_HEIGHT,
  },
  name: {
    marginTop: 8,
    marginBottom: 24,
  },
  price: {
    color: colors.primary,
  },
  priceOld: {
    marginTop: 4,
    textDecorationLine: 'line-through',
    color: colors.tertiaryText,
  },
  button: { marginTop: 8 },
  percent: {
    color: colors.error,
  },
});

ProductItem.propTypes = {
  data: PropTypes.object,
  onDetail: PropTypes.func,
  onAddToCart: PropTypes.func,
};
