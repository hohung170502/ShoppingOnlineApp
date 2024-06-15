import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Avatar, IconButton, Pressable, Text } from '~/components';
import { colors } from '~/styles';

export const UserItem = (props) => {
  const { data, onShow, onDelete } = props;

  return (
    
    <Pressable onPress={onShow} style={styles.container}>
      <View style={styles.content}>
        <Avatar source={{ uri: data?.photoURL }} style={styles.avatar} />
        <View>
          <Text>{data?.fullname}</Text>
          <Text>{data?.email}</Text>
        </View>
      </View>
      <View style={styles.iconContainer}>
        <IconButton name='remove' onPress={onDelete} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 12,
  },
});

UserItem.propTypes = {
  data: PropTypes.object,
  onDelete: PropTypes.func,

};

