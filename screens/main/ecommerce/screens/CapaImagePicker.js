import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, FlatList, Text,Button, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
const styles = StyleSheet.create({
    flexContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    flatListContainer: {
        justifyContent: 'flex-end',
        height: 120,
    },
    galleryImage: {
        width: 120,
        height: 120,
    },
});

export default class CapaImagePicker extends React.Component {
    state = { selectedPhoto: null, bounceValue: new Animated.Value(100) };

    componentDidMount() {
        
    }

    pickPhoto(photo) {
        const { onChange } = this.props;
        this.setState({ selectedPhoto: photo });
        onChange(photo);
    }

    renderPhoto = photo => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.pickPhoto(photo.item);
                }}
            >
                <Image source={{ uri: photo.item.uri }} style={ styles.galleryImage } />
            </TouchableOpacity>
        );
    };

    toggleGallery() {
        const { bounceValue } = this.state;
        Animated.spring(bounceValue, {
            toValue: 220,
            velocity: 3,
            tension: 2,
            friction: 8,
            useNativeDriver: true,
        }).start();
    }

    handleChoosePhoto = () =>{
        const options = {};
        ImagePicker.launchImageLibrary(options, response=>{
            console.log("response",response);
        });
    };

    render() {
        const { selectedPhoto, bounceValue } = this.state;
        const { photos } = this.props;
        return (
            <View style = {{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Button
                    title = "Choose Photo"
                    onPress = {this.handleChoosePhoto}
                />
            </View>        
        )
    }
}

CapaImagePicker.propTypes = {
    onChange: PropTypes.func.isRequired,
    photos: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};