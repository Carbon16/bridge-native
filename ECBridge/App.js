import React from 'react';
import { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, Pressable, Alert, Modal, KeyboardAvoidingView, Switch } from 'react-native';
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
import { onChange } from 'react-native-reanimated';

Sentry.init({
  dsn: "https://a330883a5bd441eba480adf1684ff034@o4504266723688448.ingest.sentry.io/4505070143668224",

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

function Entry({ navigation }) {
  //on load fetch sked
  return (
    <SafeAreaView style={styles.root}>

    </SafeAreaView>
  );
};

function Register({ navigation }) {
  const [PIN, onChangePIN] = React.useState('');
  const [Name, onChangeName] = React.useState('leo');
  const [PName, onChangePName] = React.useState('asdf');
  const [IP, onChangeIP] = React.useState('172.16.169.39');
  const [isVisible, onChangeVis] = React.useState()

  function check() {
    if (getStore("reg") !== true) {
      onChangeVis(true);
    }
  };

  async function login() {
    try {
      //fetch from server, and return the id in the response
        fetch(`http://172.16.168.241:3000/login/${Name}/${PName}`, {
          method: "POST",
        })
        .then(res => res.json())
        .then(res => {
          store("ID", res)
          console.log(res)
          return res
        })
    } catch(error) {
      console.log(error)
    }
  }

  async function initSub() {
    if (Name =='') {
      Alert.alert("You must enter your name! [0001]")
    } if (PName =='') {
      Alert.alert("You must enter your partner's name! [0001]")
    } if (IP == '') {
      Alert.alert("You must enter an IP address! [0001]")
    } else {
      var id = login()
      Alert.alert(id)
      navigation.navigate('Game', {
        screen: 'Entry',
        params: { ID: id },
      });
    }};
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.head}>Welcome to ECBridge</Text>
      </View>
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

function Decl({navigation, route}) {
  const [Dec, onChangeDEC] = React.useState(' ');
  const [Deck, onChangeDeck] = React.useState('');
  const [Opp, onChangeOpp] = React.useState('')
  function updateSt(val){
    onChangeDEC(val)
    Haptics.NotificationFeedbackType.Success
  }
  return(
    <SafeAreaView >
      <Text style={{fontSize: 45, justifyContent: 'center', transform: [{translateX: 50}]}}>Enter Declarer</Text>
      <View style={{position: 'absolute'}}>
        <Pressable onPress={() => updateSt('N')} style={[styles.trapezoid, {transform: [{rotate: '180deg'}, {translateY: -100}, {translateX: -95}]}]}></ Pressable>
        <Pressable onPress={() => updateSt('W')} style={[styles.trapezoid, {transform: [{rotate: '90deg'}, {translateY: 5}, {translateX: 100}]}]}></ Pressable>
        <Pressable onPress={() => updateSt('E')} style={[styles.trapezoid, {transform: [{rotate: '270deg'}, {translateY: 195}, {translateX: 0}]}]}></ Pressable>
        <Pressable onPress={() => updateSt('S')} style={[styles.trapezoid, {transform: [{rotate: '0deg'}, {translateY: 0}, {translateX: 95}]}]}></ Pressable>
        <Text style={{fontSize: 50, color: 'black', transform: [{translateY: -180}, {translateX: 174}]}}>{Dec}</Text>
        <Text style={{fontSize: 50, color: 'black', transform: [{translateY: -340}, {translateX: 174}]}}>N</Text>
        <Text style={{fontSize: 50, color: 'black', transform: [{translateY: -300}, {translateX: 270}]}}>E</Text>
        <Text style={{fontSize: 50, color: 'black', transform: [{translateY: -260}, {translateX: 174}]}}>S</Text>
        <Text style={{fontSize: 50, color: 'black', transform: [{translateY: -420}, {translateX: 74}]}}>W</Text>
      </View>
      <View style={{paddingTop: 350, paddingLeft: 20}}>
        <Text sytle={styles.entryLabel}>Please enter the opposing pair's number:</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeOpp}
          value={Opp}
          keyboardType="numeric"
        />
        <Text sytle={styles.entryLabel}>Please enter the deck number:</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeDeck}
          value={Deck}
          keyboardType="numeric"
        />
      </View>
    </SafeAreaView>
  );
};

function Vuner({navigation}) {
  var payload = []
  const [isEnabledN, setIsEnabledN] = React.useState(false);
  const [isEnabledE, setIsEnabledE] = React.useState(false);
  const [isEnabledS, setIsEnabledS] = React.useState(false);
  const [isEnabledW, setIsEnabledW] = React.useState(false);
  const [DubVal, setDubVal] = React.useState(0);
  const toggleSwitchN = () => {
    setIsEnabledN(previousState => !previousState)
  };
  const toggleSwitchE = () => {
    setIsEnabledE(previousState => !previousState)
  };
  const toggleSwitchS = () => {
    setIsEnabledS(previousState => !previousState)
  };
  const toggleSwitchW = () => {
    setIsEnabledW(previousState => !previousState)
  };
  return(
    <View style={{alignItems: 'left', paddingTop: 20}}>
      {/* Four switches, each labeled NSEW*/}
      <View style={{paddingHorizontal: 10, paddingVertical: 20}}>
        <View style={{flexDirection: 'row', paddingVertical: 10}}>
          <Text style={{fontSize: 20, paddingHorizontal: 20}}>N </Text>
          <Switch
            trackColor={{false: '#767577', true: '#4CAF50'}}
            thumbColor={isEnabledN ? '#af4cab' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchN}
            value={isEnabledN}
          />
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 10}}>
          <Text style={{fontSize: 20, paddingHorizontal: 20}}>E  </Text>
          <Switch
            trackColor={{false: '#767577', true: '#4CAF50'}}
            thumbColor={isEnabledE ? '#af4cab' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchE}
            value={isEnabledE}
          />
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 10}}>
            <Text style={{fontSize: 20, paddingHorizontal: 20}}>S  </Text>
            <Switch
            trackColor={{false: '#767577', true: '#4CAF50'}}
            thumbColor={isEnabledS ? '#af4cab' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchS}
            value={isEnabledS}
          />
        </View>
        <View style={{flexDirection: 'row', paddingVertical: 10}}>
            <Text style={{fontSize: 20, paddingHorizontal: 20}}>W </Text>
            <Switch
            trackColor={{false: '#767577', true: '#4CAF50'}}
            thumbColor={isEnabledW ? '#af4cab' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchW}
            value={isEnabledW}
          />
        </View>
        <View>
        <Picker
        selectedValue={DubVal}
        itemStyle={{fontSize: 45}}
        selectionColor="green"
        style={{width: 355}}
        onValueChange={(itemValue, itemIndex) => {
          setDubVal(itemValue)
          // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        }}>
          <Picker.Item label="I" value="0" />
          <Picker.Item label="X" value="1" />
          <Picker.Item label="XX" value="2" />
        </Picker>
       </View>
      </View>
      <View style={{alignItems: 'center', paddingTop: 20}}>
        {/* <Pressable style={styles.button} onPress={Alert.alert("...")}>
          <Text style={{textAlign: 'center', fontSize: 20}}>Submit</Text>
        </Pressable> */}
      </View>
    </View>
  )
}

