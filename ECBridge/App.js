import React from 'react';
import { useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, Pressable, Alert, Modal, KeyboardAvoidingView, Switch, ScrollView, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import {Picker} from '@react-native-picker/picker';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

const GameScreens = createStackNavigator();
const Tab = createBottomTabNavigator();
const LeaderScreens = createStackNavigator();
import * as Sentry from "@sentry/react-native";

payload = {}
const bidHTML = require('./assets/html/bid.html')

Sentry.init({
  dsn: "https://a330883a5bd441eba480adf1684ff034@o4504266723688448.ingest.sentry.io/4505070143668224",
  tracesSampleRate: 1.0,
  enableInExpoDevelopment: false,
  enableNative: false,
});

async function store(key, value) {
  try {
    await AsyncStorage.setItem(key, value)
    payload[key] = value
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

function Login() {
  return;
}

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
        fetch(`http://172.20.10.4:3000/login/${Name}/${PName}`, {
          method: "POST",
        })
        .then(res => res.json())
        .then(res => {
          ress = JSON.stringify(res)
          store("ID", ress)
          console.log(ress)
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
      var id = await login()
      navigation.navigate('Game', {
        screen: 'Identify',
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

function Confirm({navigation}) {
  const [bid, onChangeBid] = React.useState('');
  const [lead, onChangeLead] = React.useState('');
  // const [opp, onChangeOpp] = React.useState('');
  const [suit, onChangeSuit] = React.useState('');
  const [dub, onChangeDub] = React.useState('');
  const [id, onChangeID] = React.useState('');
  const [Deck, onChangeDeck] = React.useState('');
  const [Table, onChangeTable] = React.useState('');
  const [oppID, onChangeOppID] = React.useState('');
  const [res, onChangeRes] = React.useState('');
  const [Dec, onChangeDEC] = React.useState('');

  async function confirm(){
    try {
      console.log(`http://172.20.10.4:3000/record/${id}/${suit}/${bid}/${res}/${Table}/${Deck}/${oppID}/${dub}/${Dec}/${lead}`)
      fetch(`http://172.20.10.4:3000/record/${id}/${suit}/${bid}/${res}/${Table}/${Deck}/${oppID}/${dub}/${Dec}/${lead}`, {
        method: "POST",
      })
      .then(res => res.json())
      .then(res => {
        Alert.alert('You scored:', JSON.stringify(res))
        navigation.navigate('Game', {screen: 'Identify'})
      })
    } catch(e) {
      console.log(e)
    }
  }

  let payload = {}
  useEffect(() => {
    async function update() {
    try {
      onChangeBid(await AsyncStorage.getItem('bid'));
      onChangeLead(await AsyncStorage.getItem('lead'));
      //onChangeOpp(await AsyncStorage.getItem('opp'));
      onChangeSuit(await AsyncStorage.getItem('suit'));
      onChangeDub(await AsyncStorage.getItem('dub'));
      onChangeID(await AsyncStorage.getItem('ID'));
      onChangeDeck(await AsyncStorage.getItem('deck'));
      onChangeTable(await AsyncStorage.getItem('table'));
      onChangeOppID(await AsyncStorage.getItem('oppID'));
      onChangeRes(await AsyncStorage.getItem('res'));
      onChangeDEC(await AsyncStorage.getItem('decl'));
    } catch(e) {
      // read error
      console.log(e);
  }}
  update()
}, [bid, lead, oppID, suit, dub, id, Deck, Table, res, Dec]);

  return(
    <SafeAreaView>
      <Text style={styles.title}>You have entered:</Text>
    <View style={styles.container2}>
    <View style={styles.row}>
      <Text style={styles.label}>Lead:</Text>
      <Text style={styles.value}>{lead}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Opponent:</Text>
      <Text style={styles.value}>{oppID}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Suit:</Text>
      <Text style={styles.value}>{suit}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Bid:</Text>
      <Text style={styles.value}>{bid}</Text>
    </View>
    <View style={styles.row}>
      <Text style={styles.label}>Doubled:</Text>
      <Text style={styles.value}>{dub}</Text>
    </View>
    <Text style={styles.confirmation}>N/S, please confirm the above details</Text>
    <View style={{alignItems: 'center', paddingTop: 20}}>
      <Pressable onPress={confirm} style={styles.button} >
        <Text style={{textAlign: 'center', fontSize: 20}}>Confirm</Text>
      </Pressable>
    </View>
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
  const [Dec, onChangeDEC] = React.useState('N');
  const [Lead, onChangeLead] = React.useState('');
  const [Res, onChangeRes] = React.useState('0');

  function submit() {
    if (Dec == ' ') {
      Alert.alert("You must enter the declarer! [0002]")
    } if (Lead == '') {
      Alert.alert("You must enter the lead! [0002]")
    } else {
      store("decl", Dec)
      store("lead", Lead)
      store("res", Res)
      navigation.navigate('Game', {screen: 'Confirm'})
    }
  }
  return(
    <SafeAreaView >
      <View style={styles.container}>
        <Text style={styles.head}>Welcome to ECBridge</Text>
      </View>
      <View>
        <Picker
        selectedValue={Dec}
        itemStyle={{fontSize: 45}}
        selectionColor="green"
        style={{width: '100%'}}
        onValueChange={(itemValue, itemIndex) => {
          onChangeDEC(itemValue)
          // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        }}>
          <Picker.Item label="N" value="N" />
          <Picker.Item label="E" value="E" />
          <Picker.Item label="S" value="S" />
          <Picker.Item label="W" value="W" />
        </Picker>
      </View>
      <View style={{paddingTop: 20}}>
        <Text sytle={styles.entryLabel}>Please enter the lead:</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeLead}
          value={Lead}
          placeholder='eg 1H or AS'
        />
        {/* center pressable */}
        <View>
        <Picker
        selectedValue={Res}
        itemStyle={{fontSize: 45}}
        selectionColor="green"
        style={{width: 355}}
        onValueChange={(itemValue, itemIndex) => {
          onChangeRes(itemValue)
          // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
        }}>
          <Picker.Item label="-13" value="-13" />
          <Picker.Item label="-12" value="-12" />
          <Picker.Item label="-11" value="-11" />
          <Picker.Item label="-10" value="-10" />
          <Picker.Item label="-9" value="-9" />
          <Picker.Item label="-8" value="-8" />
          <Picker.Item label="-7" value="-7" />
          <Picker.Item label="-6" value="-6" />
          <Picker.Item label="-5" value="-5" />
          <Picker.Item label="-4" value="-4" />
          <Picker.Item label="-3" value="-3" />
          <Picker.Item label="-2" value="-2" />
          <Picker.Item label="-1" value="-1" />
          <Picker.Item label="=" value="0" />
          <Picker.Item label="+1" value="1" />
          <Picker.Item label="+2" value="2" />
          <Picker.Item label="+3" value="3" />
          <Picker.Item label="+4" value="4" />
          <Picker.Item label="+5" value="5" />
          <Picker.Item label="+6" value="6" />
        </Picker>
      </View>
        <View style={{justifyContent: 'center', alignItems: 'center' }}>
        <Pressable onPress={submit} style={{padding: 20, backgroundColor: 'grey', width: 100, borderRadius: 15}}>
          <Text>Confirm</Text>
        </Pressable>
        </View>
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

  async function startFlow(){
    var id = await getStore("ID")
    // create an alert with the status code response
    console.log(Deck)
    console.log(`http://172.20.10.4:3000/validate/${Deck}/${Table}/${id}/${oppID}/`)
    fetch(`http://172.20.10.4:3000/validate/${Deck}/${Table}/${id}/${oppID}/`, {
          method: "POST",
        })
        .then((res) => {
          console.log(res.status)
          if (res.status == 202) {
            store("deck", Deck)
            store("table", Table)
            store("oppID", oppID)
            navigation.navigate('Game', {screen: 'Entry'})
          }
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
      <Pressable style={styles.button} onPress={startFlow()}>
        <Text style={{textAlign: 'center', fontSize: 20}}>Continue</Text>
      </Pressable>
    </View>
  </SafeAreaView>
  )
}

function Score({navigation, route}) {
  const [selectedSuit, setSelectedSuit] = React.useState();
  const [selectedBid, setSelectedBid] = React.useState(0);
  const [selectedMade, setSelectedMade] = React.useState();
  const [DubVal, setDubVal] = React.useState()
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

  async function goto(){
    store("suit", selectedSuit)
    store("bid", selectedBid)
    store("dub", DubVal)
    navigation.navigate('Game', {screen: 'Declarer'})
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
        <Text>Please enter the doubled value</Text>
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
  container2: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  value: {
    flex: 1,
  },
  confirmation: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
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
    borderLeftColor: "solid",
    borderRightWidth: 50,
    borderRightColor: "solid",
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
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
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
      <GameScreens.Screen name="Confirm" component={Confirm} />
    </GameScreens.Navigator>
  );
}

function Leaderboard() {
  const [data, setData] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const fetchData = () => {
    fetch("http://172.20.10.4:3000/playerdata")
      .then(res => res.json())
      .then((yeet) => {
        setData(yeet);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <SafeAreaView>
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text>Leaderboard</Text>
      {data.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.cell}>{item[0]}</Text>
          <Text style={styles.cell}>{item[1]}</Text>
          <Text style={styles.cell}>{item[2]}</Text>
          <Text style={styles.cell}>{item[3]}</Text>
        </View>
      ))}
    </ScrollView>
    </SafeAreaView>
  );
}

function Bidding({ navigation }) {
  return (
    <WebView
      source={bidHTML}
      style={{ marginTop: 30 }}
    />
  );
}

function Boards(){
  return(
    <LeaderScreens.Navigator initialRouteName="Leaderboard" screenOptions={{
      headerShown: false,
    }}>
      <LeaderScreens.Screen name="Leaderboard" component={Leaderboard} />
    </LeaderScreens.Navigator>
  )
}

function MainStack() {
  return(
    <NavigationContainer independent={true}>
      <Tab.Navigator   screenOptions={{
        tabBarStyle: { position: 'absolute' },
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'key'
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'lime',
        tabBarInactiveTintColor: 'gray',
      }}>
        <Tab.Screen name="Game" component={GameStack} />
        <Tab.Screen name="Leaderboard" component={Boards} />
        <Tab.Screen name="Bid" component={Bidding} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <NavigationContainer independent={true}>
      <MainStack/>
    </NavigationContainer>
  );
};
