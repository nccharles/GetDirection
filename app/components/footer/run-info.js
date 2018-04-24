
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import PropTypes from 'prop-types';

import { styles } from '.';


class RunInfo extends Component {
  constructor(props) {
    super(props);
    this.state = { value: this.props.value }
  }

  formatValue() {
    return this.state.value
  }
  static propTypes = {
    title: PropTypes.string,
    value: PropTypes.string
  }
  render() {
    let value = this.state.value ? this.formatValue() : '-'
    return (
      <View style={[styles.runInfoWrapper, { flex: 1, flexDirection: 'column-reverse' }]}>
        <Text style={styles.runInfoTitle}>{this.props.title.toUpperCase()}</Text>
        <Text style={styles.runInfoValue}>{value}</Text>
      </View>
    );
  }
}

export default RunInfo;
