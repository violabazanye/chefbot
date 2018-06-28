import React from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';

import { connect } from 'react-redux';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';

class MultiSelectList extends React.PureComponent {
    state = { selected: (new Map(): Map<string, boolean>) };
  
    addIngredient(text){
      this.props.addIngredient(text); 
    }

    toggleIngredient(index){
      this.props.toggleIngredient(index);      
    }
    
    _onPressItem = (id: string) => {
      // updater functions are preferred for transactional updates
      this.setState((state) => {
        // copy the map rather than modifying state.
        const selected = new Map(state.selected);
        selected.set(id, !selected.get(id)); // toggle
        return {selected};  
      });
    };
  
    _renderItem = ({item}) => (
      <MyListItem
        id={item.id}
        onPressItem={this._onPressItem}
        selected={!!this.state.selected.get(item.id)}
        title={item.title}
      />
    );
  
    render() {
      return (
        <FlatList
          data={this.props.data}
          extraData={this.state}  
          keyExtractor={(item, index) => index}   
          renderItem={this._renderItem}
        />
      );
    }
}

class MyListItem extends React.PureComponent {
    _onPress = () => {
      this.props.onPressItem(this.props.id);
    };
  
    render() {
      return (
        <View style={styles.tableRow}>
            <Text style={{fontSize:12,width:150}}>
              {this.props.title}
            </Text>
            {this.props.selected ?
            <TouchableOpacity onPress={this._onPress}>
            <Image style={{width:24,height:24,marginRight:24,justifyContent: 'center', alignItems: 'center'}} source={require('../img/outline_remove_circle_outline_black_18dp.png')} />
            </TouchableOpacity> :
            <TouchableOpacity onPress={this._onPress}>
            <Image style={{width:24,height:24,marginRight:24,justifyContent: 'center', alignItems: 'center'}} source={require('../img/outline_add_circle_outline_black_18dp.png')} />
            </TouchableOpacity>
            }
        </View>
      );
    }
}

const styles = StyleSheet.create({
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 16
  }
});

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
  
export default connect(() => { return {} }, mapDispatchToProps)(MultiSelectList);