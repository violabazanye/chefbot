import React from 'react';
import { StyleSheet, Text, View, TouchableNativeFeedback, Image, TextInput, KeyboardAvoidingView, Keyboard, Dimensions } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';

class MainScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            messages: [],
            visibleHeight: Dimensions.get('window').height,
        };
    }

    //using bind or arrows in your render methods creates a new function on each render, resulting in a change of props for the child that receives them, forcing a re-render.
    componentWillMount(){
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow.bind(this))
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide.bind(this))
        
        this.setState({
            messages: [
                {
                    _id: 1,
                    text: 'Hello developer',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'Chef Bot',
                        avatar: './img/chefbot.png',
                    },
                },
            ],
        })
    }

    componentWillUnmount () {
        this.keyboardDidShowListener.remove()
        this.keyboardDidHideListener.remove()
    }

    //not working
    _keyboardDidShow(e){
        this.setState(previousState => ({
            visibleHeight: previousState.visibleHeight - e.endCoordinates.height,
        }))
        //alert(this.state.visibleHeight);
    }

    _keyboardDidHide(e){
        this.setState(previousState => ({
            visibleHeight: previousState.visibleHeight,
        }))
    }

    onSend(messages = []){
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }

    renderBubble(props){
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: '#B81365',
                    },
                    right: {
                        backgroundColor: '#6A0136',
                    }
                }}
            />
        );
    }

    //not working
    renderSend(props){
        return(
            <Send
            {...props}
            wrapperStyle={{
                textStyle: {
                    color: '#6A0136',
                }
            }} />
        );
    }
    
    render() {
      return (
        <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={this.state.visibleHeight}>
            <GiftedChat
                placeholder="Type here"
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: 1, 
                }}
                renderBubble={this.renderBubble}
                renderSend={this.renderSend} />
        </KeyboardAvoidingView>
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