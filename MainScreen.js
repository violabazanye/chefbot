import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableNativeFeedback, 
    Image, 
    TextInput, 
    KeyboardAvoidingView, 
    Keyboard, 
    Dimensions } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { GiftedChat, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';

class MainScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            messages: [],
            visibleHeight: Dimensions.get('screen').height,
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
                    text: 'Hello Viola!',
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'Chef Bot',
                        avatar: require('./img/logo.png'),
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
                        backgroundColor: '#E5E3E6',
                    },
                    right: {
                        backgroundColor: '#026C7C',
                    }
                }}
            />
        );
    }

    renderInputToolbar(props){
        return(
            <InputToolbar 
                {...props}
                containerStyle={{
                 
                }}
            />
        );
    }

    renderSend(props){
        return(
            <Send {...props}>
                <View style={{marginRight:20}}>
                    <Image source={require('./img/send-button.png')} resizeMode={'center'}/>
                </View>
            </Send>
        );
    }
    
    render() {
      return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <GiftedChat
                placeholder="Type here"
                isAnimated={true}
                messages={this.state.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: 1, 
                }}
                renderBubble={this.renderBubble}
                renderInputToolbar={this.renderInputToolbar}
                renderSend={this.renderSend} />
        </KeyboardAvoidingView>
      );
    }
}
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white', 
    },
    inputStyle: {
        margin: 16,
        borderRadius: 24,
        borderColor: '#979797',
        position: 'absolute',
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