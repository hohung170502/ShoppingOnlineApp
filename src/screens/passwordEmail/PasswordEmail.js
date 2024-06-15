import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native'; // Ensure Button import is correct
import { Header } from '~/components';
import { useTranslation } from 'react-i18next';
import { colors } from '~/styles';
import { useFormik } from 'formik';
import { updateUserPassword } from '~/apis/authApi';

export const PasswordEmailScreen = () => {
  const { t } = useTranslation();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleNewPasswordChange = (text) => {
    setNewPassword(text);
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
  };

  const handleSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('Mật khẩu mới không khớp với mật khẩu xác nhận.');
      return;
    }

    try {
      const response = await updateUserPassword(newPassword);
      if (response.status === 'success') {
        setErrorMessage(response.message);
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật mật khẩu:', error);
      setErrorMessage('Đã có lỗi xảy ra khi cập nhật mật khẩu. Vui lòng thử lại sau.');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Header title={t('screenNames.addPassword')} />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={t('screenNames.newPassword')}
          secureTextEntry={true}
          value={newPassword}
          onChangeText={handleNewPasswordChange}
        />
        <TextInput
          style={styles.input}
          placeholder={t('screenNames.confirmPassword')}
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
        />
        <Button
          style={styles.button}
          title={t('confirm')} // Ensure t('confirm') returns a string
          onPress={handleSubmit}
        />
      </View>

      {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
  },
  inputContainer: {
    marginVertical: 20,
  },
  button: {
    marginLeft: 24,
    marginRight: 24,
    marginTop: 24,
    backgroundColor: colors.primary,
  },
  input: {
    marginLeft: 24,
    marginRight: 24,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginTop: 10,
  },
  errorMessage: {
    color: 'red',
    marginBottom: 10,
    marginLeft: 24,
    marginRight: 24,
  },
});

export default PasswordEmailScreen;
