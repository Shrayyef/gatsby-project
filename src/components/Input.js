import React, { Component } from 'react'

class Input extends Component {
  render() {
    return (
      <div className="input-wrapper">
        {this.props.label && (
          <label className="label">{this.props.label}</label>
        )}
        <input
          type="text"
          placeholder={this.props.placeholder}
          value={this.props.value}
          onChange={this.props.onChange}
          onClick={this.props.onClick}
          className={['form-input', this.props.className].join(' ')}
        />
      </div>
    )
  }
}

export default Input
