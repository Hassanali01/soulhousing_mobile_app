import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
const CustomButton = ({
  handlePress,
  title,
  containerStyles,
  isloading,
  textStyles,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={"0.7"}
      className={`bg-secondary-200 justify-center items-center rounded-xl min-h-[62px] ${containerStyles} ${
        isloading ? "opacity-50" : " "
      }`}
      disabled={isloading}
    >
      <Text className={`text-white font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({});
