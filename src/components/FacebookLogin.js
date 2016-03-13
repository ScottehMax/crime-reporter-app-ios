import React, {
  Alert,
  Component,
  View
} from 'react-native';

import { FBSDKLoginButton } from 'react-native-fbsdklogin';
import { FBSDKGraphRequest } from 'react-native-fbsdkcore';

export default class FacebookLogin extends Component {

  render() {
    let onLogin = this.props.onLogin;
    let onLogout = this.props.onLogout;
    console.log("Login:\t" + onLogin, "Logout:\t" + onLogout);
    return (
      <FBSDKLoginButton
        onLoginFinished={(error, result) => {
          if (error) {
            Alert.alert('Error logging in.');
          } else if (result.isCancelled) {
            Alert.alert('Login cancelled.');
          } else {
            let requestFunc = (error, result) => {
              if (error) {
                Alert.alert('Error making request.');
              } else {
                onLogin(result)
              }
            };
            new FBSDKGraphRequest(
              requestFunc,
              '/me?fields=id,name,email'
            ).start()
          }
        }}
        onLogoutFinished={ onLogout }
        readPermissions={['email']}
        publishPermissions={[]}/>
    );
  }
}
