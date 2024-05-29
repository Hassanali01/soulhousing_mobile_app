
import { ScrollView, StyleSheet, Text, View,Image } from 'react-native';
import { Redirect,router } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context';
import {images} from '../constants'
import { StatusBar } from 'expo-status-bar';
import CustomButton from '../components/CustomButton';
export default function App() {
  return (
    <SafeAreaView className="bg-primary h-full" >
      <ScrollView contentContainerStyle={{height:"100%"}}>
      <StatusBar style="light" backgroundColor='#1d9bf1'/>
    
    <View className="w-full min-h-[85vh] px-2 items-center justify-center">
      {/* <Image source={images.cards} className="w-[130px] h-[84px]" resizeMode='contain'/> */}
      <Image source={images.soulhousing} className=" max-w-[480px] w-full h-[300px] " resizeMode='contain'/>
      <View className='relative mt-4'>
        <Text className='text-2xl font-bold text-white text-center'>
        Explore Boundless Opportunities With{" "}
          <Text className='text-secondary-200'>Soul Houding</Text>
          {/* <Image source={images.splashlogo} className="max-w-[80px]  h-50px] "  resizeMode='contain'/> */}
        </Text>
        {/* <Image source={images.path} className="w-[136px] h-[15px] absolute -bottom-2 -right-10" resizeMode='contain'/> */}

      </View>
      <Text className='text-sm text-white text-center font-pregular mt-7'> Soul Housing is currently contracted as a Community 
      Supports provider for Recuperative Care (Medical Respite), Short Term Post Hospitalization Housing, and Day Habilitation.</Text>
      <CustomButton title="Continue" handlePress={()=>router.push('/sign_in')} containerStyles="w-full mt-7" />
    </View>
    <View className="flex-1 justify-center items-center">
      <Text className='text-white '>Powered by Anchorstech</Text>
      </View>
    
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logo:{
    width: "150px",
    height:"100px"
  }
})
