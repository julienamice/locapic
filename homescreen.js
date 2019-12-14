import React, { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ImageBackground, AsyncStorage } from 'react-native';
import { connect } from 'react-redux';
var ipAdress = require('./ipconfig');


function HomeScreen(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [login, setLogin] = useState(false);

    try {
        (AsyncStorage.getItem('userLogin', (error, data) => {
            var userFromStorage = JSON.parse(data)
            console.log(userFromStorage)
            data ? setLogin(true) : setLogin(false)
            props.navigation.navigate('Map')
        }))
    } catch (error) {
        console.log(error);

    }

    function handleSubmit() {
        fetch(`http://${ipAdress}signin?email=${email}&password=${password}`)
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                data.isLogged ? setLogin(true) : setLogin(false)
                data.isLogged ? props.navigation.navigate('Map') : console.log('Alo')
                props.setID(data.id)
                var userLogin = { email: data.user.email, password: data.user.password };
                var userStorage = JSON.stringify(userLogin)
                AsyncStorage.setItem('userLogin', userStorage)
            })
            .catch((error) => { console.log(error) })

    };


    return (
        <ImageBackground source={require('./assets/home.jpg')} style={{ width: '100%', height: '100%' }}>
            <View style={styles.home}>
                <Text>HomeScreen</Text>
                <TextInput autoCapitalize='none' style={{ backgroundColor: 'white', width: " 60%", padding: 5, marginTop: 15 }} onChangeText={(e) => { setEmail(e), console.log(e) }}></TextInput >
                <TextInput autoCapitalize='none' style={{ backgroundColor: 'white', width: " 60%", marginTop: 15, marginBottom: 15, padding: 5 }} onChangeText={(e) => { setPassword(e), console.log(e) }}></TextInput >
                <Button style={{ width: '80%' }} title="Se connecter" onPress={() => { handleSubmit() }}></Button>
            </View >
        </ImageBackground>
    )

}

const styles = StyleSheet.create({
    home: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

function mapDispatchToProps(dispatch) {

    return {
        setID: function (id) {
            dispatch({ type: 'getID', id: id })
        }

    }
}


function mapStateToProps() {


}
export default connect(null, mapDispatchToProps)(HomeScreen);
