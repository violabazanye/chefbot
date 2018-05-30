import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    Image, 
    TouchableNativeFeedback, 
    Animated,
    ActivityIndicator,
    Button,
    LayoutAnimation,
    UIManager,
    Easing,
    Platform,
    ScrollView
 } from 'react-native';

class RecipeCards extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            recipes: [],
            isLoading: true,
            activeItem: {},
            enabled: true,
            card_height: new Animated.Value(0),
            positionY: new Animated.Value(0)
        }

        if (Platform.OS === 'android'){
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }

        this.getRecipesFromApi = this.getRecipesFromApi.bind(this);
        this.shuffleArray = this.shuffleArray.bind(this);
        this.toggleActiveItem = this.toggleActiveItem.bind(this);
        this.renderRecipes = this.renderRecipes.bind(this);
        this.openDirections = this.openDirections.bind(this);
    }

    getRecipesFromApi = async(param) => {
        fetch("https://api.edamam.com/search?app_id=2b4a2a13&app_key=07040ebc53dc66be4711f352a7f2b3f8&q=" + param, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }, 
        }).then((response) => response.json()) 
          .then((responseJson) => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
            this.setState({recipes: this.shuffleArray(responseJson.hits), isLoading: false}, function(){
                console.log("recipes loaded"); 
            });       
          }).catch((error) => {
              console.error(error);
          });
    }

    //fisher-yates algorithm
    shuffleArray(params) {
        for(let i = params.length - 1; i > 0; i--){
            const j = Math.floor(Math.random() * (i + 1));
            [params[i], params[j]] = [params[j], params[i]];
        }
        return params;
    }

    componentWillMount(){
        this.animatedValue = new Animated.Value(0);
        this.value = 0;
        this.animatedValue.addListener(({ value }) => { this.value = value });
    }

    componentDidMount(){
        this.getRecipesFromApi(this.props.content);   
    }

    frontCardStyle(){
        this.frontInterpolate = this.animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['0deg', '180deg']
        })
        this.frontOpacity = this.animatedValue.interpolate({
            inputRange: [89, 90],
            outputRange: [1, 0]
        })

        const frontAnimatedStyle = {
            transform: [
                { rotateX: this.frontInterpolate },
                { perspective: 1000 }
            ],
            opacity: this.frontOpacity,
            position: 'absolute'
        }

        return frontAnimatedStyle;
    }

    backCardStyle(){
        this.backInterpolate = this.animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['180deg', '360deg']
        })
        this.backOpacity = this.animatedValue.interpolate({
            inputRange: [89, 90],
            outputRange: [0, 1]
        })

        const backAnimatedStyle = {
            transform: [
                { rotateX: this.backInterpolate },
                { translateY: this.state.positionY },
                { perspective: 1000 }
            ],
            opacity: this.backOpacity, 
            height: this.state.card_height,
            position: 'relative'
        }

        return backAnimatedStyle;
    }

    flipCard(){
        if(this.value >= 90){
            Animated.parallel([
                Animated.spring(this.animatedValue, {
                    toValue: 0,
                    friction: 8,
                    tension: 10
                }).start(),
                Animated.spring(this.state.positionY, {
                    toValue: 0
                }).start(),
                Animated.timing(this.state.card_height, {
                    toValue: 140,
                    duration: 500,
                    easing: Easing.easeOutBack
                }).start()
            ]);
        }else if(this.value < 90){
            Animated.parallel([
                Animated.spring(this.animatedValue, {
                    toValue: 180, 
                    friction: 8,
                    tension: 10
                }).start(),
                Animated.timing(this.state.card_height, {
                    toValue: 450,
                    duration: 500,
                    easing: Easing.easeOutBack
                }).start(),
                Animated.spring(this.state.positionY, {
                    toValue: -1
                }).start()  
            ]); 
        }
    }

    toggleActiveItem(param){ 
        this.setState({
            activeItem: {[param] : true} 
        });
        console.log('toggle button handler on card');
        this.flipCard();     
    }    

    openDirections(){

    }

    renderRecipes (item, index){
        return(
            <View key={index}> 
                <TouchableNativeFeedback onPress={() => this.toggleActiveItem(index)}>
                    <Animated.View style={[styles.container, styles.containerBack, this.state.activeItem[index] && this.backCardStyle()]}>  
                        <View>
                            <Image style={styles.backImage} source={{uri: item.recipe.image}} />
                            <View style={styles.overlay} />    
                        </View>  
                        <View style={{position: 'absolute', top: 0, width: 298, height: 140, margin: 10, flexDirection: 'column', justifyContent: 'space-between'}}>
                            <View style={{flexDirection: 'row'}}>  
                                <Image style={{width:24,height:24}} source={require('./img/outline_close_white_18dp.png')} />
                                <View style={{width:180}}><Text style={[styles.titleText, {color: 'white', paddingLeft: 16}]}>{item.recipe.label}</Text></View>
                                <Image style={{width:24,height:24,position:'absolute',right:24}} source={require('./img/outline_favorite_border_white_18dp.png')} />
                            </View> 
                            <View style={{marginBottom:15,flexDirection: 'row', justifyContent: 'space-between', paddingRight: 24}}>  
                                <View>
                                    <Text style={[styles.bodyText, {color: 'white'}]}>INGREDIENTS</Text>
                                    <Text style={[styles.bodyText, {color: 'white', fontWeight: 'bold', fontSize: 14}]}>{item.recipe.ingredients.length}</Text>
                                </View>
                                <View>
                                    <Text style={[styles.bodyText, {color: 'white'}]}>CALORIES</Text> 
                                    <Text style={[styles.bodyText, {color: 'white', fontWeight: 'bold', fontSize: 14}]}>{Math.round(item.recipe.calories)} kcal</Text>
                                </View>
                                <View>
                                    <Text style={[styles.bodyText, {color: 'white'}]}>COOK TIME</Text>
                                    {item.recipe.totalTime === 0 ? <Text style={[styles.bodyText, {color: 'white', fontWeight: 'bold', fontSize: 14}]}>N/A</Text> : <Text style={[styles.bodyText, {color: 'white', fontWeight: 'bold', fontSize: 14}]}>{item.recipe.totalTime} mins</Text>}
                                </View> 
                            </View>
                        </View> 
                        <View style={styles.tableRow}>
                            <Text style={{fontWeight: 'bold'}}>INGREDIENTS</Text>
                            <Text style={{fontWeight: 'bold'}}>ADD TO LIST</Text> 
                        </View>
                        <ScrollView
                            keyboardDismissMode='on-drag'
                            showsVerticalScrollIndicator={true} 
                            style={{flex:1}}
                            onTouchStart={(ev) => {
                                this.setState({enabled:false})
                            }}
                            onMomentumScrollEnd={(e) => {
                                this.setState({enabled: true})
                            }}
                            onScrollEndDrag={(e) => {
                                this.setState({enabled: true})
                            }}
                        > 
                            {item.recipe.ingredientLines.map((data, i) =>
                                <View key={i} style={styles.tableRow}>
                                    <Text style={{fontSize:12,width:150}}>{data}</Text>
                                    <Image style={{width:24,height:24,marginRight:24,justifyContent: 'center', alignItems: 'center'}} source={require('./img/outline_add_circle_outline_black_18dp.png')} />
                                </View>   
                            )}   
                        </ScrollView>
                        <View style={{margin:16}}>  
                            <Button 
                                title= "VIEW DIRECTIONS"
                                color= "#BFAB25"
                                onPress= {this.openDirections}  
                            />
                        </View>
                    </Animated.View> 
                </TouchableNativeFeedback>
                <TouchableNativeFeedback onPress={() => this.toggleActiveItem(index)}>       
                    <Animated.View style={[styles.container, this.state.activeItem[index] && this.frontCardStyle()]}>  
                        <View style={{width: 130, margin: 10}}>
                            <Text style={styles.titleText}>{item.recipe.label}</Text> 
                            <Text style={styles.bodyText}>INGREDIENTS <Text style={{fontWeight: 'bold'}}>{item.recipe.ingredients.length}</Text></Text>
                            <Text style={styles.bodyText}>CALORIES <Text style={{fontWeight: 'bold'}}>{Math.round(item.recipe.calories)} kcal</Text></Text>
                            <Text style={styles.bodyText}>SERVINGS <Text style={{fontWeight: 'bold'}}>{item.recipe.yield}</Text></Text>
                        </View>
                        <Image style={styles.thumbnail} source={{uri: item.recipe.image}}/>      
                    </Animated.View>
                </TouchableNativeFeedback>     
            </View>              
        );
    }

    render(){
        var itemsList = this.state.recipes.slice(0,3).map((item, index) =>
            this.renderRecipes(item, index) 
        );
        if(this.state.isLoading){
            return(
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="small" color="#055864" />
                </View>
            );
        }else{ 
            return(
                <View>
                    { itemsList }                  
                </View>
            );  
        }
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 3.3,
        marginTop: 10,
        marginRight: 10,
        shadowOffset:{  width: 1,  height: 1,  },
        shadowColor: '#800000',
        shadowOpacity: 0.5,
        shadowRadius: 3.3,
        elevation: 1, 
        height: 140,
        width: 298,  
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'scroll',
        backfaceVisibility: 'hidden', //doesn't work on android
    },
    titleText: {
        fontSize: 16,
        fontFamily: 'Roboto',
        color: '#4a4a4a',
        paddingLeft: 3,
        paddingBottom: 3,
        fontWeight: 'bold',  
    },
    bodyText: {
        padding: 3,
        fontWeight: '100', 
        fontFamily: 'Roboto',
        fontSize: 12,
    },
    thumbnail: {
        width: 140, 
        height: 140, 
        borderTopRightRadius: 3.3,
        borderBottomRightRadius: 3.3,
    },
    containerBack: {
        position: 'absolute',
        top: 0,
        flexDirection: 'column'
    },
    backImage: {
        width: 298,
        height: 140,
        borderRadius: 3.3
    },
    overlay: {
        position: 'absolute',
        top: 0,
        opacity: 0.5,
        width: 298,
        height: 140,
        backgroundColor: 'black',
        borderRadius: 3.3,   
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 16
    }
});

export default RecipeCards;