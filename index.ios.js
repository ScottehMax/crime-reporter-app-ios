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

import Identity from './src/data/Identity.js';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

const HOST_URL = 'http://localhost:3000';

class CrimeReporter extends Component {

  componentWillMount() {
    let fbId = Identity.retrieve('FacebookId', Identity.db);
    let fbName = Identity.retrieve('FacebookName', Identity.db);
    let fbEmail = Identity.retrieve('FacebookEmail', Identity.db);
    let fbProfile;
    if (fbId && fbName && fbEmail) {
      fbProfile = {
        id: fbId['data'],
        name: fbName['data'],
        email: fbEmail['data']
      }
    }
    this.state = {
      token: null,
      facebookProfile: fbProfile
    };
    this.handleToken();
  }

  handleFacebookLogin = (p) => {
    Identity.write('FacebookId', p.id, Identity.db);
    Identity.write('FacebookName', p.name, Identity.db);
    Identity.write('FacebookEmail', p.email, Identity.db);
    this.setState({
      facebookProfile: p
    })
  };

  handleFacebookLogout = () => {
    this.setState({
      facebookProfile: null
    })
  };

  handleToken = () => {
    let url = `${HOST_URL}/status`;
    fetch(url, {
      method: 'GET'
    }).then((res) => {
      let token;
      if (res.status == 200) {
        token = JSON.parse(res._bodyText).token
      }
      this.setState({
        token: token
      }, () => {
        console.log('Retrieved token:\t' + token)
      });
    }).catch((err) => {
      Alert.alert(
        'Request Failed',
        `Tried to connect to ${url}\n\nPlease try again soon.\nDo you have an internet connection?\nPotentially the server could be offline.`
      );
    })
  };

  renderLogin = () => {
    let profile = this.state.facebookProfile;
    return (
      <View style={styles.container}>
        <FacebookLogin
          onLogin={ this.handleFacebookLogin }
          onLogout={ this.handleFacebookLogout }
        />
        { profile &&
          <Text>
            { `ID:\t${profile.id}\nName:\t${profile.name}\nEmail:\t${profile.email}` }
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
    // return loggedIn ? this.renderNav() : this.renderLogin();
    return this.renderLogin();
  }
}

AppRegistry.registerComponent('CrimeReporter', () => CrimeReporter);
