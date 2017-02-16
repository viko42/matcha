import React from 'react';
import './test.css'

export default class App extends React.Component {
  resize() {
    console.log("Resize");
  }
  render(){
    return(
      <div>
        <div id="test">fef</div>
        <div id="test2" onresize={this.resize}></div>
      </div>
    );
  }
}
