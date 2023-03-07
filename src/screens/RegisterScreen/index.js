import React, { Component } from 'react';






import { connect } from 'react-redux';
import styles from './styles';
import {
  Text, View, TouchableOpacity, Alert,
  ActivityIndicator, TextInput
} from 'react-native';
import { register } from '../../actions';

class Register extends Component {
  constructor(props) {
    super(props);
    this.confirmation = null;
    this.unsubscribe = null;
    this.state = {
      fullName: '',
      phone: '',
      password: '',
      rePassword: '',
      userId: null,
    };
  }
  static get
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.top}>

        </View>
        <View style={styles.body}>

          <View style={styles.formLogin}>
            <View style={styles.coverTile}>
              <Text style={styles.loginText}>Register</Text>
              <Text style={styles.loginTextUnder}>Create an new account</Text>
            </View>
            <View style={styles.coverInput}>

              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="gray"
                onChangeText={value => this.handleInput('fullName', value)}
              />

              <TextInput
                style={styles.input}
                placeholderTextColor="gray"
                placeholder="Phone"
                onChangeText={value => this.handleInput('phone', value)}
              />

              <TextInput
                style={styles.input}
                placeholderTextColor="gray"
                secureTextEntry={true}
                placeholder="Password"
                onChangeText={value => this.handleInput('password', value)}
              />
              <TextInput
                style={styles.input}
                secureTextEntry={true}
                placeholderTextColor="gray"
                placeholder="Comfirm Password"
                onChangeText={value => this.handleInput('rePassword', value)}
              />
            </View>
            <View style={styles.coverButton}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.handleRegister();
                }}
              >
                <Text
                  style={styles.text_Button}>
                  Register
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
        <View style={styles.footer}>
          <Text style={styles.textFooter}>
            Have a account ?{' '}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              this.props.navigation.navigate('Login');
            }}
          >
            <Text style={styles.textRegister}>Login now</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  validatePhone = phone => {
    var re = /^\d{10}$/;
    return re.test(phone);
  };
  handleRegister = async () => {
    // if (this.validate() === true) {
    const params = {
      fullName: this.state.fullName,
      username: this.state.phone,
      password: this.state.password
    };
    console.log(params, 'param gui kle');
    this.props.onRegister(params);
    // }
  }

  confirmPhone = async (phone) => {

  }

  handleInput = (name, value) => {
    this.setState({
      [name]: value
    });
    console.log('state: ', this.state);
  }
}

mapStateToProps = (state) => ({
  auth: state.authReducer ? state.authReducer : null
});


mapDispathToProps = (dispatch) => {
  return {
    onRegister: (params) => dispatch(register(params))
  };
};

export default connect(mapStateToProps, mapDispathToProps)(Register);