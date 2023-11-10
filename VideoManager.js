// VideoManager.js
import React, { useState } from 'react';
import { View, Button, Text, Alert, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';
import { Video } from 'expo-av';

const videoOptions = [
  {
    title: '1.3GB Video',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    title: '200MB Video',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  },
  {
    title: '20MB Video',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  },
];

const VideoManager = () => {
  const [videoPath, setVideoPath] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadedVideos, setDownloadedVideos] = useState([]);

  const saveVideo = async (video) => {
    try {
      setIsLoading(true);

      // Download the video with SSL verification disabled (only for development)
      const downloadResumable = FileSystem.createDownloadResumable(
        video.url,
        FileSystem.documentDirectory + `downloadedVideo_${Date.now()}.mp4`,
        {},
        (downloadProgress) => {
          const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
          console.log(`Downloading... ${Math.round(progress * 100)}% complete`);
        }
      );

      const { uri } = await downloadResumable.downloadAsync();

      // Securely store the video path
      await SecureStore.setItemAsync('videoPath', uri);

      setVideoPath(uri);
      setIsLoading(false);

      // Update the list of downloaded videos
      setDownloadedVideos((prevVideos) => [...prevVideos, { title: video.title, uri }]);

      Alert.alert('Video Downloaded and Stored Securely!');
    } catch (error) {
      console.error('Error downloading video:', error);
      setIsLoading(false);
      Alert.alert('Error downloading video. Please try again.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Secure Video Storage</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.buttonContainer}>
        {videoOptions.map((video, index) => (
          <View key={index} style={styles.buttonWrapper}>
            <Button
              title={video.title}
              onPress={() => saveVideo(video)}
              disabled={isLoading}
              style={styles.button}
            />
          </View>
        ))}
      </ScrollView>
      {isLoading && <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />}
      {videoPath ? (
        <View style={styles.videoContainer}>
          <Text style={styles.videoTitle}>Stored Video Path:</Text>
          <Text style={styles.videoPath}>{videoPath}</Text>
        </View>
      ) : null}
      {downloadedVideos.length > 0 && (
        <View style={styles.downloadedVideosContainer}>
          <Text style={styles.downloadedVideosTitle}>Downloaded Videos</Text>
          {downloadedVideos.map((video, index) => (
            <View key={index} style={styles.videoPlayerContainer}>
              <Text style={styles.videoTitle}>{video.title}</Text>
              <Video
                source={{ uri: video.uri }}
                style={styles.videoPlayer}
                useNativeControls
                resizeMode="contain"
                isLooping
              />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 20,
  },
  buttonWrapper: {
    marginRight: 10,
  },
  button: {
    width: 120, // Set the width of the buttons
  },
  videoContainer: {
    marginTop: 20,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  videoPath: {
    marginTop: 5,
  },
  downloadedVideosContainer: {
    marginTop: 20,
  },
  downloadedVideosTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  videoPlayerContainer: {
    marginBottom: 20,
  },
  videoPlayer: {
    width: 300,
    height: 200,
  },
});

export default VideoManager;
