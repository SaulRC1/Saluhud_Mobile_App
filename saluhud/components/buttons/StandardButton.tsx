import React from 'react';
import { Text, Pressable, ViewStyle } from 'react-native';
import { generalStyles } from '@styles/generalStyles';

interface StandardButtonProps
{
  title: string;
  onPress: any;
  style?: ViewStyle;
  disabled?: boolean;
}

export default function StandardButton({title, onPress, style, disabled} : Readonly<StandardButtonProps>) {
  return (
    <Pressable style={({pressed}) => disabled ? [generalStyles.standardButton, generalStyles.standardButtonDisabled, style] 
    : [pressed? [generalStyles.standardButtonPressed, style]: [generalStyles.standardButton, style]]} onPress={onPress} disabled={disabled}>
      <Text style={generalStyles.standardButtonInnerText}>{title}</Text>
    </Pressable>
  );
}
