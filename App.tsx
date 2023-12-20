/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

interface UserData {
  id: number;
  name: string;
  email: string;
}

const App = () => {
  const [data, setData] = useState<UserData[]>([]);
  const [filteredData, setFilteredData] = useState<UserData[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [showUnfetchButton, setShowUnfetchButton] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchUserData = async () => {
    try {
      setIsFetching(true);
      setShowUnfetchButton(false);

      const url = 'http://127.0.0.1:3000/users';
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result: UserData[] = await response.json();
      setData(result);
      setFilteredData(filterData(result, searchText));
      setShowUnfetchButton(true);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserDataWithDelay = () => {
    setIsFetching(true);
    setTimeout(() => {
      fetchUserData();
    }, 2000);
  };

  const unfetchUserData = () => {
    setIsFetching(false);
    setData([]);
    setFilteredData([]);
    setShowUnfetchButton(false);
    setSearchText('');
  };

  const renderUserItem = ({ item }: { item: UserData }) => (
    <View style={styles.userContainer}>
      <Text style={styles.userId}>ID: {item.id}</Text>
      <Text style={styles.userName}>Name: {item.name || 'Name not available'}</Text>
      <Text style={styles.userEmail}>Email: {item.email || 'Email not available'}</Text>
    </View>
  );

  const filterData = (data: UserData[], searchText: string) => {
    return data.filter(user => user.name.toLowerCase().includes(searchText.toLowerCase()));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {data.length > 0 && (
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Users Data List</Text>
        </View>
      )}

      <View style={styles.centeredContainer}>
        {!showUnfetchButton && (
          <TouchableOpacity
            style={styles.fetchButton}
            onPress={() => fetchUserDataWithDelay()}
            disabled={isFetching}
          >
            <Text style={styles.buttonText}>{isFetching ? 'Fetching...' : 'Fetch User Data'}</Text>
          </TouchableOpacity>
        )}

        {isFetching && <ActivityIndicator size="large" color="#3498db" />}

        {!isFetching && filteredData.length === 0 || filteredData.length === 0 && (
          <Text style={styles.emptyText}>
            No matching users found. Please fetch user data again.
          </Text>
        )}

        {showUnfetchButton && (
          <TouchableOpacity
            style={styles.unfetchButton}
            onPress={() => unfetchUserData()}
            disabled={!data.length}
          >
            <Text style={styles.buttonText}>Unfetch User Data</Text>
          </TouchableOpacity>
        )}

        {showUnfetchButton && (
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name"
            value={searchText}
            onChangeText={text => {
              setSearchText(text);
              setFilteredData(filterData(data, text));
            }}
          />
        )}
      </View>

      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id.toString()}
          renderItem={renderUserItem}
          style={styles.flatList}
        />
      ) : (
        searchText.length > 0 && (
          <Text style={styles.emptyText}>No matching users found.</Text>
        )
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    marginBottom: 10,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  fetchButton: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: 20,
  },
  unfetchButton: {
    backgroundColor: '#e74c3c',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  userContainer: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
  },
  userId: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 18,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#555',
  },
  emptyText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  flatList: {
    marginTop: 10,
  },
  centeredContainer: {
    // flex: 1,
    // justifyContent: 'center',
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default App;