import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    Image, 
    TouchableNativeFeedback, 
    Animated,
    ActivityIndicator
 } from 'react-native';
import IngredientsCard from './IngredientsCard';

class RecipeCards extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            recipes: [],
            isLoading: true,
            activeItem: {},
        }

        this.getRecipesFromApi = this.getRecipesFromApi.bind(this);
        this.shuffleArray = this.shuffleArray.bind(this);
        this.toggleActiveItem = this.toggleActiveItem.bind(this);
        this.renderIngredients = this.renderIngredients.bind(this);
        this.renderRecipes = this.renderRecipes.bind(this);
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

        const frontAnimatedStyle = {
            transform: [{ rotateX: this.frontInterpolate }]
        }

        return frontAnimatedStyle;
    }

    backCardStyle(){
        this.backInterpolate = this.animatedValue.interpolate({
            inputRange: [0, 180],
            outputRange: ['180deg', '360deg']
        })

        const backAnimatedStyle = {
            transform: [{ rotateX: this.backInterpolate }]
        }

        return backAnimatedStyle;
    }

    flipCard(){
        if(this.value >= 90){
            Animated.spring(this.animatedValue, {
                toValue: 0,
                friction: 8,
                tension: 10
            }).start();
        }else if(this.value < 90){
            Animated.spring(this.animatedValue, {
                toValue: 180,
                friction: 8,
                tension: 10
            }).start();
        }
    }

    toggleActiveItem(param){ 
        this.setState({
            activeItem: {[param] : true}
        });
        console.log('toggle button handler on card: '+ this.state.activeItem + param);
        this.flipCard();  
    } 

    renderIngredients(param){
        return(
            <View>
                <IngredientsCard recipe={param} style={this.backCardStyle()} />
            </View>
        );
    }

    renderRecipes (item, index){
        return(
            //place ingredient card here with opacity 0 then on press should change opacity and flip it
            <TouchableNativeFeedback key={index} onPress={() => this.toggleActiveItem(index)}>       
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
        justifyContent: 'space-between'
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
    }
});

export default RecipeCards;