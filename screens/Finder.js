import React from 'react';
import { SafeAreaView } from 'react-native';
import Map from './screens/Map';

const Finder = () => {
    const initialRegion = {
        latitude: 37.78825, // Initial latitude
        longitude: -122.4324, // Initial longitude
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Map initialRegion={initialRegion} />
        </SafeAreaView>
    );
};

export default Finder;