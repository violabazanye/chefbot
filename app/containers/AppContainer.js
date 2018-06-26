import { DrawerNavigator } from 'react-navigation';
import MainScreen from '../containers/MainScreen';
import ListScreen from '../containers/ListScreen';  
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';

const AppContainer = DrawerNavigator({
    MainScreen: { 
      screen: MainScreen,
      navigationOptions: {
        drawerLabel: 'Home',   
      },
    },
    ListScreen: {
      screen: ListScreen,
      navigationOptions: {
        drawerLabel: 'Shopping List',
      },
    },
});

//send actions to the entire application
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(() => { return {} }, mapDispatchToProps)(AppContainer); 