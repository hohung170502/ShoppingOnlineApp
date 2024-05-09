import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, View, SectionList } from 'react-native';
import { Image } from 'react-native';


import { Icon, Pressable, SearchBox } from '~/components';
import { HEADER_HEIGHT, SCREEN_HEIGHT, STATUS_BAR_HEIGHT, SCREEN_WIDTH } from '~/constants';
import { colors, typography } from '~/styles';

const COMMON_HEADER_HEIGHT = STATUS_BAR_HEIGHT + HEADER_HEIGHT;
const EXTRA_HEADER_HEIGHT = 50;
const INPUT_PADDING_BOTTOM = 8;
const ITEM_WIDTH = SCREEN_WIDTH * 0.2;
const IMAGE_SIZE = ITEM_WIDTH;
export const StickyHeader = (props) => {
  const { children, onSearch } = props;

  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);

  const lastOffsetY = useRef(0);

  const [fabVisible, setFabVisible] = useState(false);

  const translateHeader = scrollY.interpolate({
    inputRange: [0, EXTRA_HEADER_HEIGHT],
    outputRange: [0, -EXTRA_HEADER_HEIGHT],
    extrapolate: 'clamp',
  });

  const opacityTitle = scrollY.interpolate({
    inputRange: [0, EXTRA_HEADER_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const translateTitle = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 40],
    extrapolate: 'clamp',
  });

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: translateHeader }],
          },
        ]}>
        {/* <Animated.Text
          style={[
            styles.appName,
            { opacity: opacityTitle },
            { transform: [{ translateY: translateTitle }] },
          ]}>
          SHOPPING APP
        </Animated.Text> */}
         <Animated.Image source={require('../../../../assets/images/Logo.png')} 
         style={[
          styles.appName,
          { opacity: opacityTitle },
          { transform: [{ translateY: translateTitle }] },
        ]}/> 
        <SearchBox onPress={onSearch} />
      </Animated.View>
      <Animated.ScrollView
        ref={scrollViewRef}
        {...props}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={
          (Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: true,
            },
          ),
          (e) => {
            const offsetY = e.nativeEvent.contentOffset.y;
            lastOffsetY.current = offsetY;
            scrollY.setValue(offsetY);

            if (offsetY > EXTRA_HEADER_HEIGHT) {
              setFabVisible(true);
            } else {
              setFabVisible(false);
            }
          })
        }
        scrollEventThrottle={16}>
        {children}
      </Animated.ScrollView>
      {fabVisible && (
        <Pressable onPress={scrollToTop} style={[styles.fabButton]}>
          <Icon name='up' size='xSmall' color={colors.primary} />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingTop: STATUS_BAR_HEIGHT,
  },
  header: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    paddingHorizontal: 16,
    paddingBottom: INPUT_PADDING_BOTTOM,
    height: COMMON_HEADER_HEIGHT + EXTRA_HEADER_HEIGHT + INPUT_PADDING_BOTTOM,
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    backgroundColor: colors.primary,
  },
  scrollViewContent: {
    marginTop: HEADER_HEIGHT + EXTRA_HEADER_HEIGHT + INPUT_PADDING_BOTTOM,
    paddingBottom: HEADER_HEIGHT + EXTRA_HEADER_HEIGHT,
    paddingTop: 16,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: SCREEN_HEIGHT,
  },
  appName: {
    alignSelf: 'center',
    marginBottom: 16,
    
  },
  fabButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#c8d6f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
