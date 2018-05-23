import React from 'react';
import PropTypes from 'prop-types';
import Input from './Input';
import ButtonLoader from './ButtonLoader';
import {connect} from 'react-redux';
import {
  requestPasswordResetFormUpdate,
  requestPasswordReset
} from '../../actions/redux-auth/request-password-reset';

class RequestPasswordResetForm extends React.Component {
  static propTypes = {
    endpoint: PropTypes.string,
    inputProps: PropTypes.shape({
      email: PropTypes.object,
      submit: PropTypes.object
    })
  };

  static defaultProps = {
    inputProps: {
      email: {},
      submit: {}
    }
  };

  getEndpoint () {
    return (
      this.props.endpoint ||
      this.props.auth.getIn(['configure', 'currentEndpointKey']) ||
      this.props.auth.getIn(['configure', 'defaultEndpointKey'])
    );
  }

  handleInput (key, val) {
    this.props.dispatch(requestPasswordResetFormUpdate(this.getEndpoint(), key, val));
  }

  handleSubmit (event) {
    event.preventDefault();
    let formData = this.props.auth.getIn([
      'requestPasswordReset',
      this.getEndpoint(),
      'form'
    ]).toJS();
    this.props.dispatch(requestPasswordReset(formData, this.getEndpoint()));
  }

  render () {
    let endpoint       = this.getEndpoint();
    let loading        = this.props.auth.getIn(['requestPasswordReset', endpoint, 'loading']);
    let inputDisabled  = this.props.auth.getIn(['user', 'isSignedIn']);
    let submitDisabled = !this.props.auth.getIn([
      'requestPasswordReset',
      endpoint,
      'form',
      'email'
    ]);

    return (
      <form
        className='redux-auth request-password-reset-form clearfix'
        style={{clear: 'both', overflow: 'hidden'}}
        onSubmit={this.handleSubmit.bind(this)}>

        <Input
          type='text'
          floatingLabelText='Email Address'
          floatingLabelStyle={{color: 'black'}}
          className='request_password_reset_email'
          disabled={loading || inputDisabled}
          value={this.props.auth.getIn(['requestPasswordReset', endpoint, 'form', 'email'])}
          errors={this.props.auth.getIn(['requestPasswordReset', endpoint, 'errors', 'email'])}
          onChange={this.handleInput.bind(this, 'email')}
          underlineFocusStyle={{borderColor: 'white'}}
          {...this.props.inputProps.email} />

        <ButtonLoader
          loading={loading}
          type='submit'
          style={{float: 'right', marginTop: 25, textTransform: 'none'}}
          labelColor='black'
          labelStyle={{textTransform: 'none', fontSize: 18, fontWeight: 300}}
          className='cal_white_button'
          disabled={inputDisabled || submitDisabled}
          onClick={this.handleSubmit.bind(this)}
          {...this.props.inputProps.submit}>
          Send
        </ButtonLoader>
      </form>
    );
  }
}

export default connect(({auth}) => ({auth}))(RequestPasswordResetForm);
