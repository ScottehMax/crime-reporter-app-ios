/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  Navigator,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Token from './src/components/GetAuthToken.js'
import FacebookLogin from './src/components/FacebookLogin.js'
import AppRouter from './src/AppRouter.js'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

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

  renderLogin = () => {
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
  };

  renderNav = () => {
    return (
      <View style={styles.container} >
        <Navigator
          initialRoute={{ name: 'Home', index: 0 }}
          renderScene={(route, navigator) => {
            <AppRouter
              name={route.name}
              default={ 'Home' }
              onForward={() => {
                nextIndex++
                navigator.push({
                  name: 'Scene ' + nextIndex,
                  index: nextIndex,
                });
              }}
              onBack={() => {
                if (route.index > 0) {
                  navigator.pop()
                }
              }}
            />
          }}
        />
      </View>
    )
  };

  render() {
    let profile = this.state.facebookProfile;
    let token = this.state.token;
    let loggedIn = token && profile;
    return loggedIn ? this.renderNav() : this.renderLogin();
  }
}

AppRegistry.registerComponent('CrimeReporter', () => CrimeReporter);
