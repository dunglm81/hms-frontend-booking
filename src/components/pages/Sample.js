import React, { Component} from 'react';
import api_instance from '../../utils/api';
import queryString from 'query-string';

class Sample extends Component {
  constructor(props){
    super(props);
    this.state = {};

  }
  componentDidMount(){
    let params = queryString.parse(this.props.location.search);
    if(params.param_name){
      this.setState({param_name:params.param_name});
      //display 1
    } else {
      //display 2
    }

  }
  render(){
    return(
      <div></div>
    )
  }
}
export default Sample;
