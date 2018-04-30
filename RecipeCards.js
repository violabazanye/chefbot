import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

    //keep searching for better api
    getRecipesFromApi = async(param) => {
        fetch("http://food2fork.com/api/search?key=48aecb84c8894961ef3e0e152b72f733&q=" + param, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }, 
        }).then((response) => response.json()) 
          .then((responseJson) => {
            this.setState({recipes: this.shuffleArray(responseJson.recipes)}, function(){
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
            <View key={item.recipe_id} style={[styles.container, {borderLeftColor: this.changeColor(index)}]}>
                <Text style={styles.titleText}>{item.title}</Text> 
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
        height: 105,
        borderLeftWidth: 5,
    },
    titleText: {
        margin: 10,
        fontSize: 15,
        fontFamily: 'Roboto',
        color: '#4a4a4a',
    },
});

export default RecipeCards;