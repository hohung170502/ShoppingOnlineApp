import React from 'react';
import { Image } from 'react-native';

import { SCREEN_WIDTH } from '~/constants';

export const Banner = (props) => {
  const { gapHorizontal = 16, borderRadius = 10 } = props;

  const imageURI =
    'https://lh3.googleusercontent.com/Exxulm6Ou9btiKCPSu-0K3GfT7Q2gTTjayVpYil-5oU4KS3wNgHp6xRGWqrZSi8Q6aLdPDAjr-9XxY8r8udek0P__laTxp4=rw-w1536';

  return (
    <Image
      resizeMode='cover'
      style={{
        width: SCREEN_WIDTH - gapHorizontal * 2,
        height: SCREEN_WIDTH * 0.35,
        marginHorizontal: gapHorizontal,
        borderRadius: borderRadius,
      }}
      source={{
        uri: imageURI,
      }}
    />
  );
};
