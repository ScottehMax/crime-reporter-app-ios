import React, {
  Component,
  View
} from 'react-native';

import { FBSDKLoginButton } from 'react-native-fbsdklogin';
import { FBSDKGraphRequest } from 'react-native-fbsdkcore';

export default class FacebookLogin extends Component {

  render() {
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
                console.log(result);
                new FBSDKGraphRequest((error, result) => {
                  if (error) {
                    alert('Error making request.');
                  } else {
                    console.log(result);
                    // Data from request is in result
                  }
                }, '/me').start()
              }
            }
          }}
          onLogoutFinished={() => alert('Logged out.')}
          readPermissions={[]}
          publishPermissions={['publish_actions']}/>
      </View>
    );
  }
}
