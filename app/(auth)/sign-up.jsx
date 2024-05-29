import { Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { Link } from "expo-router";
const SignUp = () => {
  const [form, setForm] = useState({
    username:"",
    email: "",
    password: "",
  });
   const [isSubmitting ,setIsSubmitting] = useState(false)
  const submit =()=>{}

  return (
    <>
      <SafeAreaView className=" h-full  bg-primary">
        <ScrollView>
          <View className="w-full min-h-[83vh] justify-center px-4 my-6">
            <Image
              source={images.logo}
              className="h-[115px] w-[55px]"
              resizeMode="contain"
            />
            <Text className="text-2xl mt-2 text-white font-psemibold text-semibold">
              Sign p to Aora
            </Text>
            <FormField
              title="Username"
              value={form.username}
              handleChangeText={(e) => {
                setForm({ ...form, email: e });
              }}
              otherStyles="mt-10"
              
            />
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => {
                setForm({ ...form, email: e });
              }}
              otherStyles="mt-7"
              keyboardType="email-address"
            />
             <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => {
                setForm({ ...form, password: e });
              }}
              otherStyles="mt-7"
            />
            <CustomButton containerStyles="mt-7" title='Sign in' handlePress={submit} isloading={isSubmitting}/>
            <View className='justify-center pt-5 flex-row gap-2'>
              <Text className='text-gray-100 text-lg font-pregular'>Have an account already?</Text>
              
              <Link href='/sign_in' className="text-lg text-secondary font-psemibold">Sign in</Link>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
