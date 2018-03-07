import React from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback, Image, TextInput } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { GiftedChat } from 'react-native-gifted-chat';

class MainScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            messages: [],
        };
    }
    
    render() {
      return (
        <View style={styles.container}>
            <GiftedChat
                placeholder="Type here"
                isAnimated={true}
                bottomOffset={16}
                messages={this.state.messages}
                onSend={(message) => {
                    //send to wit.ai
                }}
                user={{
                    _id: 1, 
                }} />
        </View>
      );
    }
}
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#026C7C',
    },
    inputStyle: {
        margin: 16,
        borderRadius: 24,
        justifyContent: 'center',
    },
});

export default StackNavigator({
    MainScreen: {
        screen: MainScreen,
        navigationOptions: ({ navigation }) => ({
            title: 'Chef Bot',
            headerStyle: {
                backgroundColor: '#055864',
                paddingLeft: 16,
                paddingRight: 16,
            },
            headerTitleStyle: {
                color: '#fff',
            },
            headerLeft: 
                <TouchableNativeFeedback onPress={() => navigation.navigate('DrawerToggle')}>
                    <Image source={require('./img/menu-button.png')}/>
                </TouchableNativeFeedback>,
            headerRight: 
                <TouchableNativeFeedback>
                    <Image source={require('./img/search.png')}/>
                </TouchableNativeFeedback>
        }),
    },
});