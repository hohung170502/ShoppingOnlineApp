import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { authApi, userApi } from '~/apis';
import { Header, LoadingIndicator, FixedBottom } from '~/components';
import { colors } from '~/styles';
import { UserItem } from './components';
import { deleteUser } from 'firebase/auth';
import { showMessage } from '../../../utils/showMessage';

export const UserList = () => {
  const { t } = useTranslation();
  const [data, setData] = useState();

  const fetchUserList = async () => {
    const response = await userApi.getAll();
    if (response.status === 'success') {
      setData(response.data);
    }
  };

  const deleteUser = async (uid) => {
    const response = await userApi.delete(uid);
    showMessage(response.message);
  };
  
  
  const handleDelete = async (uid) => {
    Alert.alert(t(''), t('deleteMessage'), [
      {
        text: t('confirm'),
        onPress: async () => {
          try {
            deleteUser(user);
             // Specific success message
            // Consider additional actions like refreshing the user list
          } catch (error) {
            console.error('Error deleting user:', error);
            showMessage(t('deleteUserError')); // Error message
          }
        },
        style: 'destructive',
      },
      {
        text: t('cancel'),
        onPress: () => {},
        style: 'cancel',
      },
    ]);
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        title={t('screenNames.userList')}
        //   rightComponent={<IconButton name='plus' />}
      />
      <FlatList
        style={styles.list}
        data={data}
        renderItem={({ item }) => (
          <UserItem 
          data={item} 
          
          onDelete={() => {
            handleDelete(item.uid);
          }}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
        ListEmptyComponent={!data && <LoadingIndicator />}
        ListFooterComponent={<FixedBottom />}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    paddingTop: 12,
  },
  divider: {
    marginBottom: 4,
  },
});
