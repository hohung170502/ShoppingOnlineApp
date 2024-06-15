import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { Avatar, IconButton, Pressable, Text } from '~/components';
import { SCREEN_WIDTH, STATUS_BAR_HEIGHT } from '~/constants';
import { colors } from '~/styles';


export const UserCard = (props) => {
  const { onPress, user } = props;
  const { t } = useTranslation();

  return (
    <View>
      <View style={styles.container}>
        <LinearGradient
          colors={['#ff9800', '#f44336']}
          start={{ x: 1, y: 0 }}
          end={{ x: 0.2, y: 0 }}
          active
          style={styles.background}>
          <View style={styles.content}>
            <View style={styles.infoView}>
              <Avatar source={{ uri: user?.photoURL }} style={styles.avatar} />
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={2}
                  variant='titleMedium'
                  style={styles.fullname}>
                  {user?.fullname}
                </Text>
                <Text variant='bodySmall' style={styles.standard}>
                  {t('standard')}
                </Text>
              </View>
            </View>
            <IconButton onPress={onPress} name='setting' color={colors.light} />
          </View>
        </LinearGradient>
        
        {/* <View style={styles.cumulativeSlide}>
              
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={2}
                  variant='titleMedium'
                  style={styles.tittle}>
                  {t('cumulativetotal')}
                </Text>
                
              </View>
            <Text style={styles.tittle}>{t('PointScreen.Pointtotal')}</Text>

        </View>

        <View style={styles.cumulative}>
              
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={2}
                  variant='titleMedium'
                  style={styles.tittle}>
                  {t('MemberScreen.Memberuser')}
                </Text>
                
              </View>
            <Text style={styles.tittle}>{t('LevelScreen.membershipLevel')}</Text>

        </View>
        <View style={styles.level}>
          <Text style={styles.hr}></Text>
        </View>
        <View style={styles.cumulative}>
              
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={2}
                  variant='titleMedium'
                  style={styles.tittleMember}>
                  {t('cumulativememberScreen.cumulativeMember')}
                </Text>
                
              </View>
            <Text style={styles.tittle}>{t('LevelScreen.membershipLevel')}</Text>

        </View> */}
            
      </View>

        
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingBottom: 15,
  },
  avatar: {
    marginRight: 16,
  },
  
  background: {

    height: 200,
    width: SCREEN_WIDTH - 32,
    marginTop: STATUS_BAR_HEIGHT,
    borderRadius: 12,
    padding: 20,
  },
  infoView: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fullname: {
    color: colors.light,
    marrginBottom: 4,
  },
  standard: {
    color: colors.light,
  },
  level: {
    
    width: SCREEN_WIDTH - 32,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hr: {
    height: 15, // Set the desired height of the line
    backgroundColor: colors.gainsboro, // Set the line color (e.g., gray)
    width: "100%", // Make the line span the entire width of the container
    borderRadius: 50,
  },
  tittleMember: {
    fontSize: 12,
  },
  cumulative: {
    
    width: SCREEN_WIDTH - 32,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cumulativeSlide: {
    width: SCREEN_WIDTH - 32,
    marginTop: STATUS_BAR_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tittle: {
    fontSize: 12,

    fontWeight: 500,
    color: colors.darkgray,

  },
});

UserCard.propTypes = {
  onPress: PropTypes.func,
  user: PropTypes.object,
};
