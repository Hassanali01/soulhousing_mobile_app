import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import axiosConfig from '../../components/axiosConfig'
import { formatDistanceToNowStrict } from 'date-fns';
import locale from 'date-fns/locale/en-US';
import formatDistance from '../../components/formatDistanceCustom';
import { useRouter } from 'expo-router';
import RenderItem from '../../components/RenderItem';
import { AuthContext } from '../../components/AuthProvider';

export default function HomeScreen({ route, navigation }) {
  const [data, setData] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [isAtEndOfScrolling, setIsAtEndOfScrolling] = useState(false);
  const flatListRef = useRef();
  const { user } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    getAllTweets();
  }, [page]);

  // useEffect(() => {
  //   if (route.params?.newTweetAdded || route.params?.tweetDeleted) {
  //     getAllTweetsRefresh();
  //     flatListRef.current.scrollToOffset({
  //       offset: 0,
  //     });
  //   }
  // }, [route.params?.newTweetAdded, route.params?.tweetDeleted]);

  function getAllTweetsRefresh() {
    setPage(1);
    setIsAtEndOfScrolling(false);
    setIsRefreshing(false);

    axiosConfig.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${user.token}`;

    axiosConfig
      .get(`/tweets`)
      .then(response => {
        setData(response.data.data);
        setIsLoading(false);
        setIsRefreshing(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
        setIsRefreshing(false);
      });
  }

  function getAllTweets() {
    axiosConfig.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${user.token}`;

    axiosConfig
      .get(`/tweets?page=${page}`)
      .then(response => {
        // console.log(response.data);
        if (page === 1) {
          setData(response.data.data);
        } else {
          setData([...data, ...response.data.data]);
        }

        if (!response.data.next_page_url) {
          setIsAtEndOfScrolling(true);
        }
        setIsLoading(false);
        setIsRefreshing(false);
      })
      .catch(error => {
        console.log(error);
        setIsLoading(false);
        setIsRefreshing(false);
      });
  }

  

  function handleRefresh() {
    setPage(1);
    setIsAtEndOfScrolling(false);
    setIsRefreshing(true);
    getAllTweets();
  }

  function handleEnd() {
    setPage(page + 1);
  }

  function gotoNewTweet() {
    router.push('/tweet');
  }

  return (
    <>
     <View style={styles.liveHeader}>
        <Text style={styles.liveHeaderTitle}>Live Streams</Text>
       </View>
    <View style={styles.container}>
       <StatusBar style="light" backgroundColor="#14457b"/>
      
      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 8 }} size="large" color="gray" />
      ) : (
        <FlatList
          ref={flatListRef}
          data={data && data}
          renderItem={props => <RenderItem {...props}/>}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={() => (
            <View style={styles.tweetSeparator}></View>
          )}
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          onEndReached={handleEnd}
          onEndReachedThreshold={0}
          ListFooterComponent={() =>
            !isAtEndOfScrolling && (
              <ActivityIndicator size="large" color="gray" />
            )
          }
        />
      )}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => gotoNewTweet()}
      >
        <AntDesign name="plus" size={26} color="white" />
      </TouchableOpacity>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#99c7f7',
    paddingRight:10,
    paddingLeft:10,
   paddingTop:10
  },
  tweetSeparator: {
    marginTop:10,
  
    // borderBottomWidth: 1,
    // borderBottomColor: '#e5e7eb',
  },
  floatingButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#14457b',
    position: 'absolute',
    bottom: 20,
    right: 12,
  },
  itemContainer: { // Define style for each item
    backgroundColor: 'white', // Set background color to white
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
