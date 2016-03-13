import React, {
  Component
} from 'react-native';

export default class AppRouter extends Component {
  static propTypes = {
    name: React.PropTypes.string.isRequired,
    default: React.PropTypes.string,
    onForward: React.PropTypes.func.isRequired,
    onBack: React.PropTypes.func.isRequired
  };

  handleComponent = (c) => {
    let c_ = require(`./components/${c ? c : this.props.name}.js`);
    return c_ ? c_ : null;
  };

  render = () => {
    let Component = this.handleComponent();
    if (!Component) Component = this.handleComponent('GetAuthToken');
    return (
      <Text>
        Some shit
      </Text>
    );
  };
};
