import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ImageBackground } from 'react-native';

var ipAdress = require('./ipconfig');

function ChatScreen() {
    return (
        <View style={styles.chat}>
            <Text>ChatScreen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    chat: {
        flex: 1,
        backgroundColor: 'lightpink',
        alignItems: 'center',
        justifyContent: 'center',
    }
});



module.exports = ChatScreen