import React, { Component } from 'react';
import './styles.css';

import logo from '../../assets/logo.svg';
import { postBoxes } from '../../services/api/Boxes';

export default class Main extends Component {
    state = {
        boxName: ''
    };

    handleSubmit = async e => {
        e.preventDefault();
        const response = await postBoxes(this.state.boxName);

        this.props.history.push(`/box/${response._id}`);
    }

    render() {
        return (
            <div id='main-container'>
                <form onSubmit={this.handleSubmit}>
                    <img src={logo} alt='RocketBox' />
                    <input 
                        value={this.state.boxName}
                        placeholder='Crie um novo Box'
                        onChange={e => this.setState({ boxName: e.target.value })}
                    />
                    <button typer='submit'>Criar</button>
                </form>
            </div>
        )
    }
}
