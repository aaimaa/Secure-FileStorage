// App.js
import React from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, View } from 'react-native';
import VideoManager from './VideoManager';

export default function App() {
  return (
    <View style={styles.container}>
      <VideoManager />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
