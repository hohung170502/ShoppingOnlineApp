import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Header, LoadingIndicator } from '~/components';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-native-paper';
import { colors } from '~/styles';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { authActions, selectUser } from '~/redux';
import { authApi } from '~/apis';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SCREENS } from '~/constants';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '~/config';

export const ReloadEmailScreen = () => {
    const { t } = useTranslation();
    const userData = useSelector(selectUser);
    const dispatch = useDispatch();
    const [timeLeft, setTimeLeft] = useState(5); // Changed timeLeft to 5 seconds for demonstration
    const [isResendVisible, setIsResendVisible] = useState(false);
    const [emailVerified, setEmailVerified] = useState(false);
    
    const route = useRoute();
    const navigation = useNavigation();
    const userEmail = route.params?.userEmail || '';

    const handleResendEmail = async () => {
        try {
            await authApi.sendEmailVerificationLink(userEmail);
            setIsResendVisible(false);
            setTimeLeft(60); // Reset time left to 5 seconds after resending email
        } catch (error) {
            console.error("Error resending verification email:", error);
        }
    };

    const { values, setFieldValue } = useFormik({
        initialValues: {
            email: userEmail,
        },
        onSubmit: (values) => {},
    });

    useEffect(() => {
        const checkEmailVerification = async () => {
            const unsubscribe = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const idTokenResult = await user.getIdTokenResult(true);
                    const emailVerified = idTokenResult.claims.email_verified;
                    setEmailVerified(emailVerified);

                    if (emailVerified) {
                        setTimeout(() => {
                            navigation.navigate(SCREENS.ACCOUNT_VERIFICATION); // Navigate to AccountVerification after 5 seconds
                        }, 500); // 5 seconds delay before navigating
                    }
                }
            });
            return () => unsubscribe();
        };

        checkEmailVerification();
    }, []);

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
        let redirectToAddPassword = false;
        const timer = setInterval(() => {
            if (timeLeft > 0) {
                setTimeLeft(timeLeft - 1);
            } else {
                clearInterval(timer);
                if (!redirectToAddPassword) {
                    redirectToAddPassword = true;
                    setIsResendVisible(true);
                }
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const hideMiddleCharacters = (email) => {
        const atIndex = email.indexOf('@');
        if (atIndex > 1) {
            const firstChar = email.charAt(0);
            const lastChar = email.charAt(atIndex - 1);
            const middleCharacters = '*'.repeat(atIndex - 2);
            return `${firstChar}${middleCharacters}${lastChar}@${email.split('@')[1]}`;
        }
        return email;
    };

    return (
        <>
            <View style={styles.container}>
                <Header title={t('screenNames.emailVer')} />
            </View>

            {!userData && <LoadingIndicator />}
            {userData && (
                <View style={styles.infoView}>
                    <Text style={styles.content}>{t('screenNames.emailnoti')}</Text>
                    <Text style={styles.input}>
                        <Text style={styles.boldText}>
                            {hideMiddleCharacters(values.email) || 'Loading...'}
                        </Text>
                    </Text>
                </View>
            )}
            <View style={styles.imageContainer}>
                <Image source={require('../../assets/images/Email.png')} style={styles.image} />
            </View>
            <View style={styles.infoView}>
                {timeLeft > 0 ? (
                    <Text style={styles.content}>
                        {t('screenNames.waitForPasswordReset')}{' '}
                        <Text style={styles.timelight}>{timeLeft}</Text> {t('screenNames.seconds')}
                    </Text>
                ) : (
                    <View style={styles.resendContainer}>
                        {isResendVisible && (
                            <Text style={styles.contentview}>
                                {t('screenNames.resendEmailNoti')}
                            </Text>
                        )}
                        {isResendVisible && (
                            <Button onPress={handleResendEmail} style={styles.resendButton}>
                                <Text style={styles.orangelightText}>
                                    {t('screenNames.ResendEmail')}
                                </Text>
                            </Button>
                        )}
                    </View>
                )}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surface,
    },
    infoView: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        marginTop: 35,
        marginLeft: 20,
        marginRight: 20,
        fontSize: 13,
    },
    contentview: {
        marginTop: 15,
    },
    input: {
        marginTop: 15,
    },
    boldText: {
        fontWeight: 'bold',
    },
    imageContainer: {
        marginTop: 25,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: colors.pinkred,
        borderRadius: 100,
        width: 150,
        height: 150,
    },
    image: {
        justifyContent: 'center',
        alignSelf: 'center',
        objectFit: 'contain',
        width: 100,
        height: 100,
    },
    resendContainer: {
        marginTop: 15,
    },
    timelight: {
        color: 'red',
    },
    resendButton: {
        borderWidth: 0,
    },
    orangelightText: {
        color: 'red',
    },
});

export default ReloadEmailScreen;
