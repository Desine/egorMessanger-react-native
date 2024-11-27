import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  FlatList,
  Button,
} from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

export default function Index() {
  const [text, onChangeText] = useState("Enter message");

  const [messages, setMessages] = useState([]);

  const getMessages = async () => {
    try {
      const response = await fetch("http://192.168.0.4:5070/stock");
      const json = await response.json();
      setMessages(json);
    } catch (error) {
      console.error(error);
    }
  };

  const postMessage = async () => {
    try {
      await fetch("http://192.168.0.4:5070/stock", {
        method: "post",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        //make sure to serialize your JSON body
        body: JSON.stringify({
          text: text,
        }),
      }).then((response) => {
        console.log(response);
      });

      onChangeText("");
      getMessages();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteMessages = async () => {
    try {
      const response = await fetch("http://192.168.0.4:5070/stock", {
        method: "delete",
      });
    } catch (error) {
      console.error(error);
    }
    getMessages()
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <SafeAreaView>
      <View style={styles.top}>
        <View style={styles.buttonsContainer}>
          <Button title="update" onPress={() => getMessages()} />
          <Button title="delete" onPress={() => deleteMessages()} color={'#d33'} />
        </View>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          onSubmitEditing={() => postMessage()}
          value={text}
        />
      </View>
      <FlatList
        data={messages}
        keyExtractor={(item, index) =>
          item.id ? item.id.toString() : index.toString()
        }
        renderItem={({ item }) => <Text>{item.text}</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    flex: 1
  },
  buttonsContainer:{
    flexDirection: 'row',
  }
});
