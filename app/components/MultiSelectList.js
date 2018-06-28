import React from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet, Image } from 'react-native';

export default class MultiSelectList extends React.PureComponent {
    state = { selected: (new Map(): Map<string, boolean>) };
    
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
        addItem={this.props.addItem}
        removeItem={this.props.removeItem} 
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
    _onPressAdd = () => {
      this.props.onPressItem(this.props.id);
      this.props.addItem(this.props.title);
    };

    _onPressRemove = () => {
      this.props.onPressItem(this.props.id);
      this.props.removeItem(this.props.id);
    };
  
    render() {
      return (
        <View style={styles.tableRow}>
            <Text style={{fontSize:12,width:150}}>
              {this.props.title}
            </Text>
            {this.props.selected ?
            <TouchableOpacity onPress={this._onPressRemove}>
            <Image style={{width:24,height:24,marginRight:24,justifyContent: 'center', alignItems: 'center'}} source={require('../img/outline_remove_circle_outline_black_18dp.png')} />
            </TouchableOpacity> :
            <TouchableOpacity onPress={this._onPressAdd}>
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