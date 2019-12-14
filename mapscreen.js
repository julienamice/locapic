import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, ImageBackground } from 'react-native';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapView, { Marker } from 'react-native-maps';
import { connect } from 'react-redux';
var ipAdress = require('./ipconfig');

function MapScreen(props) {
    const [currentLocation, setLocation] = useState({ long: 0, lat: 0 });
    const [historyLocation, setHistory] = useState([{ long: 0, lat: 0 }]);

    useEffect(() => {
        _getLocationAsync();
    }, [])

    useEffect(() => {

    }, [currentLocation])

    var markerList = historyLocation.map((element, i) => {
        return (<Marker coordinate={
            {
                latitude: element.lat,
                longitude: element.long
            }
        } key={i}></Marker>)
    })

    const styles = StyleSheet.create({
        map: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }
    });

    _getLocationAsync = async () => {
        var { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            setError('Il a pas voulu, déso');
        }

        Location.watchPositionAsync({ distanceInterval: 5 },
            (loc) => {
                setLocation({
                    long: loc.coords.longitude,
                    lat: loc.coords.latitude
                });

                setHistory(history => [
                    {
                        long: loc.coords.longitude,
                        lat: loc.coords.latitude
                    }, ...history
                ])
                fetch(`http:${ipAdress}logPosition`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: 'userId=' + props.userId + '&latitude=' + currentLocation.lat + '&longitude=' + currentLocation.long
                })
            }

        )
    }


    return (

        <View style={styles.map}>
            <MapView style={{ flex: 1, width: '100%', height: '100%' }}
                followsUserLocation={true}
                showsUserLocation={true} >
                {markerList}
            </MapView>
        </View>
    )


}

function mapStateToProps(state) {
    console.log(state.idReducer)
    return { userId: state.idReducer }
}

export default connect(mapStateToProps, null)(MapScreen);