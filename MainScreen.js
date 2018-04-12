import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TouchableNativeFeedback, 
    Image, 
    TextInput, 
    Animated, 
    Keyboard,
    Alert, 
    Button,
    Dimensions } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { GiftedChat, Bubble, Send, InputToolbar } from 'react-native-gifted-chat';

class MainScreen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            messages: [],
            typingText: null,
            right: 0,
            reply: null,
        }; 
        this.keyboardHeight = new Animated.Value(0);
        this.renderSend = this.renderSend.bind(this);
        this.onReceive = this.onReceive.bind(this);
        this.renderFooter = this.renderFooter.bind(this);
        this.connectToWitApi = this.connectToWitApi.bind(this);
        this.getRecipesFromAPi = this.getRecipesFromAPi.bind(this);

        this._isMounted = false;
    }

    connectToWitApi = async(param) => {
        return fetch('https://api.wit.ai/message?v=20170307&q=' + param, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + 'IFRWTVUKX33BEVWXJQ4XCLAYNX3R6W7R',
            }, 
        }).then((response) => response.json())
          .then((responseJson) => {
            this.setState(previousState => ({
                reply: JSON.stringify(responseJson.entities.typeOfMeal[0].value),
            }));
          }).catch((error) => {
              console.error(error);
          });
    }

    //keep searching for better api
    getRecipesFromAPi = async(param) => {
        fetch("http://food2fork.com/api/search?key=48aecb84c8894961ef3e0e152b72f733&q=" + param, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }, 
        }).then((response) => response.json()) 
          .then((responseJson) => {
              console.log(responseJson); 
          }).catch((error) => {
              console.error(error);
          });
    }

    //using bind or arrows in your render methods creates a new function on each render, resulting in a change of props for the child that receives them, forcing a re-render.
    componentWillMount(){
        this._isMounted = true;

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

    componentDidMount(){  
        Dimensions.addEventListener('change', () => {
            const {width, height} = Dimensions.get('screen')
            if(height < width){
                this.setState({
                    right: (width+50)-width
                });
            }else{
                this.setState({
                    right: (width+280)-width  
                }); 
            }
        });

        //this.getRecipesFromAPi("lunch");
    }

    componentWillUnmount () {
        this._isMounted = false;

        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
        Dimensions.removeEventListener("change", this.renderSend);
    }

    _keyboardDidShow = (event) => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: event.duration,
                toValue: event.endCoordinates.height,
            }),
        ]).start();
    };

    _keyboardDidHide = (event) => {
        Animated.parallel([
            Animated.timing(this.keyboardHeight, {
                duration: 0,
                toValue: 0,
            }),
        ]).start();
    };

    onSend(messages = []){
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }));
        
        this.botResponse(messages);
        console.log(messages);
    }

    botResponse(messages){
        if(messages.length > 0){
            this.setState(previousState => ({
                typingText: 'Chef Bot is typing...',
            }));
        }

        setTimeout(() => {
            if(this._isMounted === true){
                if(messages.length > 0){
                    if(messages[0].text){
                        this.connectToWitApi(messages[0].text);
                        console.log(this.state.reply);  
                        this.onReceive('Ok, let us get started!')
                    }
                }else{
                    this.onReceive('How can I help you today?');
                }
            }
            this.setState(previousState => ({
                typingText: null,
            }));
        }, 1000);
    }

    onReceive(text){
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, {
                _id: Math.round(Math.random() * 1000000),
                text: text,
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'Chef Bot',
                    avatar: require('./img/logo.png'),
                }
            })
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
            <InputToolbar {...props}/>
        );
    }

    renderSend(props){
        return(
            <Send {...props}
                containerStyle={{
                    right: this.state.right,
                }}>
                <View>
                    <Image source={require('./img/send-button.png')} resizeMode={'center'}/>
                </View>
            </Send>
        );
    }

    renderFooter(props){
        if(this.state.typingText){
            return (
                <View style={styles.footerContainer}>
                    <Text style={styles.footerText}>
                        {this.state.typingText}
                    </Text>
                </View>
            );
        }
    }
    
    render() {
      return (
        <Animated.View style={[styles.container, {paddingBottom: this.keyboardHeight}]}>
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
                renderSend={this.renderSend}
                renderFooter={this.renderFooter} />
        </Animated.View>
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
    footerContainer: {
        marginTop: 5,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#aaa',
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