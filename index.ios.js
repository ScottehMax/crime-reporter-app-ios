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
  View,
  Image,
  ListView,
  TouchableHighlight,
  Alert,
} from 'react-native';

import Token from './src/components/GetAuthToken.js'
import FacebookLogin from './src/components/FacebookLogin.js'

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
        <FacebookLogin />
        <Token updateState={ this.handleToken } />
        { this.state.token &&
          <Text>
            { this.state.token }
          </Text>
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

AppRegistry.registerComponent('CrimeReporter', () => CrimeReporter);
