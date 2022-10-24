import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite'

import { Header, ListItem, Icon, Input, Button } from 'react-native-elements';

const db = SQLite.openDatabase('coursedb.db');

export default function App() {

  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('create table if not exists shoppingList (id integer primary key not null, product text, amount text);');
    }, null, updateList);
  }, []);

  const saveItem = () => {
    db.transaction(tx => {
      tx.executeSql('insert into shoppingList (product, amount) values (?, ?);', [product, amount]);
    }, null, updateList
    )
  }

  const deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql('delete from shoppingList where id = ?;', [id]);
      }, null, updateList
    )
  }

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from shoppingList;', [], (_, { rows }) =>
        setShoppingList(rows._array)
      );
    });
  }

  return (
    <View style={styles.container}>

      <Header
        centerComponent={{text: 'SHOPPING LIST', style: { color: '#fff', marginBottom: 5 }}}
      />

      <View style={styles.container2}>

        <Input
          containerStyle={{ width: 390 }}
          inputStyle={{ borderColor: 'gray', fontSize: 15, }}
          placeholder='Product'
          label='PRODUCT'
          labelStyle={{ fontSize: 13, color: 'gray', fontWeight: 'bold', }}
          onChangeText={(product) => setProduct(product)}
          value={product}
        />

        <Input
          containerStyle={{ width: 390 }}
          inputStyle={{ borderColor: 'gray', fontSize: 15, }}
          placeholder='Amount'
          label='AMOUNT'
          labelStyle={{ fontSize: 13, color: 'gray', fontWeight: 'bold', }}
          onChangeText={(amount) => setAmount(amount)}
          value={amount}
        />

        <Button
          raised icon={{ name: 'save', color: 'white' }}
          onPress={saveItem}
          title='Save'
        />

        <FlatList
          data={shoppingList}
          renderItem={({ item }) =>
            <ListItem bottomDivider>
              <ListItem.Content>
                <ListItem.Title style={{fontSize: 15}}>{item.product}</ListItem.Title>
                <ListItem.Subtitle style={{fontSize: 15}}>{item.amount}</ListItem.Subtitle>
              </ListItem.Content>
              <Icon type='material' name='delete' color='red' onPress={() => deleteItem(item.id)} />
            </ListItem>
          }
          keyExtractor={item => item.id.toString()}
        />

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },

  container2: {
    marginTop: 10,
    marginLeft: 8,
    marginRight: 8
  }
  
});
