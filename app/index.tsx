import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';
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
import * as Notifications from 'expo-notifications';
SplashScreen.preventAutoHideAsync();
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [loaded, error] = useFonts({
    Fredoka_400Regular,
    Fredoka_700Bold,
  });
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    if (loaded || error) {
      
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);
  

  const [time, setTime] = useState(720); // 6 minutes default
  const [running, setRunning] = useState(false);
  const [softToHard, setSoftToHard] = useState(0.5); // Slider position

  useEffect(() => {
    
    let interval;
    if (running && time > 0) {
      interval = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }
    if (running && time===540) {
      
      schedulePushNotification('Egg is Soft boiled!');
    }
    else if ( running && time===360) {
      schedulePushNotification('Egg is medium boiled!');
    }
    else if (running && time === 0) {
      setRunning(false);
      alert('Egg is ready!');
      schedulePushNotification('Egg is ready!');
    }
    return () => clearInterval(interval);
  }, [running, time]);

  const formatTime = (seconds) => {
    const incr = 720 - seconds;
    const minutes = Math.floor(incr / 60);
    const secs = incr % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <View style={styles.container}>
      <StatusBar style='auto' />
      <Image source={ time<360? EggCrazyLaugh : time<540? EggBigLaugh : time<720? EggSmallLaugh :  EggSmilePng} style={styles.image} />
      <Text style={styles.timerText}>{formatTime(time)}</Text>
      <ProgressBar progress={1 - time / 720} color='#f4c951' style={styles.progressBar} />
      <View style={styles.levelTextContainer}>
        <Text style={styles.softLevelText}>Soft</Text>
        <Text style={styles.mediumLevelText}>Medium</Text>
        <Text style={styles.levelText}>Hard</Text>
      </View>
      <View style={styles.buttonRow}>
        <Button
          mode='contained'
          onPress={() =>{ 
            setTime(720);
            setRunning(false)}}
          style={styles.circleSecondaryButton}
          contentStyle={styles.circleSecondaryButtonContent}
        >
          <Square size={25} fill="#d35b46" />
        </Button>
        <Button
          mode='contained'
          onPress={() =>{
            if (time > 0)
            {

              setRunning(!running)
            }else{
              setTime(720);
              setRunning(true)
            }
          } }
          style={styles.circleButton}
          contentStyle={styles.circleButtonContent}
        >
          {running ? <Pause size={25} fill="white" /> : <Play size={25} fill="white" />}
        </Button>
        <Button
          mode='contained'
          onPress={() => setTime(720)}
          style={styles.circleSecondaryButton}
          contentStyle={styles.circleSecondaryButtonContent}
        >
          <RotateCcw size={25} stroke="#d35b46" />
        </Button>
      </View>
    </View>
  );
}

async function schedulePushNotification(text:string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Eggz",
      body: text,
      data: { data: 'goes here' },
    },
    trigger: { seconds: 1 },
  });
}
async function registerForPushNotificationsAsync() {
  let token;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;

  return token;
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
  levelTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 20,
    marginTop:-15
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D35B46',
    fontFamily: 'Fredoka_700Bold',
  },
  softLevelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D35B46',
    fontFamily: 'Fredoka_700Bold',
    marginLeft: 30,
  },
  mediumLevelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D35B46',
    fontFamily: 'Fredoka_700Bold',
    marginLeft: -20,
  },
});