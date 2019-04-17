import React, { Component } from 'react'
import { connect } from 'react-redux'

class Modal extends Component {
  render() {
    if (this.props.modal)
      return (
        <div
          className="overlay"
          onClick={e => {
            if (e.target.className === 'overlay') this.props.close()
          }}
        >
          <div className="modal-content">
            <iframe
              title={this.props.video.snippet.title}
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${
                this.props.video.snippet.resourceId.videoId
              }`}
              frameBorder="0"
            />
          </div>
        </div>
      )
    return null
  }
}

const mapStateToProps = ({ modal, video }) => {
  return {
    modal,
    video,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    close: () => dispatch({ type: `CLOSE_VIDEO` }),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Modal)
