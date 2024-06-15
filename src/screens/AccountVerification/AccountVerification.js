import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Header, LoadingIndicator } from '~/components';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { colors } from '~/styles';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, selectUser } from '~/redux';
import { useFormik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import { authApi } from '~/apis';
import { SCREENS } from '~/constants';

const AccountVerificationScreen = () => {
    const { t } = useTranslation();
    const userData = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const { values, setFieldValue, handleSubmit } = useFormik({
        initialValues: {
            email: '',
        },
        onSubmit: async (values) => {
            if (userData) {
                try {
                    await authApi.sendEmailVerificationLink(userData.email);
                    navigation.navigate(SCREENS.PASSWORD_EMAIL); // Navigate to password email screen after sending verification link
                } catch (error) {
                    console.error('Error sending verification email:', error);
                }
            }
        },
    });

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                if (!userData) {
                    const response = await authApi.getUserProfile();
                    if (response?.data) {
                        const user = response.data;
                        dispatch(authActions.updateUser(user));
                        setFieldValue('email', user.email);
                    }
                } else {
                    setFieldValue('email', userData.email);
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };
        getUserInfo();
    }, []);

    useEffect(() => {
        if (userData && userData.emailVerified) {
            navigation.navigate(SCREENS.ADD_PASSWORD);
        }
    }, [userData]);

    useEffect(() => {
        // Redirect to password email screen if user data is not available or email is not verified
        if (!userData || !userData.emailVerified) {
            navigation.navigate(SCREENS.PASSWORD_EMAIL);
        }
    }, [userData, navigation]);

    const handleResendVerification = async () => {
        if (userData) {
            try {
                await authApi.sendEmailVerificationLink(userData.email);
                console.log('Resent verification email.');
            } catch (error) {
                console.error('Error resending verification email:', error);
            }
        }
    };

    return (
        <>
            <View style={styles.container}>
                <Header title={t('screenNames.accountVerification')} />
            </View>

            <View style={styles.imageContainer}>
                <Image
                    source={require('../../assets/images/Checkout.png')}
                    style={styles.image}
                />
            </View>

            <View style={styles.infoView}>
                <Text style={styles.orangelightText}>
                    {t('screenNames.checkVerification')}
                </Text>
                <Text style={styles.loginText}>{t('screenNames.checkLogin')}</Text>
            </View>

            
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
        marginBottom: 150,
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        backgroundColor: colors.primary,
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: colors.textLight,
    },
    orangelightText: {
        fontWeight: 'bold',
        alignSelf: 'center',
        justifyContent: 'center',
        color: 'blackz', // Note: Correct this color as per your design
        fontSize: 15,
        marginBottom: 10,
    },
    loginText: {
        alignSelf: 'center',
        justifyContent: 'center',
        color: 'gray',
        fontSize: 12,
    },
    infoView: {
        alignSelf: 'center',
        justifyContent: 'center',
    },
    image: {
        marginBottom: 10,
        width: 70,
        height: 70,
        alignSelf: 'center',
        justifyContent: 'center',
    },
});

export default AccountVerificationScreen;
