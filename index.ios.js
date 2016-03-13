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
  View,
  Navigator,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  ListView
} from 'react-native';

import FacebookLogin from './src/components/FacebookLogin.js'
import AppRouter from './src/AppRouter.js'

import Identity from './src/data/Identity.js';

const HOST_URL = 'http://localhost:3000'
// const HOST_URL = 'https://crimereporter.herokuapp.com'

class NavButton extends React.Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.button}
        underlayColor="#A5A5A5"
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
          Back
        </Text>
      </TouchableOpacity>
    );
  },

  RightButton: function(route, navigator, index, navState) {
    if (index === 2) {
      return null;
    }
    return (
      <TouchableOpacity
        onPress={() => navigator.push( {title: scenes[index]} )}
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

class NavigationBarSample extends Component {

  componentWillMount() {
    var navigator = this.props.navigator;

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
    let uAT;
    let uATr = Identity.db.objects('Identity').filtered('name = "UserAuthToken"');
    console.log(uATr[0]['data']);
    if (uATr.length > 0) {
      uAT = uATr[0]['data']
    }
    this.state = {
      token: null,
      facebookProfile: fbProfile,
      statements: [],
      UserAuthToken: uAT,
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
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
      let uats = Identity.db.objects('Identity').filtered('name = "UserAuthToken"');
      Identity.db.write(() => {
        if (uats.length > 0) {
          uats[0]['data'] = user.auth_token
        } else {
          Identity.db.create('Identity', {
            name: 'UserAuthToken',
            data: user.auth_token
          })
        }
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
        this.handleReports()
      });
    }).catch((err) => {
      Alert.alert(
        'Request Failed',
        `Tried to connect to ${url}\n\nPlease try again soon.\nDo you have an internet connection?\nPotentially the server could be offline.`
      );
    })
  };

  handleReports = () => {
    let profile = this.state.facebookProfile;
    let uATr = Identity.db.objects('Identity').filtered('name = "UserAuthToken"');
    fetch(`${HOST_URL}/api/statement`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.state.token,
      },
      body: JSON.stringify({
        auth_token: uATr[0]['data']
      })
    }).then((res) => {
      console.log(res);
      if (res.status == 200) {
        let response = JSON.parse(res._bodyText)
        let s_s = response.statements
        s_s.map((s) => {
          let something = s.statement
          something.resolved = s.resolved
          return something
        })
        this.setState({
          statements: s_s,
          dataSource: this.state.dataSource.cloneWithRows(response.statements)
        });
      }
    }).catch((err) => {
      console.log(err);
    })
  };

  componentWillUnmount() {
    this._listeners && this._listeners.forEach(listener => listener.remove());
  }

  handleSubmitStatement = () => {
    let profile = this.state.facebookProfile;
    let uATr = Identity.db.objects('Identity').filtered('name = "UserAuthToken"');
    fetch(`${HOST_URL}/api/statement/new`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRF-Token': this.state.token,
      },
      body: JSON.stringify({
        auth_token: uATr[0]['data'],
        content: this.state.statementContent
      })
    }).then((res) => {
      let s = {}
      s.statement = JSON.parse(res._bodyText).statement
      s.resolved = JSON.parse(res._bodyText).resolved
      if (res.status == 201) {
        let statements = this.state.statements;
        statements.push(s);
        this.setState({
          statements: statements,
          dataSource: this.state.dataSource.cloneWithRows(statements)
        });
      }
    }).catch((err) => {
      console.log(err);
    })
  };

  renderTheShit(route, navigator) {
    let profile = this.state.facebookProfile;
    switch(route.title) {
      case 'CrimeReporter':
      return (
        <View style={styles.container}>
          <Text style={{ marginTop: -200, marginBottom: 10, fontSize: 150, textAlign: 'center' }} >:(</Text>
          <View style={{ marginLeft: 20, marginRight: 20, marginBottom: 30 }}>
            <Text style={{textAlign: 'center'}}>Sorry to hear you've been involved in a crime.</Text>
            { !profile && <Text style={{textAlign: 'center'}}>Log in via Facebook to give us more details.</Text> }
            { profile && <Text style={{textAlign: 'center'}}>Click "Next" in the corner to give us more details.</Text> }
          </View>
          <FacebookLogin
            onLogin={ this.handleFacebookLogin }
            onLogout={ this.handleFacebookLogout }/>
          { profile &&
            <Text>
              { `ID:\t${profile.id}\nName:\t${profile.name}\nEmail:\t${profile.email}` }
            </Text>
          }
        </View>
      )
      case 'Submit a Report':
      return (
        <View style={styles.container}>
          <Text>Full Name</Text>
          <Text
            style={{marginLeft: 20, marginRight: 20, marginBottom:10, borderColor: 'gray', borderWidth: 1, padding: 8 }} >
            {profile.name}
          </Text>
          <Text>Email</Text>
          <Text
            style={{marginLeft: 20, marginRight: 20, marginBottom:10, borderColor: 'gray', borderWidth: 1, padding: 8 }} >
            {profile.email}
          </Text>
          <Text>Statement</Text>
          <TextInput
            defaultValue={"Enter more details here."}
            multiline={true}
            onChangeText={(statementContent) => this.setState({statementContent: statementContent})}
            value={this.state.statementContent}
            style={{marginLeft: 20, marginRight: 20, marginBottom:10, height: 216, borderColor: 'gray', borderWidth: 1, padding: 8 }}
            />
          <TouchableHighlight
            style={styles.button}
            underlayColor="#A5A5A5"
            onPress={this.handleSubmitStatement}>
            <Text style={styles.buttonText}>Send details</Text>
          </TouchableHighlight>
        </View>
      )
      case 'List of Reports':
      return (
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderStatement}
          style={styles.listView}
          />
      );
    }
  }

  renderStatement(statement) {
    console.log(statement);
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{statement.statement.content}</Text>
        <Text style={styles.year}>{statement.resolved ? 'Resolved' : 'In progress'}</Text>
      </View>
    )
  }

  render() {

    return (
      <Navigator
        debugOverlay={false}
        style={styles.appContainer}
        initialRoute={ { title: 'CrimeReporter' } }
        renderScene={(route, navigator) => this.renderTheShit(route, navigator)}
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


var scenes = ['Submit a Report', 'List of Reports'];



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
                  name: scenes[nextIndex],
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
  listView: {
    paddingTop: 65,
    backgroundColor: '#F5FCFF',
  },
  year: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
  },
});

AppRegistry.registerComponent('CrimeReporter', () => NavigationBarSample);
