import React, { useState } from 'react';
import { Text, Pressable, ViewStyle, GestureResponderEvent, LayoutChangeEvent } from 'react-native';
import { SvgProps } from 'react-native-svg';

interface IconButtonProps
{
  icon: React.FC<SvgProps>;
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  iconColor?: string
}

export default function IconButton({icon: Icon, onPress, style, iconColor} : Readonly<IconButtonProps>) {

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setDimensions({ width, height });
  };

  return (
    <Pressable style={style} onPress={onPress} onLayout={onLayout}>
        <Icon width={dimensions.width} height={dimensions.height} color={iconColor ?? "black"}/>
    </Pressable>
  );
}