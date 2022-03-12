import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, TouchableOpacity, Modal, TextInput} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card } from 'react-native-paper';
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
  Thru: "12/23",
  CVV: 444,
  type: "Visa", 
  greyed: false,
  show: false
}
const card2 = {
  name: "card 2",
  number: 1234123412345678,
  Thru: "11/24",
  CVV: 445,
  type: "MasterCard",
  greyed: false,
  show: false
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
    initialArr: [],
    number: null,
    modal: false,
    thru: null,
    CVV: null,
    type: "VISA"
  }

  async componentWillMount() {
    try {
      console.disableYellowBox = true;
      keys = await AsyncStorage.getAllKeys()
      if(keys.length == 0) {
        await storeItem()
      }
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
        var last_name = this.state.initialArr.slice(-1)[0].name;
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

  toggleShow = async(item) => {
    try {
      item.show = !item.show;
      await AsyncStorage.mergeItem(item.name, JSON.stringify({show: item.show}));
      var newlist = [];
      this.state.initialArr.map((value) => {
        if (value.name == item.name) {
          value.show = item.show
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

  toggleModal = () => {
    this.setState({modal: !this.state.modal})
  };

  addCard = () => {
    this.toggleModal();
    if(this.state.number == null || this.state.thru == null || this.state.CVV == null) {
      alert("Details are missing. No card added.");
    } else {
      if(this.state.number.toString().match(/^[0-9]+$/)==null || this.state.number.toString().length!=16) {
        alert("Card number should have 16 digits. No card added.")
      } else if(this.state.thru.toString().split("/").length!=2) {
        alert("Invalid Thru. No card added.")
      } else if(this.state.thru.toString().split("/")[0].match(/^[0-9]+$/)==null || parseInt(this.state.thru.toString().split("/")[0]) > 12) {
        alert("Invalid Thru month. No card added.")
      } else if(this.state.thru.toString().split("/")[1].length!=2) {
        alert("Invalid Thru year. No card added.")
      } else if(parseInt(this.state.thru.toString().split("/")[1]) < new Date().getFullYear()%100) {
        alert("Invalid Thru year. No card added.")
      } else if(parseInt(this.state.thru.toString().split("/")[1]) == new Date().getFullYear()%100) {
        if(parseInt(this.state.thru.toString().split("/")[0]) < new Date().getMonth() + 1) {
          alert("Invalid Thru month. No card added.")
        }
      } else if(this.state.CVV.toString().match(/^[0-9]+$/)==null || this.state.CVV.toString().length!=3) {
        alert("Invalid CVV. No card added.")
      } else {
        var item = {
          name: null,
          number: this.state.number,
          Thru: this.state.thru,
          CVV: this.state.CVV,
          type: this.state.type, 
          greyed: false,
          show: false
        };
        this.setItem(item);
        alert("Card added.");
      }
      this.setState({number: null, thru: null, CVV: null})
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
                <TouchableOpacity onPress={this.toggleModal}>
                  {/* modal source: https://www.geeksforgeeks.org/how-to-create-custom-dialog-box-with-text-input-react-native/ */}
                  <Modal animationType="slide" transparent visible={this.state.modal} presentationStyle="overFullScreen" onDismiss={this.toggleModal}>
                    <View style={styles.viewWrapper}>
                      <View style={styles.modalView}>
                          <Text style={styles.text_black}> Card Number </Text>
                          <TextInput placeholder="Enter Card Number..." value={this.state.number} style={styles.textInput} 
                            onChangeText={(value) => this.setState({number: value})} />
                          <Text style={styles.text_black}> Thru </Text>
                          <TextInput placeholder="Enter Thru (MM/YY)..." value={this.state.thru} style={styles.textInput} 
                            onChangeText={(value) => this.setState({thru: value})} />
                          <Text style={styles.text_black}> CVV </Text>
                          <TextInput placeholder="Enter CVV..." value={this.state.CVV} style={styles.textInput} 
                            onChangeText={(value) => this.setState({CVV: value})} />
                          <Text style={styles.text_black}> Type </Text>
                          <TextInput placeholder="Enter Card Type (Visa/MasterCard/etc)..." value={this.state.type} style={styles.textInput} 
                            onChangeText={(value) => this.setState({type: value})} />  
                          <Button style={styles.add_button} onPress={this.addCard} >
                            <Text style={styles.text}> Done </Text>
                          </Button>
                      </View>
                    </View>
                  </Modal>
                  <View style={{flexDirection: 'row'}}>
                  <Image style={styles.add} source={require('./assets/box.png')}></Image>
                  <Text style={styles.text_card}> New Card </Text>
                  </View>
                </TouchableOpacity>
            </View>
          </View>
          
          <ScrollView horizontal={true}>
          {this.state.initialArr.map(info => {
            return(
              <View style={styles.page}>
                <View style={{opacity: info.greyed?0.3:1, backgroundColor: '#0C365A'}}>
                  <Button style={styles.button} onPress={async()=>{await this.toggleShow(info)}}>
                    <Text style={{alignSelf:'center', color: '#01D167', fontSize: 10}}>
                      {!info.show && "Show card number"}
                      {info.show && "Hide card number"}
                    </Text>
                  </Button>
                  <Card style={styles.card}>
                    <Image style={{alignSelf: 'flex-end'}} source={require('./assets/CardLogo.png')}></Image>
                    <Text style={styles.money}>
                      Mark Henry
                    </Text>
                    <Text style={styles.text}>
                      {info.show && parseInt(info.number/1000000000000)}    {info.show && parseInt(info.number/100000000)%10000}    {info.show && parseInt(info.number/10000)%10000}    {info.show && parseInt(info.number%10000)}
                      {!info.show && "****"}    {!info.show && "****"}    {!info.show && "****"}    {!info.show && parseInt(info.number%10000)}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                    <Text style={styles.text_thru}>
                      Thru: {info.Thru}
                    </Text>
                    <Text style={styles.text}>
                      CVV: * * *
                    </Text>
                    </View>
                    <Text style={styles.text_type}>
                      {info.type}
                    </Text>
                  </Card>
                </View>
                <View style={{backgroundColor: '#0C365A', paddingBottom: 20}}>
                  <View style={styles.options}>
                      <TouchableOpacity onPress={async()=>{await this.deleteItem(info.name)}}>
                        <Image style={{alignSelf: 'center'}} source={require('./assets/Del.png')}></Image>
                        <Text style={styles.text}>Delete Card</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={async()=>{await this.toggleFreeze(info)}}>
                        <Image style={{alignSelf: 'center'}} source={require('./assets/Freeze.png')}></Image>
                        {!info.greyed && <Text style={styles.text}>Freeze Card</Text>}
                        {info.greyed && <Text style={styles.text}>UnFreeze Card</Text>}
                      </TouchableOpacity>
                      <Text style={styles.text}>{"<<--"} Scroll {"-->>"}</Text>
                  </View>
                </View>
                <ScrollView>
                  <View style={{opacity: info.greyed?0.3:1, alignItems: 'center'}}>
                  <Text style={styles.text_black}>Transaction 1: Berkley</Text>
                  <Text style={styles.text_black}>Transaction 2: Hamleys</Text>
                  <Text style={styles.text_black}>Transaction 3: Hamleys</Text>
                  <Text style={styles.text_black}>Transaction 4: Hamleys</Text>
                  <Text style={styles.text_black}>Transaction 5: Hamleys</Text>
                  <Text style={styles.text_black}>Transaction 6: Hamleys</Text>
                  <Text style={styles.text_black}>Transaction 7: Hamleys</Text>
                  <Text style={styles.text_black}>Transaction 8: Hamleys</Text>
                  <Text style={styles.text_black}>Transaction 9: Hamleys</Text>
                  </View>
                </ScrollView>
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
    // backgroundColor: '#0C365A',
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
  text_thru: {
    color: 'white',
    paddingTop: 20,
    paddingRight: 60
  },
  text_body: {
    color: 'white',
    paddingTop: 10
  },
  text_card: {
    color: 'white',
    paddingTop: 50,
  },
  text_black: {
    color: 'black',
    paddingTop: 20,
    fontSize: 15
  },
  dollar: {
    backgroundColor: '#01D167',
    borderRadius: 5,
  }, 
  money: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: '#01D167',
    color: 'white',
    marginLeft: 20, 
    marginBottom: 20,
    marginRight: 20,
    padding: 10
  },
  imageView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  }, 
  options: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20
  },
  button: {
    color: '#01D167',
    backgroundColor: 'white',
    borderTopLeftRadius : 10,
    borderTopRightRadius : 10,
    alignSelf: 'flex-end',
    marginRight: 20
  },
  add_button: {
    color: 'white',
    backgroundColor: '#01D167',
    borderRadius : 10,
  },
  text_type: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'flex-end'
  },
  add: {
    marginTop: 53
  }, 
  //Source: https://www.geeksforgeeks.org/how-to-create-custom-dialog-box-with-text-input-react-native/
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "30%",
    left: "50%",
    elevation: 5,
    transform: [{ translateX: -(Dimensions.get("window").width * 0.4) }, 
                { translateY: -90 }],
    height: 500,
    width: Dimensions.get("window").width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 7,
  },
  textInput: {
    width: "80%",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    marginBottom: 8,
  },
});
