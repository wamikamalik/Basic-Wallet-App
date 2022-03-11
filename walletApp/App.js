import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// initialArr = [
//   {name: "card 1",
//   number: 1234123412341234,
//   Thru: "12/20",
//   CVV: 444,
//   type: "Visa"}, 
//   {name: "card 2",
//   number: 1234123412345678,
//   Thru: "13/20",
//   CVV: 445,
//   type: "MasterCard"}
// ];

const card1 = {
  name: "card 1",
  number: 1234123412341234,
  Thru: "12/20",
  CVV: 444,
  type: "Visa", 
  greyed: false
}
const card2 = {
  name: "card 2",
  number: 1234123412345678,
  Thru: "13/20",
  CVV: 445,
  type: "MasterCard",
  greyed: false
}

const storeItem = async () => {
  AsyncStorage.clear()
  try {
    await AsyncStorage.setItem(card1.name, JSON.stringify(card1))
    await AsyncStorage.setItem(card2.name, JSON.stringify(card2))
  } catch (e) {
    console.log(e)
  }
}

export default class App extends React.Component{
  state = {
    initialArr: []
  }

  async componentWillMount() {
    try {
      // await storeItem()
      keys = await AsyncStorage.getAllKeys()
      keys.map(key => {
        console.log(key)
        this.getItem(key)
      })
    } catch(e) {
      // read key error
    }
    // this.getItem(card1.name)
    // this.getItem(card2.name)
  }

  getItem = async (key) => {
    try {
      initial = await AsyncStorage.getItem(key)
      initial = JSON.parse(initial);
      this.state.initialArr.push(initial)
      this.setState({
        initialArr: this.state.initialArr
      })
      console.log(this.state.initialArr)
    } catch (e) {
      console.log(e)
    }
  }

  setItem = async (item) => {
    try {
      if(this.state.initialArr.length == 0) {
        item.name = "card 1"
      } else {
        last_name = this.state.initialArr.slice(-1)[0].name;
        console.log(last_name)
        item.name = "card " + (parseInt(last_name.match(/\d/g)) + 1).toString();
      }
      console.log(item.name)
      await AsyncStorage.setItem(item.name, JSON.stringify(item))
      this.state.initialArr.push(item)
      this.setState({
        initialArr: this.state.initialArr
      })
      console.log(this.state.initialArr)
    } catch (e) {
      console.log(e)
    }
  }

  deleteItem = async (item) => {
    try {
      await AsyncStorage.removeItem(item)
      const newList = this.state.initialArr.filter((value) => value.name !== item);
      this.setState({
        initialArr: newList
      })
      console.log(this.state.initialArr)
    } catch (e) {
      console.log(e)
    }
  }

  toggleFreeze = async(item) => {
    try {
      item.greyed = !item.greyed;
      await AsyncStorage.mergeItem(item.name, JSON.stringify({greyed: item.greyed}));
      var newlist = [];
      this.state.initialArr.map((value) => {
        if (value.name == item.name) {
          value.greyed = item.greyed
        }
        newlist.push(value);
      });
      this.setState({
        initialArr: newlist
      })
      console.log(this.state.initialArr)
    } catch (e) {
      console.log(e)
    }
  }

  render () {
    return (
        <SafeAreaView style={styles.page}>
          
          <View style={styles.container}>
            <View>
              <Text style={styles.text}>Account Balance</Text>
              <Text style={styles.text_body}> <Text style={styles.dollar}>  S$  </Text><Text style={styles.money}> 3,000</Text> </Text>
              <Text style={styles.text}>My debit cards</Text>
            </View>
            <View style = {styles.imageView}>
                <Image source={require('./assets/Logo.png')}></Image>
                <TouchableOpacity onPress={async()=>{await this.setItem({name:"", number: 1234123412356789,Thru: "14/20",CVV: 424,type: "Visa", greyed: false})}}>
                  <Text style={styles.text_card}> New Card </Text>
                </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView horizontal={true}>
          {this.state.initialArr.map(info => {
            return(
              <View style={styles.page}>
                <View>
                  <Card style={styles.card}>
                    <Text style={styles.text}>
                      {info.name}
                    </Text>
                  </Card>
                </View>
                <View>
                  <TouchableOpacity onPress={async()=>{await this.deleteItem(info.name)}}>
                    <Text style={styles.text}>Delete Card</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={async()=>{await this.toggleFreeze(info)}}>
                  {!info.greyed && <Text style={styles.text}>Freeze Card</Text>}
                  {info.greyed && <Text style={styles.text}>UnFreeze Card</Text>}
                  </TouchableOpacity>
                  <Text style={styles.text}>{info.number}</Text>
                </View>
              </View>
            );
            })}  
          </ScrollView>
        </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    flex: 2, 
    flexDirection: 'column',
    width: Dimensions.get('window').width,
    backgroundColor: '#0C365A',
    alignItems: 'stretch',
  },
  container: {
    flexDirection: 'row', 
    backgroundColor: '#0C365A',
    color: 'white', 
    padding: 15,
    height: '20%'
  },
  text: {
    color: 'white',
    paddingTop: 20
  },
  text_body: {
    color: 'white',
    paddingTop: 10
  },
  text_card: {
    color: 'white',
    paddingTop: 50,
  },
  dollar: {
    backgroundColor: '#01D167',
    borderRadius: 5,
  }, 
  money: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: '#01D167',
    color: 'white',
    margin: 20, 
    padding: 10
  },
  imageView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  }, 
});
