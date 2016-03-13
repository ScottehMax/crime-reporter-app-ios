import React, {
  Component,
  Text,
  View
} from 'react-native';

import styles from '../styles.js';

import FacebookLogin from './FacebookLogin.js';

export default class Incidents extends Component {

  render() {
    return (
      <View style={styles.container}>

        <FacebookLogin
          onLogout={ this.props.onLogout } />
      </View>
    )
  }
};
