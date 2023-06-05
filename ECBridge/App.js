import React from 'react';
import { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, Pressable, Alert, Modal, KeyboardAvoidingView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import {Picker} from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


const GameScreens = createStackNavigator();
const Tab = createBottomTabNavigator();

import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://a330883a5bd441eba480adf1684ff034@o4504266723688448.ingest.sentry.io/4505070143668224",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
  enableInExpoDevelopment: false,
  enableNative: false,
});

async function store(key, value) {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    Alert.alert("Storage error! [0003]")
  }
}

async function getStore(key) {
  try {
    const value = await AsyncStorage.getItem(key)
    console.log(value)
    return value
  } catch(e) {
    Alert.alert("Storage error! [0004]")
  }
}

function Login({navigation}) {
  return(
    <View>
      <Text>Hello</Text>
    </View>
  )
}

function Register({ navigation }) {
  const [PIN, onChangePIN] = React.useState('');
  const [Name, onChangeName] = React.useState('');
  const [PName, onChangePName] = React.useState('');
  const [IP, onChangeIP] = React.useState('');
  const [isVisible, onChangeVis] = React.useState()

  function check() {
    if (getStore("reg") !== true) {
      onChangeVis(true);
    }
  };

  function checkLogin(){
    navigation.navigate("Game", { screen: 'Login' })
  }

  async function login(ip) {
    await fetch(`http://${ip}:3000/login/${PIN}/${Name}/${PName}`)
    //parse string response
      .then(response => response.json())
      .then(data => {
        store("token", data.token)
        console.log(data)
        return data;
      })
  }

  

  function initSub() {
    if (PIN == '') {
      Alert.alert("You must enter your pair number! [0001]")
    } if (Name =='') {
      Alert.alert("You must enter your name! [0001]")
    } if (PName =='') {
      Alert.alert("You must enter your partner's name! [0001]")
    } if (IP == '') {
      Alert.alert("You must enter an IP address! [0001]")
    } else {
      Alert.alert(PIN)
      store("PIN", PIN)
      store("Name", Name)
      store("PName", PName)
      try {
        const cred = login()
      } catch(error) {
        Alert.alert(error)
      };
      navigation.navigate("Game", { screen: 'Entry', params: {PINZ: 5555} })
     }
  };
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.head}>Welcome to ECBridge</Text>
      </View>
      <Text style={styles.t}>Please enter the game PIN:</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangePIN}
        value={PIN}
        keyboardType="numeric"
      />
      <Text style={styles.t}>Please enter the server IP:</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeIP}
        value={IP}
        keyboardType="numeric"
      />
      <Text style={styles.t}>Please enter your name:</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangeName}
        value={Name}
      />
      <Text style={styles.t}>Please enter your partner's name:</Text>
      <TextInput
        style={styles.input}
        onChangeText={onChangePName}
        value={PName}
      />
      <View style={{alignItems: 'center', paddingTop: 20}}>
        <Pressable style={styles.button} onPress={initSub}>
          <Text style={{textAlign: 'center', fontSize: 20}}>Connect</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

function Menu({navigation}) {
  return(
    <View style={{alignItems: 'center', paddingTop: 20}}>
      <Pressable style={styles.button} onPress={Navigation.push("Score", {PINZ: "5555"})}>
        <Text style={{textAlign: 'center', fontSize: 20}}>Game</Text>
      </Pressable>
    </View>
  )
}

//Score entry

function pairandBoard({navigation, route}) {
  pass
};

function Score({navigation, route}) {
  const [selectedSuit, setSelectedSuit] = React.useState();
  const [selectedBid, setSelectedBid] = React.useState(0);
  const [selectedMade, setSelectedMade] = React.useState();
  const gameStyles = StyleSheet.create({
    iden: {
      backgroundColor: 'slategrey',
      padding: 20,
      flexDirection: 'row',
    },
    sGrid: {
      //align right
      alignItems: 'flex-end'
    },
    gridElem: {
      padding: 20,
      // backgroundColor: selected ? "red" : "transparent",
    }
  })

  return(
    <View>
    <View style={gameStyles.iden}>
      <Text style={{fontSize: 28, color: 'blue', paddingTop: 10, paddingRight: 60}}>Pair Number: {route.params.PINZ}</Text>
      <Pressable ><Ionicons name={"caret-forward-circle-outline"} size={50} color={'lime'}/></Pressable>
    </View>
    <View>
    <Text sytle={styles.entryLabel}>Please enter the suit:</Text>
    <Picker
      selectedValue={selectedSuit}
      itemStyle={{fontSize: 45}}
      selectionColor="green"
      onValueChange={(itemValue, itemIndex) => {
        setSelectedSuit(itemValue)
        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      }}>
      <Picker.Item color="green" label="♣️" value="1" />
      <Picker.Item label="♥️" value="2" />
      <Picker.Item label="♦️" value="3" />
      <Picker.Item label="♠️" value="4" />
      <Picker.Item label="NT" value="0" />
    </Picker>
    <Text sytle={styles.entryLabel}>Please enter the bid:</Text>
    <Picker
      selectedValue={selectedBid}
      itemStyle={{fontSize: 45}}
      onValueChange={(itemValue, itemIndex) => {
        setSelectedBid(itemValue)
        // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
      }}>
      <Picker.Item label="1" value="1" />
      <Picker.Item label="2" value="2" />
      <Picker.Item label="3" value="3" />
      <Picker.Item label="4" value="4" />
      <Picker.Item label="5" value="5" />
      <Picker.Item label="6" value="6" />
      <Picker.Item label="7" value="7" />
    </Picker>
    <Text style={styles.entryLabel}>{parseInt(selectedBid) + 6} to make</Text>
    </View>
    </View>
  )
};

//Styles

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'slategray',
    alignItems: 'center',
    fontSize: 30,
    paddingBottom: 50,
    paddingTop: 0,
    textAlight: 'center',
  },
  entryLabel: {
    fontSize: 20,

  },
  input: { 
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    textAlign: 'center',
  },
  head: {
    fontSize: 30,
  },
  root: {
    // backgroundColor: 'grey',
  },
  button: {
    backgroundColor: 'grey',
    padding: 10,
    width: 250,
    borderRadius: 10,
  },
  t: {
    paddingLeft: 10,
  }
});

//STACKS

function GameStack() {
  return (
    <GameScreens.Navigator screenOptions={{
      headerShown: false,
    }}>
      <GameScreens.Screen name="Home" component={Register} />
      <GameScreens.Screen name="Entry" component={Score} />
      <GameScreens.Screen name="Menu" component={Menu} />
      <GameScreens.Screen name="Login" component={Login} />
    </GameScreens.Navigator>
  );
}

function MainStack() {
  return(
    <NavigationContainer independent={true}>
      <Tab.Navigator   screenOptions={{
        tabBarStyle: { position: 'absolute' },
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'ios-list'
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'lime',
        tabBarInactiveTintColor: 'gray',
      }}>
        <Tab.Screen name="Game" component={GameStack} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default Sentry.wrap(function App() {
  return (
    <NavigationContainer independent={true}>
      <MainStack/>
    </NavigationContainer>
  );
});
