import React, {
  Component,
  View
} from 'react-native';

import { FBSDKLoginButton } from 'react-native-fbsdklogin';
import { FBSDKGraphRequest } from 'react-native-fbsdkcore';

export default class FacebookLogin extends Component {

  render() {
    let updateState = this.props.updateState;
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
                    updateState(result)
                  }
                }, '/me?fields=id,name,email').start()
              }
            }
          }}
          onLogoutFinished={() => alert('Logged out.')}
          readPermissions={['email']}
          publishPermissions={[]}/>
      </View>
    );
  }
}
