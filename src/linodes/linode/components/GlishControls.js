import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import Button from 'linode-components/dist/buttons/Button';
import { powerOnLinode, powerOffLinode, rebootLinode } from '~/api/ad-hoc/linodes';

export class GlishControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      overrideMessage: null,
    };
    this.powerAction = this.powerAction.bind(this);
    this.reboot = this.reboot.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.message !== nextProps.message) {
      this.setState({ overrideMessage: null });
    }
  }

  powerOff = () => {
    if (this.props.linodeId) {
      this.props.powerOffLinode();
      this.setState({ overrideMessage: 'Linode is powering down' });
    }
  }

  powerOn = () => {
    if (this.props.linodeId) {
      this.props.powerOnLinode();
      this.setState({ overrideMessage: 'Linode is booting up' });
    }
  }

  powerAction() {
    this.props.powered ? this.powerOff() : this.powerOn();
  }

  reboot() {
    if (this.props.linodeId) {
      this.props.rebootLinode();
      this.setState({ overrideMessage: 'Linode is rebooting' });
    }
  }

  render() {
    const { powered, connected, message } = this.props;
    const { overrideMessage } = this.state;

    let bgColor = 'bg-warning';
    if (!overrideMessage) {
      if (!powered) {
        bgColor = 'bg-danger';
      }
      if (connected) {
        bgColor = 'bg-success';
      }
    }

    return (
      <div id="glish-controls" className={`p-2 text-center clearfix text-white ${bgColor}`}>
        <Button
          onClick={this.powerAction}
          className="float-left mr-2 fa fa-power-off power-btn"
          disabled={!!overrideMessage}
        />
        <Button
          onClick={this.reboot}
          className="float-left"
          disabled={!!overrideMessage}
        >
          Reboot
        </Button>
        <span className="align-middle">{overrideMessage || message}</span>
        <Button className="float-right invisible">Ctrl + Alt + Del</Button>
      </div>
    );
  }
}

GlishControls.propTypes = {
  connected: PropTypes.bool.isRequired,
  linodeId: PropTypes.number,
  message: PropTypes.string.isRequired,
  powered: PropTypes.bool.isRequired,
  powerOffLinode: PropTypes.func.isRequired,
  powerOnLinode: PropTypes.func.isRequired,
  rebootLinode: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch, ownProps) => {
  const { linodeId } = ownProps;
  return {
    powerOffLinode: () => dispatch(powerOffLinode(linodeId)),
    powerOnLinode: () => dispatch(powerOnLinode(linodeId)),
    rebootLinode: () => dispatch(rebootLinode(linodeId)),
  };
};

export default connect(null, mapDispatchToProps)(GlishControls);
