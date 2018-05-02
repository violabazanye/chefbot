import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

class RecipeCards extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            recipes: [],
        }

        this.getRecipesFromApi = this.getRecipesFromApi.bind(this);
        this.shuffleArray = this.shuffleArray.bind(this);
        this.changeColor = this.changeColor.bind(this);
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
            this.setState({recipes: this.shuffleArray(responseJson.hits)}, function(){
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

    changeColor(param) {
        var color = '';
        if(param % 2 !== 0){
            color = '#b81365';
        }else{
            color = '#6a0136';
        }
        return color;
    }

    componentDidMount(){
        this.getRecipesFromApi(this.props.content); 
    }

    render(){
        var itemsList = this.state.recipes.slice(0,3).map((item, index) =>
            <View key={index} style={styles.container}>
                <View style={{width: 130, margin: 10}}>
                    <Text style={styles.titleText}>{item.recipe.label}</Text> 
                    <Text style={styles.bodyText}>INGREDIENTS <Text style={{fontWeight: 'bold'}}>{item.recipe.ingredients.length}</Text></Text>
                    <Text style={styles.bodyText}>CALORIES <Text style={{fontWeight: 'bold'}}>{Math.round(item.recipe.calories)} kcal</Text></Text>
                    <Text style={styles.bodyText}>SERVINGS <Text style={{fontWeight: 'bold'}}>{item.recipe.yield}</Text></Text>
                </View>
                <Image style={styles.thumbnail} source={{uri: item.recipe.image}}/>
            </View>              
        );
        
        return(
            <View>{ itemsList }</View>
        );
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