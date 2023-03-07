import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import { login } from '../actions';
import ListProduct from './ListProduct';

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.count.number !== prevState.number) {
      return { number: nextProps.count.number };
    } else return null;
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <Text style={{ textAlign: 'center', fontSize: 35 }} >{this.state.number}</Text>
            <TouchableOpacity
              onPress={() => {
                this.props.onAdd({
                  value: 3
                });
              }}
            >
              <Text style={{ textAlign: 'center' }} >Add</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.props.onSub({
                  value: 2
                });
              }}
            >
              <Text style={{ textAlign: 'center' }} >Sub</Text>
            </TouchableOpacity>
            <ListProduct />
          </View>
        </KeyboardAvoidingView>

      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => {
  return {
    onLogin: (params) => dispatch(login(params)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);