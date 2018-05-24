import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

class IngredientsCard extends React.Component{
    render(){
        return(
            <View style={styles.container}>
                <Text>it works!</Text>
            </View>
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
    },
});

export default IngredientsCard;