import React, {
  Alert,
  Component,
  Text,
  View
} from 'react-native';

const HOST_URL = 'http://localhost:3000';

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    margin: 15
  }
}

export default class Login extends Component {

  componentWillMount = () => {
    this.state = {
      message: null
    }
  };

  handleSubmit = () => {
    let url = `${HOST_URL}/status`;
    fetch(url, {
      method: 'GET'
    }).then((res) => {
      let token;
      if (res.status == 200) {
        token = JSON.parse(res._bodyText).token
      }
      this.props.updateState(token);
    }).catch((err) => {
      Alert.alert(
        'Request Failed',
        `Tried to connect to ${url}\n\nPlease try again soon.\nDo you have an internet connection?\nPotentially the server could be offline.`
      )
    })
  };

  render = () => {
    return (
      <View style={styles.container} >
        <Text onPress={ this.handleSubmit } style={styles.text} >
          Get Authenticity Token
        </Text>
      </View>
    );
  };

};
