import React, {
  Component,
  Text,
  View
} from 'react-native';

import styles from '../styles.js';

import FacebookLogin from './FacebookLogin.js';

export default class Login extends Component {

  render() {
    return (
      <View style={styles.container}>
        <FacebookLogin
          onLogin={ this.props.onLogin }
        />
      </View>
    );
  }
}
