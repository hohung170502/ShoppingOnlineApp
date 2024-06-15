import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useGetListCommentRealtime } from '~/hooks';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, selectUser } from '~/redux';
import { authApi } from '~/apis';
import { colors } from '~/styles';
import { SCREENS } from '~/constants';
import { Header, LoadingIndicator } from '~/components';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'react-native-paper';

export const ChangePasswordScreen = () => {
    const { t } = useTranslation();
    const data = useGetListCommentRealtime();
    const userData = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [emailSent, setEmailSent] = React.useState(false);
    const [userEmail, setUserEmail] = React.useState('');

    const sendPasswordResetLink = async () => {
        try {
            let email = '';

            if (userData) {
                email = userData.email;
            } else {
                const response = await authApi.getUserProfile();
                if (response?.data) {
                    const user = response.data;
                    dispatch(authActions.updateUser(user));
                    email = user.email;
                }
            }

            if (email) {
                await authApi.sendPasswordResetLink(email);
                setEmailSent(true);
                setUserEmail(email);
            }
        } catch (error) {
            console.error("Lỗi khi gửi email xác minh:", error);
        }
    };

    React.useEffect(() => {
        if (emailSent && userEmail) {
            navigation.navigate(SCREENS.RELOAD_EMAIL, { userEmail });
        }
    }, [emailSent, userEmail, navigation]);

    return (
        <View>
            <View style={styles.container}>
                <Header title={t('screenNames.accountVerification')} />
            </View>
            {!data && <LoadingIndicator />}
            {data && (
                <View style={styles.infoView}>
                    <Text style={styles.content}>{t('screenNames.security')}</Text>
                    <Button
                        icon='email-outline'
                        style={styles.button}
                        onPress={sendPasswordResetLink}
                    >
                        {t('screenNames.emailVerification')}
                    </Button>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: colors.surface,
    },
    infoView: {
        height: '100%',
        marginTop: 5,
        alignItems: 'center',
        backgroundColor: colors.surface,
    },
    content: {
        marginTop: 25,
        marginLeft: 20,
        marginRight: 20,
        fontSize: 13,
        color: colors.graylight,
    },
    button: {
        marginTop: 25,
        width: '100%',
        borderWidth: 1,
        borderColor: 'black',
    },
});
export default ChangePasswordScreen;
