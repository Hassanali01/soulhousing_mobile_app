import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { AuthContext } from "../../components/AuthProvider";
import axiosConfig from "../../components/axiosConfig";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { Video } from "expo-av";
import Textarea from "react-native-textarea";
import { Dimensions } from "react-native";
import { useRouter } from 'expo-router';
import CustomButton from "../../components/CustomButton";
export default function NewTweet({ navigation }) {
  const [tweet, setTweet] = useState("");
  const [media, setMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const router = useRouter(); 
  const screenWidth = Dimensions.get("window").width;
  const mediaWidth = screenWidth - 20; // 10 padding on each side
  const mediaHeight = mediaWidth * (3 / 4); // Assuming 4:3 aspect ratio

  async function sendTweet() {
    if (tweet.length === 0 && !media) {
      Alert.alert("Please enter a tweet or select media");
      return;
    }

    setIsLoading(true);
    axiosConfig.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${user.token}`;

    const formData = new FormData();
    formData.append("body", tweet);

    if (media) {
      // Read the media file and convert it to base64
      const base64Media = await FileSystem.readAsStringAsync(media.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const mediaType = media.type === "image" ? "image/jpeg" : "video/mp4";
      const base64Data = `data:${mediaType};base64,${base64Media}`;

      formData.append("media", base64Data);
    }
  
    axiosConfig
      .post(`/store-tweet`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        router.push("/home", {
          newTweetAdded: response.data,
        });
        setIsLoading(false);
        console.log("formdData",formData)
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }

  async function selectMedia() {
    let result;
    try {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setMedia(result.assets[0]);
      }
    } catch (error) {
      console.error("Error selecting media:", error);
      Alert.alert("Error", "Failed to select media. Please try again.");
    }
  }

  async function captureMedia(type) {
    let result;
    try {
      if (type === "image") {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
      } else {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
          quality: 1,
        });
      }

      if (!result.canceled) {
        setMedia(result.assets[0]);
      }
    } catch (error) {
      console.error("Error capturing media:", error);
      Alert.alert("Error", "Failed to capture media. Please try again.");
    }
  }

  return (
    <>
       <View style={styles.liveHeader}>
        <Text style={styles.liveHeaderTitle}>Post</Text>
       </View>
    <View style={styles.container}>
    <StatusBar style="light" backgroundColor="#14457b"/>
       <View style={styles.top}>
      <View style={styles.tweetButtonContainer}>
        <Text style={tweet.length > 250 ? styles.textRed : styles.textGray}>
          Characters left: {280 - tweet.length}
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {isLoading && (
            <ActivityIndicator
              size="small"
              color="gray"
              style={{ marginRight: 8 }}
            />
          )}
          <TouchableOpacity
            style={styles.tweetButton}
            onPress={sendTweet}
            disabled={isLoading}
          >
            <Text style={styles.tweetButtonText}>Broad Cast</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mediaButton}>
        <TouchableOpacity onPress={selectMedia}>
          <Entypo name="upload" size={24} color="#9ea3ad" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cameraIcon}
          onPress={() => captureMedia("image")}
        >
          <Entypo name="camera" size={24} color="#9ea3ad" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => captureMedia("video")}>
          <FontAwesome5 name="video" size={24} color="#9ea3ad" />
        </TouchableOpacity>
      </View>

      <View style={styles.tweetBoxContainer}>
        <Textarea
          containerStyle={styles.textareaContainer}
          style={styles.textarea}
          onChangeText={setTweet}
          value={tweet}
          placeholder="What's happening?"
          placeholderTextColor="gray"
          multiline
          maxLength={280}
          underlineColorAndroid={"transparent"}
        />
      </View>
      {media && (
        <View style={styles.mediaPreviewContainer}>
          {media.mimeType && media.mimeType.startsWith("image") ? (
            <Image source={{ uri: media.uri }} style={{ width: mediaWidth, height: mediaHeight, borderRadius: 10 }} />
          ) : (
            <Video
              source={{ uri: media.uri }}
              style={{ width: mediaWidth, height: mediaHeight, borderRadius: 10 }}
              useNativeControls
              resizeMode="contain"
            />
          )}
        </View>
      )}
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  textGray: {
    color: "gray",
  },
  top:{
    marginTop:30
  },
  textRed: {
    color: "red",
  },
  ml4: {
    marginLeft: 16,
  },
  mediaButton: {
    flexDirection: "row",
  },
  cameraIcon: {
    marginRight: 15,
    marginLeft: 15,
  },
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  tweetButtonContainer: {
    paddingVertical: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tweetButton: {
    backgroundColor: "#14457b",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
  },
  tweetButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  tweetBoxContainer: {
    flexDirection: "row",
    paddingTop: 25,
  },
  avatar: {
    width: 42,
    height: 42,
    marginRight: 8,
    marginTop: 10,
    borderRadius: 21,
  },
  input: {
    flex: 1,
    fontSize: 18,
    height: 50,
    lineHeight: 28,
    padding: 10,
    border: "1px solid #e5e7eb",
    borderRadius: 10,
  },
  mediaButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  mediaPreviewContainer: {
    marginTop: 20,
    borderRadius: 10,
    overflow: "hidden",
  },
  textareaContainer: {
    height: 110,
    padding: 5,
    backgroundColor: "#F5FCFF",
  },
  textarea: {
    textAlignVertical: "top", // hack android
    height: 100,
    fontSize: 14,
    color: "#333",
  },
  liveHeader:{
    backgroundColor: '#14457b',
    height: 40,
    display:'flex',
    alignItems:"center",
    justifyContent:"center"
   

  },
  liveHeaderTitle:{
    color:'white',
    fontSize:16,
  
    fontWeight:"bold"
  }
});
