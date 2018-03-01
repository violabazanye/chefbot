import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator } from 'react-navigation';

class MainScreen extends React.Component {
    render() {
      return (
        <View style={styles.container}>
          <Text>Open up App.js to start working on your app!</Text>
          <Text>Changes you make will automatically reload.</Text>
          <Text>Shake your phone to open the developer menu.</Text>
        </View>
      );
    }
}
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#026C7C',
      alignItems: 'center',
      justifyContent: 'center',
    },
});

export default StackNavigator({
    MainScreen: {
        screen: MainScreen,
        navigationOptions: {
            title: 'Chef Bot',
        },
    },
});