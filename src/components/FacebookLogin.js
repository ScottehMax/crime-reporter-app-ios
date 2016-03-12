import React, {
  Component,
  View
} from 'react-native';

import { FBSDKLoginButton } from 'react-native-fbsdklogin';
import { FBSDKGraphRequest } from 'react-native-fbsdkcore';

export default class FacebookLogin extends Component {

  render() {
    let onLogin = this.props.onLogin;
    let onLogout = this.props.onLogout;
    return (
      <View>
        <FBSDKLoginButton
          onLoginFinished={(error, result) => {
            if (error) {
              alert('Error logging in.');
            } else {
              if (result.isCancelled) {
                alert('Login cancelled.');
              } else {
                new FBSDKGraphRequest((error, result) => {
                  if (error) {
                    alert('Error making request.');
                  } else {
                    onLogin(result)
                  }
                }, '/me?fields=id,name,email').start()
              }
            }
          }}
          onLogoutFinished={ onLogout }
          readPermissions={['email']}
          publishPermissions={[]}/>
      </View>
    );
  }
}
