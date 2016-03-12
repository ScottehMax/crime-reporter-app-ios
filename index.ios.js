/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Token from './src/components/GetAuthToken.js'

class CrimeReporter extends Component {

  componentWillMount() {
    this.state = {
      token: null
    };
  }

  handleToken = (t) => {
    this.setState({
      token: t
    }, () => {
      console.log(this.state);
    })
  };

  render() {
    return (
      <View style={styles.container}>
        <Token updateState={ this.handleToken } />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('CrimeReporter', () => CrimeReporter);
