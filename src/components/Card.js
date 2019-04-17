import React, { Component } from 'react'
import Input from './Input'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { connect } from 'react-redux'

class Card extends Component {
  state = {
    showNote: false,
    note: '',
  }

  componentDidMount() {
    this.setState({ note: this.props.video.note })
  }

  openVid = e => {
    this.props.selectVideo(this.props.video)
  }

  render() {
    return (
      <div className="card" onClick={this.openVid}>
        <div className="wrapper">
          <div className="card-img">
            <img src={this.props.video.snippet.thumbnails.medium.url} alt="" />
          </div>
          <div className="card-title">
            <p>{this.props.video.snippet.title}</p>
          </div>
          {!this.state.showNote ? (
            <div className="card-note">
              <small>{this.props.video.note}</small>
            </div>
          ) : (
            <div className="card-description">
              <Input
                placeholder={'add note'}
                value={this.state.note}
                onChange={e => {
                  this.setState({ note: e.target.value }, () => {
                    if (typeof this.props.onNoteChange === 'function')
                      this.props.onNoteChange(this.props.index, this.state.note)
                  })
                }}
                onClick={e => {
                  e.stopPropagation()
                }}
              />
            </div>
          )}
          <button
            className="btn outline"
            onClick={e => {
              e.stopPropagation()
              this.setState({ showNote: !this.state.showNote })
            }}
          >
            <FontAwesomeIcon icon="edit" />
          </button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ modal }) => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {
    selectVideo: video => dispatch({ type: `SELECT_VIDEO`, video }),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card)
