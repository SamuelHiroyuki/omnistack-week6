import React, { Component } from 'react'
import { Text, View, FlatList, TouchableOpacity } from 'react-native'

import { getBoxes, postBoxFile } from "../../services/api/Boxes";

import Icon from 'react-native-vector-icons/MaterialIcons'

import styles from './styles'
import AsyncStorage from '@react-native-community/async-storage';

import { distanceInWords } from "date-fns";
import pt from "date-fns/locale/pt";

import ImagePicker from 'react-native-image-picker'
import RNFS from "react-native-fs";
import FileViewer from "react-native-file-viewer";

import socket from "socket.io-client";

export default class index extends Component {
  state = {
    box: {}
  };

  async componentDidMount() {
    const box = await AsyncStorage.getItem('@OmniBox:box');
    this.subscribeToNewFiles(box);
    const response = await getBoxes(box);
    this.setState({ box: response });
  }

  openFile = async (file) => {
    try {
      const filePath = `${RNFS.DocumentDirectoryPath}/${file.title}`;

      await RNFS.downloadFile({
        fromUrl: file.url,
        toFile: filePath
      });

      await FileViewer.open(filePath);
    } catch (error) {
      console.log(error)
    }
  }

  subscribeToNewFiles = (box) => {
    const io = socket("https://omnicourse-api.herokuapp.com");
    io.emit("connectRoom", box);
    io.on("file", data => {
      this.setState({
        box: {
          ...this.state.box,
          files: [data, ...this.state.box.files]
        }
      });
    });
  };

  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.openFile(item)} style={styles.file}>
      <View style={styles.fileInfo}>
        <Icon name='insert-drive-file' size={24} color='#5acfff' />
        <Text style={styles.fileTitle}>{item.title}</Text>
      </View>
      <Text style={styles.fileDate}>
        há{" "}
        {distanceInWords(item.createdAt, new Date(), { locale: pt })}
      </Text>
    </TouchableOpacity>
  );

  handleUpload = () => {
    ImagePicker.launchImageLibrary({}, async upload => {
      if (upload.error) {
        console.log(error);
      } else if (upload.didCancel) {
        console.log('Canceled by user.');
      } else {
        const data = new FormData();

        const [prefix, suffix] = upload.fileName.split('.');
        const ext = suffix.toLowerCase() === 'heic' ? 'jpg' : suffix;

        data.append("file", {
          uri: upload.uri,
          type: upload.type,
          name: `${prefix}.${ext}`,
        });
        postBoxFile(this.state.box._id, data);
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.boxTitle}>{this.state.box.title}</Text>
        <FlatList
          style={styles.list}
          data={this.state.box.files}
          keyExtractor={file => file._id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={this.renderItem}
        />
        <TouchableOpacity onPress={this.handleUpload} style={styles.fab}>
          <Icon name='cloud-upload' size={24} color='#fff' />
        </TouchableOpacity>
      </View>
    )
  }
}
