import React, { Component } from 'react'
import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import { postBoxes } from '../../services/api/Boxes';

import styles from './styles'
import logo from '../../assets/logo.png'

export default class index extends Component {
  state = {
    newBox: ''
  };

  async componentWillMount() {
    const box = await AsyncStorage.getItem('@OmniBox:box');
    if (box) this.props.navigation.navigate('Box');
  }

  handleSignIn = async () => {
    const response = await postBoxes(this.state.newBox); -
      await AsyncStorage.setItem('@OmniBox:box', response._id);
    this.props.navigation.navigate('Box');
  }

  render() {
    return (
      <View style={styles.container}>
        <Image style={styles.logo} source={logo} />
        <TextInput
          style={styles.input}
          placeholder="Crie um Box!"
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
          underlineColorAndroid="transparent"
          value={this.state.newBox}
          onChangeText={text => this.setState({ newBox: text })}
        />
        <TouchableOpacity onPress={this.handleSignIn} style={styles.button}>
          <Text style={styles.buttonText}>Criar</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
