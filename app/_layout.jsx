import {ScrollView, StyleSheet, Text, View, } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react'
import {SplashScreen,Stack } from 'expo-router';
import {useFonts} from 'expo-font'


import { AuthProvider } from '../components/AuthProvider';
SplashScreen.preventAutoHideAsync();
const RootLayout = () => {
    const [fontsLoading, error] = useFonts({
        "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
        "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    })
    useEffect(()=>{
        if (error) throw error;
        if (fontsLoading) SplashScreen.hideAsync();
        
    },[fontsLoading,error])
    if(!fontsLoading && !error) return null
  return (
   <SafeAreaView  style={styles.safeArea}>

      <ScrollView contentContainerStyle={{height:"100%", backgroundColor: '#2490eb',color:'white'}}>
      
    <AuthProvider>
    <Stack screenOptions={{ headerTitleStyle: { color: 'white' }, headerStyle: { backgroundColor: '#14457b' }, headerTintColor: 'white',headerTitle: '',headerShown:false }}>
        <Stack.Screen name='index' options={{headerShown:false,headerTitle: ''}}/>
        <Stack.Screen name='(auth)' options={{headerShown:false,headerTitle: ''}}/>
        <Stack.Screen name='(tabs)' options={{headerShown:false,headerTitle: ''}}/>
        <Stack.Screen 
            name="home" 
            
            options={{ 
              headerShown:false,
               
            }} 
          />
          <Stack.Screen 
            name="tweet" 
            options={{ 
              headerShown:true,
              headerTitle: 'Post', 
              // headerTitleStyle: { color: 'white' }, 
              // headerStyle: { backgroundColor: '#14457b' } 
            }} 
          />
    
    </Stack>
    </AuthProvider>
    </ScrollView>
    </SafeAreaView>
    
  )
}
const styles = StyleSheet.create({
  safeArea:{
    flex:1,
    backgroundColor:'white'
  }
})
export default RootLayout
