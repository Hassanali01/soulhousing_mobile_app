import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Fontisto, FontAwesome, AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import { Video } from "expo-av";
import { useRouter } from "expo-router";
import { formatDistanceToNowStrict } from "date-fns";
import locale from "date-fns/locale/en-US";
import formatDistance from "./formatDistanceCustom";
import axiosConfig from "../components/axiosConfig";
import { AuthContext } from "./AuthProvider";

export default function RenderItem({ item: tweet }) {
  const [isLiked, setIsLiked] = useState(tweet.is_liked || false);
  const [likeCount, setLikeCount] = useState(tweet.like_count || 0);
  const [comments, setComments] = useState([]);
  const [showAddComment, setShowAddComment] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [remainingComments, setRaimainingComments] = useState([]);
  const [remainingLikes, setRaimainingLikes] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(true);
  const [offset, setOffset] = useState(0); // Initial offset
  const [likeOffset,setLikeOffSet] = useState(0)
  const [showAllLikes,setShowAllLikes] = useState(true)
  const [remainingLikesButton,setRemainingLikesButton] = useState(true)
  const [loadingComments, setLoadingComments] = useState(false);
  const [showRemainingLikes, setShowRemainingLikes] = useState(false);
  const [hideRemainingLikes, setHideRemainingLikes] = useState(true);
  const [loadingMoreLikes, setLoadingMoreLikes] = useState(false);
  const [showRemaining, setShowRemaining] = useState(true);
  const [hideRemaining, setHideRemaining] = useState(true);
  const [loadingLikes,setLoadingLikes] = useState(false)
  const [likes,setLikes] = useState([])
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const screenWidth = Dimensions.get("window").width;
  const mediaWidth = screenWidth - 20; // 10 padding on each side
  const [loadingMoreComments, setLoadingMoreComments] = useState(false);

  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const [commentsModalVisible, setCommentsModalVisible] = useState(false);
  const [likesList, setLikesList] = useState([]);

  // useEffect(() => {
  //   getAllComments(0); // Load initial comments
  // }, []);

  const toggleLike = async () => {
    try {
      axiosConfig.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${user.token}`;

      const response = await axiosConfig.post("/like-post", {
        tweet_id: tweet.id,
        action: isLiked ? "unlike" : "like",
      });
      if (response.status === 200) {
        setIsLiked(!isLiked);
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
      }
    } catch (error) {
      console.error("Error liking the tweet:", error);
    }
  };

  const getAllLikes = async (newOffset) => {
    setLoadingLikes(true);
    try {
      axiosConfig.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${user.token}`;

      const response = await axiosConfig.post("/likes", {
        params: {
          post_id: tweet.id,
          offset: newOffset,
        },
      });

      if (newOffset === 0) {
        setLikes(response.data);
      } else {
        setLikes((prevLikes) => [...prevLikes, ...response.data]);
      }
      setLikeOffSet(newOffset);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingLikes(false);
      setLoadingMoreLikes(false);
    }
  };


  

  const getAllComments = async (newOffset) => {
    setLoadingComments(true);
    try {
      axiosConfig.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${user.token}`;

      const response = await axiosConfig.post("/comments", {
        params: {
          post_id: tweet.id,
          offset: newOffset,
        },
      });

      if (newOffset === 0) {
        setComments(response.data);
      } else {
        setComments((prevComments) => [...prevComments, ...response.data]);
      }
      setOffset(newOffset);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
      setLoadingMoreComments(false);
    }
  };
  const getRemainingLikes = async (newOffset) => {
    setLoadingLikes(true);
    try {
      axiosConfig.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${user.token}`;

      const response = await axiosConfig.post("/likes", {
        params: {
          post_id: tweet.id,
          offset: newOffset,
        },
      });

      setRaimainingLikes(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
     setLoadingLikes(false);
      setLoadingMoreLikes(false);
    }
  };

  const getRemainingComments = async (newOffset) => {
    setLoadingComments(true);
    try {
      axiosConfig.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${user.token}`;

      const response = await axiosConfig.post("/comments", {
        params: {
          post_id: tweet.id,
          offset: newOffset,
        },
      });

      setRaimainingComments(response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
      setLoadingMoreComments(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      axiosConfig.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${user.token}`;

      const response = await axiosConfig.post("/comment-post", {
        tweet_id: tweet.id,
        comment: newComment,
      });
      if (response) {
        setNewComment("");
        getAllComments(0);
        // Optionally, refresh comments here if needed
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const fetchLikesList = async () => {
    setLikesList(tweet.likes);
    setLikesModalVisible(true);
  };

  const renderMedia = () => {
    if (tweet.file_type === "image") {
      return (
        <View style={styles.mediaContainer}>
          {imageLoading && (
            <ActivityIndicator
              style={styles.loadingIndicator}
              size="large"
              color="#0000ff"
            />
          )}
          <Image
            source={{ uri: tweet.file_path }}
            style={[
              styles.media,
              {
                width: mediaWidth,
                aspectRatio: 4 / 3,
                paddingRight: 10,
                marginTop: 10,
              },
            ]}
            resizeMode="cover"
            onLoad={() => setImageLoading(false)}
          />
        </View>
      );
    } else if (tweet.file_type === "video") {
      return (
        <View style={styles.mediaContainer}>
          {videoLoading && (
            <ActivityIndicator
              style={styles.loadingIndicator}
              size="large"
              color="#0000ff"
            />
          )}
          <Video
            source={{ uri: tweet.file_path }}
            style={[
              styles.media,
              {
                width: mediaWidth,
                aspectRatio: 4 / 3,
                paddingRight: 10,
                marginTop: 10,
              },
            ]}
            useNativeControls
            resizeMode="cover"
            onLoad={() => setVideoLoading(false)}
          />
        </View>
      );
    }
    return null;
  };
  const handleViewAllComments = async () => {
    setLoadingMoreComments(true);
    await getRemainingComments(offset + 5); // Load more comments by incrementing offset by 5
  };
  const handleViewAllLikes = async () => {
    setLoadingMoreLikes(true);
    await getRemainingLikes(offset + 5); // Load more comments by incrementing offset by 5
  };
  const handleResetLikes = async ()=>{
    await getAllLikes(0)
    await getRemainingLikes(0)
  }
  const handleResetComments = async()=>{
    await getAllComments(0)
    await getRemainingComments(0)
  }
  // console.log("tweet,tweet",tweet)
  // console.log("commentssss", remainingComments);
  console.log("remainigLikes",remainingLikes)
  return (
    <>
      <SafeAreaView>
        <ScrollView>
          <View style={styles.back}>
            <View style={styles.tweetContainer}>
              <TouchableOpacity onPress={() => gotoProfile(tweet.user.id)}>
                <Image
                  style={styles.avatar}
                  source={{ uri: tweet.user && tweet.user.avatar }}
                />
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  style={styles.flexRow}
                  onPress={() => gotoSingleTweet(tweet.id)}
                >
                  <Text numberOfLines={1} style={styles.tweetName}>
                    {tweet.user && tweet.user.name}
                  </Text>
                  <Text numberOfLines={1} style={styles.tweetHandle}>
                    @{tweet.user && tweet.user.username}
                  </Text>
                  <Text>&middot;</Text>
                  <Text numberOfLines={1} style={styles.tweetHandle}>
                    {formatDistanceToNowStrict(new Date(tweet.created_at), {
                      locale: {
                        ...locale,
                        formatDistance,
                      },
                    })}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.tweetContentContainer}>
              <Text style={styles.tweetContent}>
                {tweet.body && tweet.body}
              </Text>
              {renderMedia()}
            </View>
            <View style={styles.engagementContainer}>
              <TouchableOpacity
                onPress={toggleLike}
                style={styles.engagementButton}
              >
                <FontAwesome
                  name={isLiked ? "thumbs-up" : "thumbs-o-up"}
                  size={24}
                  color={isLiked ? "yellow" : "black"}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowAddComment((prev) => !prev)}
                style={styles.flipIcon}
              >
                <FontAwesome name="comment-o" size={24} color="black" />
              </TouchableOpacity>
            </View>

            
            <TouchableOpacity
              style={styles.totalLikes}
              onPress={()=>{getAllLikes(0);setLikesModalVisible(true)}}
            >
              <Text style={styles.like}>
                {tweet.total_likes && tweet.total_likes} likes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.totalComments}
              onPress={() => {
                setCommentsModalVisible(true);
                getAllComments(0);
                // setShowRemaining(false);
              }}
            >
              <Text style={styles.comments}>
                View all {tweet.comments && tweet.comments} comments
              </Text>
            </TouchableOpacity>
            <View style={styles.commentSection}>
              <Modal
                visible={commentsModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setCommentsModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Comments</Text>
                    <View style={styles.horizontalLine} />
                    {loadingComments && (
                      <ActivityIndicator
                        style={styles.loadingIndicator}
                        size="small"
                        color="#0000ff"
                      />
                    )}
                    {!showRemaining && (
                      <FlatList
                        data={
                          comments.latest_comments && comments.latest_comments
                        }
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                          <View style={styles.likesContainer}>
                            <View style={styles.tweetContainer}>
                              <Image
                                style={styles.avatar}
                                source={{
                                  uri: item.user.image && item.user.image,
                                }}
                              />
                              <View>
                                {console.log("item", item)}

                                <Text style={styles.tweetName}>
                                  <Text>
                                    {item.user.name && item.user.name}{" "}
                                  </Text>

                                  <Text style={styles.likesUsername}>
                                    {" "}
                                    @{item.user_name && item.user_name}{" "}
                                  </Text>
                                  <Text
                                    numberOfLines={1}
                                    style={styles.tweetHandle}
                                  >
                                    {formatDistanceToNowStrict(
                                      new Date(item.date && item.date),
                                      {
                                        locale: {
                                          ...locale,
                                          formatDistance,
                                        },
                                      }
                                    )}
                                  </Text>
                                </Text>
                                <Text>{item.comment && item.comment}</Text>
                              </View>
                            </View>
                          </View>
                        )}
                      />
                    )}
                    {/* <Text>Hello</Text> */}
                    {showRemaining && (
                      <FlatList
                        data={
                          remainingComments.latest_comments &&
                          remainingComments.latest_comments
                        }
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                          <View style={styles.likesContainer}>
                            <View style={styles.tweetContainer}>
                              <Image
                                style={styles.avatar}
                                source={{
                                  uri: item.user.image && item.user.image,
                                }}
                              />
                              <View>
                                {console.log("itemRemain", item)}

                                <Text style={styles.tweetName}>
                                  <Text>
                                    {item.user.name && item.user.name}{" "}
                                  </Text>

                                  <Text style={styles.likesUsername}>
                                    {" "}
                                    @{item.user_name && item.user_name}{" "}
                                  </Text>
                                  <Text
                                    numberOfLines={1}
                                    style={styles.tweetHandle}
                                  >
                                    {formatDistanceToNowStrict(
                                      new Date(item.date && item.date),
                                      {
                                        locale: {
                                          ...locale,
                                          formatDistance,
                                        },
                                      }
                                    )}
                                  </Text>
                                </Text>
                                <Text>{item.comment && item.comment}</Text>
                              </View>
                            </View>
                          </View>
                        )}
                      />
                    )}
                    {showRemaining && (
                      <Text
                        style={styles.remainigComments}
                        onPress={() => {
                          handleViewAllComments();
                          setShowRemaining(true);
                        }}
                      >
                        {loadingMoreComments
                          ? "Loading..."
                          : `View remaining ${
                              remainingComments.remaining_comments || 0
                            } comments`}
                      </Text>
                    )}
                    {hideRemaining && (
                      <Text
                        style={styles.remainigComments}
                        onPress={() => {
                          handleViewAllComments();
                          setHideRemaining(false);
                          setShowRemaining(true);
                        }}
                      >
                        {loadingMoreComments
                          ? "Loading..."
                          : `View remaining ${
                              comments.remaining_comments || 0
                            } comments`}
                      </Text>
                    )}

                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => {setCommentsModalVisible(false);handleResetComments();setShowRemaining(true)}}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
              {showAddComment && (
                <View style={styles.newCommentContainer}>
                  <TextInput
                    style={styles.commentInput}
                    value={newComment}
                    onChangeText={setNewComment}
                    placeholder="Write a comment..."
                  />
                  <TouchableOpacity
                    onPress={handleCommentSubmit}
                    style={styles.submitButton}
                  >
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          <Modal
            visible={likesModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setLikesModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>LIKED BY</Text>
                <View style={styles.horizontalLine} />
                {console.log("likesss",likes)}
                {loadingLikes && (
                      <ActivityIndicator
                        style={styles.loadingIndicator}
                        size="small"
                        color="#0000ff"
                      />
                    ) }
                {showAllLikes && ( <FlatList
                  data={likes.latest_likes && likes.latest_likes}
                  keyExtractor={(item) => item.tweet_id}
                  renderItem={({ item }) => (
                    <View style={styles.likesContainer}>
                      {/* {console.log("listLikes",item)} */}
                      <View style={styles.tweetContainer}>
                        <Image
                          style={styles.avatar}
                          source={{ uri: item.user.image }}
                        />
                        <View>
                          <Text style={styles.tweetName}>
                            <Text>{item.user.name && item.user.name} </Text>

                            <Text style={styles.likesUsername}>
                              {" "}
                              @{item.user_name && item.user_name}{" "}
                            </Text>
                            <Text numberOfLines={1} style={styles.tweetHandle}>
                              {formatDistanceToNowStrict(
                                new Date(item.created_at && item.created_at),
                                {
                                  locale: {
                                    ...locale,
                                    formatDistance,
                                  },
                                }
                              )}
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                />)}
               <Text>hello</Text>
                {!showAllLikes && ( <FlatList
                  data={remainingLikes.latest_likes && remainingLikes.latest_likes}
                  keyExtractor={(item) => item.tweet_id}
                  renderItem={({ item }) => (
                     
                    <View style={styles.likesContainer}>
                      <View style={styles.tweetContainer}>
                        <Image
                          style={styles.avatar}
                          source={{ uri: item.user.image }}
                        />
                        <View>
                          <Text style={styles.tweetName}>
                            <Text>{item.user.name && item.user.name} </Text>

                            <Text style={styles.likesUsername}>
                              {" "}
                              @{item.user_name && item.user_name}{" "}
                            </Text>
                            <Text numberOfLines={1} style={styles.tweetHandle}>
                              {formatDistanceToNowStrict(
                                new Date(item.created_at && item.created_at),
                                {
                                  locale: {
                                    ...locale,
                                    formatDistance,
                                  },
                                }
                              )}
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                />)}
                 
                  {!remainingLikesButton && (
                      <Text
                        style={styles.remainigComments}
                        onPress={() => {
                          handleViewAllComments();
                          setShowRemaining(true);
                        }}
                      >
                        {loadingMoreLikes
                          ? "Loading..."
                          : `View remaining ${
                              remainingLikes.remaining_likes || 0
                            } likes`}
                      </Text>
                    )}
               
                     {remainingLikesButton && (<Text
                        style={styles.remainigComments}
                        onPress={() => {
                          handleViewAllLikes();
                         setShowAllLikes(false)
                         setRemainingLikesButton(false)
                        }}
                      >
                        {loadingMoreLikes
                          ? "Loading..."
                          : `View remaining ${
                              likes.remaining_likes || 0
                            } likes`}
                      </Text>)} 
                  
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {setLikesModalVisible(false);handleResetLikes();setShowAllLikes(true)}}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* <Modal
            visible={likesModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setLikesModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>LIKED BY</Text>
                <View style={styles.horizontalLine} />
                <FlatList
                  data={tweet.likes}
                  keyExtractor={(item) => item.tweet_id}
                  renderItem={({ item }) => (
                    <View style={styles.likesContainer}>
                      <View style={styles.tweetContainer}>
                        <Image
                          style={styles.avatar}
                          source={{ uri: item.avatar }}
                        />
                        <View>
                          <Text style={styles.tweetName}>
                            <Text>{item.name && item.name} </Text>

                            <Text style={styles.likesUsername}>
                              {" "}
                              @{item.user_name && item.user_name}{" "}
                            </Text>
                            <Text numberOfLines={1} style={styles.tweetHandle}>
                              {formatDistanceToNowStrict(
                                new Date(item.created_at),
                                {
                                  locale: {
                                    ...locale,
                                    formatDistance,
                                  },
                                }
                              )}
                            </Text>
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                />
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setLikesModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal> */}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: "row",
    backgroundColor: "white",
  },
  tweetContainer: {
    flexDirection: "row",
  },
  likesContainer: {
    marginTop: 15,
  },
  likesName: {
    marginRight: 10,
  },
  likesUsername: {
    color: "gray",
  },
  back: {
    backgroundColor: "white",
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 12,
    paddingRight: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    marginRight: 8,
    borderRadius: 21,
  },
  tweetName: {
    fontWeight: "bold",
    color: "#222222",
  },
  tweetHandle: {
    marginHorizontal: 8,
    color: "gray",
  },
  tweetContentContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  tweetContent: {
    lineHeight: 20,
  },
  media: {
    paddingRight: 10,
  },
  engagementContainer: {
    flexDirection: "row",
  },
  engagementButton: {
    padding: 2,
    marginRight: 10,
  },
  liked: {
    color: "red",
  },
  commentSection: {
    marginTop: 20,
  },
  commentContainer: {
    paddingVertical: 5,
  },
  commentText: {
    color: "#333",
  },
  newCommentContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "#1DA1F2",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  submitButtonText: {
    color: "white",
  },
  totalLikes: {
    marginTop: 5,
  },
  totalComments: {
    marginTop: 5,
  },
  like: {
    fontWeight: "bold",
    fontSize: 14,
  },
  comments: {
    color: "gray",
  },
  remainigComments: {
    color: "gray",
    marginTop: 15,
    marginLeft: 5,
  },
  flipIcon: {
    transform: [{ scaleX: -1 }],
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    // display:'flex',
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,

    // alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    // marginBottom: 2,
  },
  likeUserContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  likeUserAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  likeUserName: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#1DA1F2",
    borderRadius: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
  horizontalLine: {
    width: "100%",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  modalHeader: {
    backgroundColor: "#14457b",
  },
});
