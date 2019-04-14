import React, { Component } from "react";
import { MdInsertDriveFile } from "react-icons/md";

import Dropzone from "react-dropzone";

import socket from "socket.io-client";

import { distanceInWords } from "date-fns";
import pt from "date-fns/locale/pt";

import "./styles.css";
import logo from "../../assets/logo.svg";
import { getBoxes, postBoxFile } from "../../services/api/Boxes";

export default class Box extends Component {
  state = {
    box: {}
  };

  async componentDidMount() {
    this.subscribeToNewFiles();
    const response = await getBoxes(this.props.match.params.id);
    this.setState({ box: response });
  }

  subscribeToNewFiles = () => {
    const io = socket("https://omnicourse-api.herokuapp.com");
    io.emit("connectRoom", this.props.match.params.id);
    io.on("file", data => {
      this.setState({
        box: {
          ...this.state.box,
          files: [data, ...this.state.box.files]
        }
      });
    });
  };

  handleUpload = files => {
    files.forEach(file => {
      const data = new FormData();
      data.append("file", file);
      postBoxFile(this.state.box._id, data);
    });
  };

  render() {
    return (
      <div id="box-container">
        <header>
          <img src={logo} alt="RocketBox" />
          <h1>{this.state.box.title}</h1>
        </header>

        <Dropzone onDropAccepted={this.handleUpload}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              className={`upload ${isDragActive && "dragging"}`}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <p>Arraste arquivos ou clique aqui!</p>
            </div>
          )}
        </Dropzone>

        <ul>
          {this.state.box.files &&
            this.state.box.files.map(file => (
              <li key={file._id}>
                <a
                  className="fileInfo"
                  href={file.url}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <MdInsertDriveFile size={24} color="#a5cfff" />
                  <strong>{file.title}</strong>
                </a>
                <span>
                  há{" "}
                  {distanceInWords(file.createdAt, new Date(), { locale: pt })}
                </span>
              </li>
            ))}
        </ul>
      </div>
    );
  }
}
