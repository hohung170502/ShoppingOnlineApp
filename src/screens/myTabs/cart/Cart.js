import React, { useEffect } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { authApi, orderApi, productApi } from '~/apis';
import {
  Button,
  Divider,
  FixedBottom,
  Header,
  Pressable,
  Text,
} from '~/components';
import { ROLES, SCREENS } from '~/constants';
import { useLoading } from '~/hooks';
import {
  authActions,
  cartActions,
  selectCart,
  selectCartTotalAmount,
  selectMembershipLevel,
  selectRole,
  selectUser,
} from '~/redux';
import { colors } from '~/styles';
import {
  getMaxDiscountValue,
  getPercentPriceReduction,
  moneyFormat,
  showMessage,
} from '~/utils';
import { CartItem, Empty } from './components';

export const Cart = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute();

  const { showLoading, hideLoading } = useLoading();

  const data = useSelector(selectCart);
  const user = useSelector(selectUser);
  const level = useSelector(selectMembershipLevel);
  const userRole = useSelector(selectRole);
  const totalAmount = useSelector(selectCartTotalAmount);

  const { params } = route;

  const isShowBack = params?.isShowBack;

  const dispatch = useDispatch();

  const handleIncrease = (id) => {
    dispatch(cartActions.increase(id));
  };

  const handleDecrease = (id) => {
    dispatch(cartActions.decrease(id));
  };

  const handleContinue = async () => {
    if (userRole !== ROLES.USER) {
      navigation.navigate(SCREENS.LOGIN);
    }
    if (!user.address) {
      navigation.navigate(SCREENS.USER_INFO);
      showMessage(t('pleaseUpdateYourAddress'));
    } else {
      showLoading();
      const response = await orderApi.add(user.uid, data);
      if (response?.status === 'success') {
        dispatch(cartActions.removeAll());
        navigation.navigate(SCREENS.HOME);
      }
      hideLoading();
    }
  };

  const handleRemoveItem = (id) => {
    Alert.alert(t(''), t('removeThisProductMsg'), [
      {
        text: t('cancel'),
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: t('ok'),
        onPress: () => {
          dispatch(cartActions.removeItem(id));
        },
        style: 'destructive',
      },
    ]);
  };

  const handleRemoveAll = () => {
    Alert.alert(t(''), t('removeProductsMsg'), [
      {
        text: t('cancel'),
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: t('ok'),
        onPress: () => {
          dispatch(cartActions.removeAll());
        },
        style: 'destructive',
      },
    ]);
  };

  const getData = async () => {
    showLoading();
    const productIds = data?.map((e) => e.id);

    const promises = productIds?.map((e) => productApi.getOne(e));
    const promisesData = await Promise.all(promises);

    const dataFilter = promisesData
      ?.map((e) => e?.data)
      ?.filter((e) => e !== undefined); // Loại bỏ những sản phẩm đã bị xoá trên DB khi không tìm thấy

    const items = dataFilter?.map((e) => {
      const found = data.find((item) => item?.id == e?.id); // Tìm sản phẩm
      if (found) {
        return { ...e, quantity: found.quantity }; // Gộp thông tin mới và giữ nguyên quantity cũ
      }
    });
    dispatch(cartActions.replaceAll(items)); // Thay thế thông tin mới
    getUserInfo();
    hideLoading();
  };

  const getUserInfo = async () => {
    const response = await authApi.getUserProfile(user.uid);
    if (response?.data) {
      const user = response.data;
      dispatch(authActions.updateUser(user));
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getData();
    });

    return () => {
      unsubscribe();
    };
  }, [navigation, data]);

  const price = totalAmount - getMaxDiscountValue(level, totalAmount);

  const priceOld = totalAmount;

  const navigateToMembership = () => {
    navigation.navigate(SCREENS.MEMBERSHIP);
  };

  return (
    <>
      <Header
        isBackVisible={isShowBack ? true : false}
        title={t('screenNames.cart')}
        rightComponent={
          data.length !== 0 && (
            <Pressable onPress={handleRemoveAll}>
              <Text color={colors.primary}>{t('delete')}</Text>
            </Pressable>
          )
        }
      />
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <CartItem
              data={item}
              onRemove={() => {
                handleRemoveItem(item.id);
              }}
              onIncrease={() => {
                handleIncrease(item.id);
              }}
              onDecrease={() => {
                handleDecrease(item.id);
              }}
            />
          )}
          ListEmptyComponent={<Empty />}
        />
      </View>

      {data.length !== 0 && (
        <>
          <Divider />
          <View style={styles.footer}>
            <View style={{ flex: 1 }}>
              <Text variant='titleLarge' style={styles.total}>
                {moneyFormat(price)}
              </Text>
              <Text>
                <Text style={styles.priceOld}>{moneyFormat(totalAmount)}</Text>
                <Text style={styles.percent}>
                  
                  {getPercentPriceReduction(price, priceOld)}
                </Text>
                <Text
                  onPress={() => {
                    navigateToMembership();
                  }}>
                  &nbsp;{'('}
                  {t('view')}
                  {')'}
                </Text>
              </Text>
            </View>

            <View style={{ flex: 0.5 }}>
              <Button
                onPress={handleContinue}
                title={t('continue')}
                style={styles.button}
                block
              />
            </View>
          </View>
          {isShowBack && <FixedBottom />}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  total: {
    color: colors.primary,
    flex: 1,
  },
  price: {
    color: colors.primary,
  },
  priceOld: {
    marginTop: 4,
    textDecorationLine: 'line-through',
    color: colors.tertiaryText,
  },
  percent: {
    color: colors.error,
  },
  button: {},
});
