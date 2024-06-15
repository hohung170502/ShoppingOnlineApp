import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import { ROLES, SCREENS } from '~/constants';
import { selectRole } from '~/redux';
import {
  AdminPanel,
  Cart,
  CategoryCreate,
  CategoryEdit,
  CategoryList,
  CategoryShow,
  ChangeLanguage,
  ChangePasswordScreen,
  Chart,
  CommentList,
  CommentReply,
  Login,
  Membership,
  MyCommentList,
  OrderEdit,
  OrderList,
  OrderManagement,
  ProductCreate,
  ProductDetail,
  ProductEdit,
  ProductList,
  ProductsByCategory,
  RatingList,
  Search,
  SignUp,
  UserComment,
  UserInfo,
  UserList,
  UserRating,
} from '../screens';

import { colors } from '~/styles';
import { MyTabs } from './MyTabs';
import { navigationRef } from './navigationService';
import { ReloadEmailScreen } from '../screens/reloadEmail/ReloadEmail';
import AccountVerificationScreen from '../screens/AccountVerification/AccountVerification';
import { PasswordEmailScreen } from '../screens/passwordEmail';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const role = useSelector(selectRole);

  const navTheme = {
    dark: false,
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
    },
  };

  const adminStackScreens = [
    <>
      <Stack.Screen name={SCREENS.ADMIN_PANEL} component={AdminPanel} />
      <Stack.Screen name={SCREENS.USER_LIST} component={UserList} />
      <Stack.Screen name={SCREENS.CATEGORY_CREATE} component={CategoryCreate} />
      <Stack.Screen name={SCREENS.CATEGORY_EDIT} component={CategoryEdit} />
      <Stack.Screen name={SCREENS.CATEGORY_LIST} component={CategoryList} />
      <Stack.Screen name={SCREENS.CATEGORY_SHOW} component={CategoryShow} />
      <Stack.Screen name={SCREENS.PRODUCT_CREATE} component={ProductCreate} />
      <Stack.Screen name={SCREENS.PRODUCT_LIST} component={ProductList} />
      <Stack.Screen name={SCREENS.PRODUCT_EDIT} component={ProductEdit} />
      <Stack.Screen name={SCREENS.RATING_LIST} component={RatingList} />
      <Stack.Screen name={SCREENS.COMMENT_LIST} component={CommentList} />
      <Stack.Screen name={SCREENS.ORDER_LIST} component={OrderList} />
      <Stack.Screen name={SCREENS.CHART} component={Chart} />
      <Stack.Screen name={SCREENS.ORDER_EDIT} component={OrderEdit} />
      <Stack.Screen name={SCREENS.COMMENT_REPLY} component={CommentReply} />
    </>,
  ];

  return (
    <NavigationContainer ref={navigationRef} theme={navTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {role !== ROLES.ADMIN && (
          <Stack.Group>
            <Stack.Screen name='MyTabs' component={MyTabs} />
            <Stack.Screen
              name={SCREENS.PRODUCTS_BY_CATEGORY}
              component={ProductsByCategory}
            />
            <Stack.Screen name={SCREENS.USER_INFO} component={UserInfo} />
            <Stack.Screen
              name={SCREENS.ORDER_MANAGEMENT}
              component={OrderManagement}
            />
            <Stack.Screen name={SCREENS.USER_COMMENT} component={UserComment} />
            <Stack.Screen name={SCREENS.USER_RATING} component={UserRating} />
            <Stack.Screen
              name={SCREENS.PRODUCT_DETAIL}
              component={ProductDetail}
            />
            <Stack.Screen
              initialParams={{ isShowBack: true }}
              name={SCREENS.CART}
              component={Cart}
            />
            <Stack.Screen name={SCREENS.SEARCH} component={Search} />
            <Stack.Screen
              name={SCREENS.CHANGE_LANGUAGE}
              component={ChangeLanguage}
            />
            <Stack.Screen
              name={SCREENS.MY_COMMENT_LIST}
              component={MyCommentList}
            />
            <Stack.Screen
              name={SCREENS.CHANGE_PASSWORD}
              component={ChangePasswordScreen}
            />
             <Stack.Screen
              name={SCREENS.RELOAD_EMAIL}
              component={ReloadEmailScreen}
            />
            <Stack.Screen
              name={SCREENS.ACCOUNT_VERIFICATION}
              component={AccountVerificationScreen}
            />
            <Stack.Screen
              name={SCREENS.PASSWORD_EMAIL}
              component={PasswordEmailScreen}
            />
            <Stack.Screen name={SCREENS.MEMBERSHIP} component={Membership} />
          </Stack.Group>
        )}
        {role === ROLES.ADMIN && adminStackScreens}
        {role === ROLES.GUEST && (
          <Stack.Group>
            <Stack.Screen
              options={{
                presentation: 'modal',
              }}
              name={SCREENS.LOGIN}
              component={Login}
            />
            <Stack.Screen
              options={{
                presentation: 'modal',
              }}
              name={SCREENS.SIGN_UP}
              component={SignUp}
            />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
