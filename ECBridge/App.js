import React from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Stack = createStackNavigator();

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


function Login({ navigation }) {
  const [PIN, onChangePIN] = React.useState('');
  const [Name, onChangeName] = React.useState('');
  const [PName, onChangePName] = React.useState('');

  async function login() {
    //fetch localhost:3000/skel/login
    //if 401, return false
    //if 200, return true
    await fetch(`http://192.168.0.43:3000/login/${PIN}/${Name}/${PName}`)
    //parse string response
      .then(response => response.json())
      .then(data => {
        store("token", data.token)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function initSub() {
    if (PIN == '') {
      Alert.alert("You must enter your pair number! [0001]")
    } if (Name =='') {
      Alert.alert("You must enter your name! [0002]")
    } if (PName =='') {
      Alert.alert("You must enter your partner's name! [0002]")
    } else {
      Alert.alert(PIN)
      store("PIN", PIN)
      store("Name", Name)
      store("PName", PName)
      let token = login()
      // if (login()) {
      //   // stack navigate to data entry screen
      //   navigation.push("Game", {PINZ: PIN})
      //   console.log(PIN)
      // }
    }
  }

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
}

function Game({navication, route}) {
  const [selected, setSelected] = React.useState(false);
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
      backgroundColor: selected ? "red" : "transparent",
    }
  })
  return(
    <View>
    <View style={gameStyles.iden}>
      <Text style={{fontSize: 28, color: 'blue', paddingTop: 10, paddingRight: 60}}>Pair Number: {route.params.PINZ}</Text>
      <Pressable><Ionicons name={"add-circle-outline"} size={50} color={'lime'}/></Pressable>
    </View>
    <View style={gameStyles.sGrid}>

      {/* scrap this, just slap down a text box input with instructions, and a few text boxes with some validation.
      then I'll add a submit button, and the relevant code. After that, all thats left is to handle the traveler implementation. And the server. */}
      <Pressable onPress={() => setSelected(!selected)} style={gameStyles.gridElem}><Text style={{fontSize: 50}}>♣️</Text></Pressable>
      <Pressable style={gameStyles.gridElem}><Text style={{fontSize: 50, backgroundColor: selected ? "red" : "transparent",}}>♦️</Text></Pressable>
      <Pressable style={gameStyles.gridElem}><Text style={{fontSize: 50, backgroundColor: selected ? "red" : "transparent",}}>♥️</Text></Pressable>
      <Pressable style={gameStyles.gridElem}><Text style={{fontSize: 50, backgroundColor: selected ? "red" : "transparent",}}>♠️</Text></Pressable>
      <Pressable style={gameStyles.gridElem}><Text style={{fontSize: 41.5, backgroundColor: selected ? "red" : "transparent",}}>NT</Text></Pressable>
    </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'slategray',
    alignItems: 'center',
    fontSize: 30,
    paddingBottom: 100,
    paddingTop: 20,
    textAlight: 'center',
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

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Login} />
      <Stack.Screen name="Game" component={Game} />
    </Stack.Navigator>
  );
}


export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
