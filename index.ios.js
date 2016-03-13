/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  Alert,
  AppRegistry,
  Component,
  Navigator,
  StyleSheet,
  Text,
  View,
  Navigator,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight
} from 'react-native';

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

// const HOST_URL = 'http://localhost:3000'
const HOST_URL = 'https://crimereporter.herokuapp.com'









var cssVar = require('cssVar');

class NavButton extends React.Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor="#B5B5B5"
        onPress={this.props.onPress}>
        <Text style={styles.buttonText}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

var NavigationBarRouteMapper = {

  LeftButton: function(route, navigator, index, navState) {
    if (index === 0) {
      return null;
    }

    var previousRoute = navState.routeStack[index - 1];
    return (
      <TouchableOpacity
        onPress={() => navigator.pop()}
        style={styles.navBarLeftButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          {previousRoute.title}
        </Text>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {
    return (
      <TouchableOpacity
        onPress={() => navigator.push( {title: 'damn'} )}
        style={styles.navBarRightButton}>
        <Text style={[styles.navBarText, styles.navBarButtonText]}>
          Next
        </Text>
      </TouchableOpacity>
    );
  },

  Title: function(route, navigator, index, navState) {
    return (
      <Text style={[styles.navBarText, styles.navBarTitleText]}>
        {route.title}
      </Text>
    );
  },

};



function newRandomRoute() {
  return {
    title: '#' + Math.ceil(Math.random() * 1000),
  };
}

class NavigationBarSample extends Component {

  componentWillMount() {
    var navigator = this.props.navigator;

    this.state = {
      token: null,
      facebookProfile: null
    };

    var callback = (event) => {
      console.log(
        `NavigationBarSample : event ${event.type}`,
        {
          route: JSON.stringify(event.data.route),
          target: event.target,
          type: event.type,
        }
      );
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

  componentWillUnmount() {
    this._listeners && this._listeners.forEach(listener => listener.remove());
  }

  render() {
    let profile = this.state.facebookProfile;
    return (
      <Navigator
        debugOverlay={false}
        style={styles.appContainer}
        initialRoute={ { title: 'CrimeReporter' } }
        renderScene={(route, navigator) => (
          <View style={styles.container}>
            <Text style={{ marginTop: -200, marginBottom: 10, fontSize: 150 }} >:(</Text>
            <Text style={{ marginLeft: 40, marginRight: 40, marginBottom: 30 }}>Sorry to hear you've been involved in a crime. Log in via Facebook to give us more details.</Text>
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
        )}
        navigationBar={
          <Navigator.NavigationBar
            routeMapper={NavigationBarRouteMapper}
            style={styles.navBar}
          />
        }
      />
    );
  }

};












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
    }, this.handleLogin )
  };

  handleFacebookLogout = () => {
    Identity.delete('FacebookId', Identity.db);
    Identity.delete('FacebookName', Identity.db);
    Identity.delete('FacebookEmail', Identity.db);
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
      Identity.write('UserAuthToken', user.auth_token, Identity.db);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  messageText: {
    fontSize: 17,
    fontWeight: '500',
    padding: 15,
    marginTop: 50,
    marginLeft: 15,
  },
  button: {
    backgroundColor: 'white',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CDCDCD',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '500',
  },
  navBar: {
    backgroundColor: 'white',
  },
  navBarText: {
    fontSize: 16,
    marginVertical: 10,
  },
  navBarTitleText: {
    color: '#373E4D',
    fontWeight: '500',
    marginVertical: 9,
  },
  navBarLeftButton: {
    paddingLeft: 10,
  },
  navBarRightButton: {
    paddingRight: 10,
  },
  navBarButtonText: {
    color: '#5890FF',
  },
  scene: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#EAEAEA',
  },
});

AppRegistry.registerComponent('CrimeReporter', () => NavigationBarSample);
