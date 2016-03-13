/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  Alert,
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Identity from './src/data/Identity.js';
import Login from './src/components/Login.js';
import Incidents from './src/components/Incidents.js';

// const HOST_URL = 'http://localhost:3000'
const HOST_URL = 'https://crimereporter.herokuapp.com'

class CrimeReporter extends Component {

  static fbId = Identity.objects('Identity').filtered('name = "FacebookId"');
  static fbName = Identity.objects('Identity').filtered('name = "FacebookName"');
  static fbEmail = Identity.objects('Identity').filtered('name = "FacebookEmail"');

  componentWillMount() {
    let fbProfile;
    if (this.fbId && this.fbId.length > 0 &&
        this.fbName && this.fbName.length > 0 &&
        this.fbEmail && this.fbEmail.length > 0) {
      fbProfile = {
        id: this.fbId[0]['data'],
        name: this.fbName[0]['data'],
        email: this.fbEmail[0]['data']
      }
    }
    this.state = {
      token: null,
      facebookProfile: fbProfile
    };
    this.handleToken();
  }

  handleFacebookLogin = (p) => {
    Identity.write(() => {
      Identity.create('Identity', {
        name: 'FacebookId',
        data: p.id
      })
      Identity.create('Identity', {
        name: 'FacebookName',
        data: p.name
      })
      Identity.create('Identity', {
        name: 'FacebookEmail',
        data: p.email
      })
    })
    this.setState({
      facebookProfile: p
    }, this.handleLogin )
  };

  handleFacebookLogout = () => {
    Identity.write(() => {
      Identity.delete([this.fbId, this.fbName, this.fbEmail]);
    })
    this.setState({
      facebookProfile: null
    })
  };

  handleLogin = () => {
    let profile = this.state.facebookProfile;
    fetch(`${HOST_URL}/users/sign_in`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.state.token,
      },
      body: JSON.stringify({
        email: profile.email,
        facebook_id: profile.id
      })
    }).then((res) => {
      let user = JSON.parse(res._bodyText).user
      console.log("Retrieved user\t" + JSON.stringify(user));
      Identity.write(() => {
        Identity.create('Identity', {
          name: 'UserAuthToken',
          data: user.auth_token
        });
      })
    }).catch((err) => {
      console.log(err);
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

  render = () => {
    let profile = this.state.facebookProfile;
    return profile ?
        <Login onLogin={ this.handleFacebookLogin } /> :
        <Incidents onLogout={ this.handleFacebookLogout } />
  };
}

AppRegistry.registerComponent('CrimeReporter', () => CrimeReporter);
