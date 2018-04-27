import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class RecipeCards extends React.Component{
    constructor(props){
        super(props);

        this.getRecipesFromApi = this.getRecipesFromApi.bind(this);
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
              console.log(responseJson); 
              //set state of what to respond
          }).catch((error) => {
              console.error(error);
          });
    }

    render(){
        return(
            <View style={styles.container}>
                <Text>This is supposed to be a card showing... {this.props.content}</Text> 
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 3.3,
        margin: 10,
        shadowOffset:{  width: 1,  height: 1,  },
        shadowColor: '#800000',
        shadowOpacity: 0.5,
        shadowRadius: 3.3,
        elevation: 2,
    },
});

export default RecipeCards;