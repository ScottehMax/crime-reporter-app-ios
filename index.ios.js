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
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <View style={styles.outer}>
        <Login />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderMovie}
          style={styles.listView}
        />
      </View>
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Token updateState={ this.handleToken } />
        { this.state.token &&
          <Text>
            { this.state.token }
          </Text>
        }
      </View>
    )
  }

  renderMovie(movie) {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: movie.posters.thumbnail}}
          style={styles.thumbnail}
        />
        <TouchableHighlight
          style={styles.rightContainer}
          onPress={() => { console.log(movie.title);
                           return Alert.alert(movie.title, movie.year.toString()); }}>
          <View>
            <Text style={styles.title}>{movie.title}</Text>
            <Text style={styles.year}>{movie.year}</Text>
          </View>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
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
  thumbnail: {
    width: 53,
    height: 81,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  outer: {
    flex: 1,
  },
});

AppRegistry.registerComponent('CrimeReporter', () => CrimeReporter);