function Ident({navigation}) {
  const [oppID, onChangeOppID] = React.useState();
  const [Table, onChangeTable] = React.useState();
  const [Deck, onChangeDeck] = React.useState();

  function startFlow(oppId, Table, Deck){
    var id = getStore("ID")
    // create an alert with the status code response
    fetch(`http://172.16.168.241:3000/validate/${Deck}/${Table}/${id}/${oppID}/`, {
          method: "POST",
        })
        .then(res => res.json())
        .then(res => {
          console.log(res)
          return res
        })
  }
  return(
    <SafeAreaView style={styles.root}>
    <View style={styles.container}>
      <Text style={styles.head}>Game setup</Text>
    </View>
    <Text style={styles.t}>Please enter your opponents's pair id:</Text>
    <TextInput
      style={styles.input}
      onChangeText={onChangeOppID}
      value={oppID}
      keyboardType="numeric"
    />
    <Text style={styles.t}>Please enter the deck number:</Text>
    <TextInput
      style={styles.input}
      onChangeText={onChangeDeck}
      value={Deck}
      keyboardType="numeric"
    />
    <Text style={styles.t}>Please enter the table number:</Text>
    <TextInput
      style={styles.input}
      onChangeText={onChangeTable}
      value={Table}
      keyboardType="numeric"
    />
    <View style={{alignItems: 'center', paddingTop: 20}}>
      <Pressable style={styles.button} onPress={startFlow}>
        <Text style={{textAlign: 'center', fontSize: 20}}>Connect</Text>
      </Pressable>
    </View>
  </SafeAreaView>
  )
}

function Score({navigation, route}) {
  const [selectedSuit, setSelectedSuit] = React.useState();
  const [selectedBid, setSelectedBid] = React.useState(0);
  const [selectedMade, setSelectedMade] = React.useState();
  const gameStyles = StyleSheet.create({
    iden: {
      backgroundColor: 'slategrey',
      padding: 20,
      flexDirection: 'row',
      alignContent: 'center',
      justifyContent: 'center'
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

  function goto(){
    navigation.navigate('Game', {screen: 'Finalise', params: {suit: `${selectedSuit}`, bid: `${selectedBid}`}})
  }
  return(
    <View>
    <View style={gameStyles.iden}>
      {/* <Text style={{fontSize: 28, color: 'blue', paddingTop: 10, paddingRight: 60}}>Bid entry</Text> */}
      <Pressable onPress={goto} ><Ionicons name={"caret-forward-circle-outline"} size={50} color={'lime'}/></Pressable>
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
  trapezoid: {
    width: 200,
    height: 100,
    borderBottomWidth: 100,
    borderBottomColor: "#af4cab",
    borderLeftWidth: 50,
    borderLeftColor: "transparent",
    borderRightWidth: 50,
    borderRightColor: "transparent",
    borderStyle: "solid",
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
      <GameScreens.Screen name="Finalise" component={Vuner} />
      <GameScreens.Screen name="Menu" component={Menu} />
      <GameScreens.Screen name="Login" component={Login} />
      <GameScreens.Screen name="Declarer" component={Decl} />
      <GameScreens.Screen name="Identify" component={Ident} />
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
