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
import FacebookLogin from './src/components/FacebookLogin.js'

class CrimeReporter extends Component {

  componentWillMount() {
    this.state = {
      token: null,
      facebookProfile: null
    };
  }

  handleFacebook = (p) => {
    this.setState({
      facebookProfile: p
    }, () => {
      console.log(this.state);
    })
  };

  handleToken = (t) => {
    this.setState({
      token: t
    }, () => {
      console.log(this.state);
    })
  };

  render() {
    let profile = this.state.facebookProfile;
    return (
      <View style={styles.container}>
        <FacebookLogin updateState={ this.handleFacebook } />
        { profile &&
          <Text>
            { `ID:\t${profile.id}\nName:\t${profile.name}\nEmail:\t${profile.email}` }
          </Text>
        }
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

AppRegistry.registerComponent('CrimeReporter', () => CrimeReporter);
