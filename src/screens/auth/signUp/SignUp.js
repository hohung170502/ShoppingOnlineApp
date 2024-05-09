import React, { useRef } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';

import { authApi } from '~/apis';
import { Button, Header, Input, Pressable, Text } from '~/components';
import { MIN_PASSWORD_LENGTH } from '~/constants';
import { useLoading } from '~/hooks';
import { colors } from '~/styles';
import { showMessage } from '~/utils';

export const SignUp = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { showLoading, hideLoading } = useLoading();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const loginSchema = yup.object().shape({
    fullname: yup.string().required(t('required')),
    email: yup.string().email(t('invalidEmail')).required(t('required')),
    password: yup
      .string()
      .min(MIN_PASSWORD_LENGTH, t('weakPassword'))
      .required(t('required')),
  });

  const initialValues = {
    fullname: undefined,
    email: undefined,
    password: undefined,
  };

  const {
    values,
    touched,
    errors,
    setFieldTouched,
    setFieldValue,
    handleBlur,
    handleSubmit,
  } = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: (values) => {
      Keyboard.dismiss();
      onSubmit();
    },
  });

  const onSubmit = async () => {
    showLoading();
    const response = await authApi.signUp(
      values.fullname,
      values.email,
      values.password,
    );
    hideLoading();
    showMessage(response?.message);
    if (response?.status === 'success') {
      navigation.goBack();
    }
  };

  const navigateToLogin = () => {
    navigation.goBack();
  };

  return (
    <>
      <Header presentationModal backIcon='close' />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps='handled'
        style={styles.container}>
        <Text variant='titleLarge' style={styles.title}>
          {t('signUp')}
        </Text>
        <Input
          value={values.fullname}
          onChangeText={(text) => {
            setFieldTouched('fullname', true);
            setFieldValue('fullname', text);
          }}
          autoCapitalize='words'
          hasError={!!(touched.fullname && errors.fullname)}
          errorMessage={touched.fullname && errors.fullname && errors.fullname}
          onBlur={handleBlur('fullname')}
          label={t('fullname')}
          blurOnSubmit={false}
          returnKeyType='next'
          onSubmitEditing={() => {
            !errors.fullname && emailRef.current?.focus();
          }}
          style={styles.input}
        />
        <Input
          ref={emailRef}
          value={values.email}
          onChangeText={(text) => {
            setFieldTouched('email', true);
            setFieldValue('email', text);
          }}
          hasError={!!(touched.email && errors.email)}
          errorMessage={touched.email && errors.email && errors.email}
          onBlur={handleBlur('email')}
          label={t('email')}
          blurOnSubmit={false}
          returnKeyType='next'
          keyboardType='email-address'
          onSubmitEditing={() => {
            !errors.email && passwordRef.current?.focus();
          }}
          style={styles.input}
        />
        <Input
          ref={passwordRef}
          value={values.password}
          onChangeText={(text) => {
            setFieldTouched('password', true);
            setFieldValue('password', text);
          }}
          hasError={!!(touched.password && errors.password)}
          errorMessage={touched.password && errors.password && errors.password}
          onBlur={handleBlur('password')}
          icon='password'
          label={t('password')}
          secureTextEntry
          style={styles.input}
        />
        <Button
          title={t('continue')}
          block
          style={styles.button}
          onPress={handleSubmit}
        />
        <View style={styles.accountContainer}>
          <Text variant='labelMedium'>{t('haveAccount')}&nbsp;</Text>
          <Pressable onPress={navigateToLogin}>
            <Text variant='labelMedium' color={colors.primary}>
              {t('loginNow')}
            </Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.surface,
  },
  title: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    marginBottom: 8,
  },
  button: {
    marginTop: 24,
  },
  accountContainer: {
    marginTop: 24,
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
