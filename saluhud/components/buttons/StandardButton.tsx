import React from 'react';
import { Text, Pressable, ViewStyle } from 'react-native';
import { generalStyles } from '@styles/generalStyles';

interface StandardButtonProps
{
  title: string;
  onPress: any;
  style?: ViewStyle;
}

export default function StandardButton({title, onPress, style} : Readonly<StandardButtonProps>) {
  return (
    <Pressable style={({pressed}) => [pressed? [generalStyles.standardButtonPressed, style]: [generalStyles.standardButton, style]]} onPress={onPress}>
      <Text style={generalStyles.standardButtonInnerText}>{title}</Text>
    </Pressable>
  );
}
