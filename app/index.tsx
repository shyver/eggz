import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Button, ProgressBar } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useFonts, Fredoka_400Regular, Fredoka_700Bold } from '@expo-google-fonts/fredoka';
import * as SplashScreen from 'expo-splash-screen';
import EggSmile from '@/assets/images/eggsmile.svg';
import EggSmilePng from '@/assets/images/eggsmile.png';
import EggSmallLaugh from '@/assets/images/egg_small_laugh.png';
import EggBigLaugh from '@/assets/images/egg_big_laugh.png';
import EggCrazyLaugh from '@/assets/images/egg_crazy_laugh.png';
import { Pause, Play, RotateCcw, Square, Timer } from 'lucide-react-native';
SplashScreen.preventAutoHideAsync();


export default function App() {
  const [loaded, error] = useFonts({
    Fredoka_400Regular,
    Fredoka_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);
  

  const [time, setTime] = useState(360); // 6 minutes default
  const [running, setRunning] = useState(false);
  const [softToHard, setSoftToHard] = useState(0.5); // Slider position

  useEffect(() => {
    
    let interval;
    if (running && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    } else if (time === 0) {
      setRunning(false);
      alert('Egg is ready!');
    }
    return () => clearInterval(interval);
  }, [running, time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <Image source={ time<40? EggCrazyLaugh : time<180? EggBigLaugh : time<360? EggSmallLaugh :  EggSmilePng} style={styles.image} />
      <Text style={styles.timerText}>{formatTime(time)}</Text>
      <ProgressBar progress={1 - time / 360} color='#f4c951' style={styles.progressBar} />
      <View style={styles.buttonRow}>
        <Button
          mode='contained'
          onPress={() =>{ 
            setTime(360);
            setRunning(false)}}
          style={styles.circleSecondaryButton}
          contentStyle={styles.circleSecondaryButtonContent}
        >
          <Square size={25} fill="#d35b46" />
        </Button>
        <Button
          mode='contained'
          onPress={() => setRunning(!running)}
          style={styles.circleButton}
          contentStyle={styles.circleButtonContent}
        >
          {running ? <Pause size={25} fill="white" /> : <Play size={25} fill="white" />}
        </Button>
        <Button
          mode='contained'
          onPress={() => setTime(360)}
          style={styles.circleSecondaryButton}
          contentStyle={styles.circleSecondaryButtonContent}
        >
          <RotateCcw size={25} stroke="#d35b46" />
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDE4CF',
  },
  image: {
    width: 180,
    height: 250,
    marginTop: 50,
  },
  timerText: {
    fontSize: 42,
    marginBottom: 20,
    color: '#D35B46',
    fontFamily: 'Fredoka_700Bold',
  },
  progressBar: {
    width: 200,
    height: 10,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
  },
  circleButton: {
    backgroundColor: '#d35b46', // Change this to your desired color
    borderRadius: 50, // Make it circular
    width: 75,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  circleSecondaryButton: {
    backgroundColor: '#ffc3a3', // Change this to your desired color
    borderRadius: 50, // Make it circular
    width: 75,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  circleButtonContent: {
    width: 75,
    height: 75,
  },
  circleSecondaryButtonContent: {
    width: 75,
    height: 75,
  },
  resetButton: {
    marginTop: 10,
  },
});