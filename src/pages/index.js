import React, { Component } from 'react'
import { connect } from 'react-redux'
import { KEY } from '../constants'
import Header from '../components/header'
import Input from '../components/Input'
import { SortableContainer, SortableElement } from 'react-sortable-hoc'
import arrayMove from 'array-move'
import Card from '../components/Card'
import Loading from '../components/Loading'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEnvelope, faKey, faEdit } from '@fortawesome/free-solid-svg-icons'
import Modal from '../components/Modal'
import Helmet from 'react-helmet'
import _ from 'lodash'

library.add(faEnvelope, faKey, faEdit)

class IndexPage extends Component {
  state = {
    channel: {},
    videos: [],
    channelId: '',
    loading: false,
    error: '',
  }

  async componentDidMount() {
    const channelId = localStorage.getItem('channelId')
    const videos = localStorage.getItem('videos')
    if (channelId) {
      this.setState({ channelId, videos: JSON.parse(videos) })
    }
  }

  getData = async () => {
    const { channelId } = this.state
    this.setState({ loading: true, videos: [], error: '' })
    try {
      const json = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${KEY}`
      )
      const res = await json.json()
      this.setState({ channel: res })
      if (res.items.length) {
        localStorage.setItem('channelId', channelId)
        res.items.map(async item => {
          let videos = []
          try {
            let vidsJson = await fetch(
              `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${
                item.contentDetails.relatedPlaylists.uploads
              }&key=${KEY}`
            )
            let data = await vidsJson.json()
            data.items.forEach(vid => {
              vid.note = ''
              videos.push(vid)
            })
            this.setState({ videos: [...this.state.videos, ...videos] }, () =>
              console.log(this.state)
            )
            localStorage.setItem('videos', JSON.stringify(this.state.videos))
          } catch (err) {
            console.log(err)
            this.setState({ loading: false, error: 'error connecting' })
          }
        })
        this.setState({ loading: false })
      } else {
        this.setState({ loading: false, error: 'enter a valid channel id' })
      }
    } catch (err) {
      console.log(err)
      this.setState({ loading: false, error: 'error connecting' })
    }
  }

  search = async () => {
    const { channelId } = this.state
    if (channelId) this.getData()
  }

  refresh = async () => {
    const { channelId, videos } = this.state
    this.setState({ loading: true, videos: [], error: '' })
    try {
      const json = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${KEY}`
      )
      const res = await json.json()
      this.setState({ channel: res })
      if (res.items.length) {
        res.items.map(async item => {
          let vids = []
          try {
            let vidsJson = await fetch(
              `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${
                item.contentDetails.relatedPlaylists.uploads
              }&key=${KEY}`
            )
            let data = await vidsJson.json()
            data.items.forEach(vid => {
              const gd = _.find(videos, ['id', vid.id])
              const newGd = Object.assign({}, vid, gd)
              const vidIndex = videos.indexOf(newGd)
              if (vidIndex !== -1) {
                videos[vidIndex] = newGd
              }
            })
          } catch (err) {
            console.log(err)
            this.setState({ loading: false, error: 'error connecting' })
          }
        })
        this.setState({ loading: false, videos })
        localStorage.setItem('videos', JSON.stringify(videos))
      } else {
        this.setState({ loading: false, error: 'enter a valid channel id' })
      }
    } catch (err) {
      console.log(err)
      this.setState({ loading: false, error: 'error connecting' })
    }
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(
      ({ videos }) => ({
        videos: arrayMove(videos, oldIndex, newIndex),
      }),
      () => {
        localStorage.setItem('videos', JSON.stringify(this.state.videos))
      }
    )
  }

  updateVideos = (index, note) => {
    const { videos } = this.state
    videos[index].note = note
    // this.setState({ videos })
    localStorage.setItem('videos', JSON.stringify(this.state.videos))
  }

  renderVids = () => {
    const { videos } = this.state
    const SortableVideo = SortableElement(({ video, index }) => (
      <Card onNoteChange={this.updateVideos} video={video} index={index} />
    ))

    const SortableVideosContainer = SortableContainer(({ items }) => {
      return (
        <div className="row wrap cards-row">
          {videos.map((video, index) => (
            <SortableVideo key={`item-${index}`} index={index} video={video} />
          ))}
        </div>
      )
    })

    return (
      <SortableVideosContainer
        pressDelay={100}
        items={videos}
        onSortEnd={this.onSortEnd}
        axis={'xy'}
      />
    )
    // return this.state.videos.map((vid, index) => {
    //   return <Card video={vid} key={index} />
    // })
  }

  render() {
    return (
      <div>
        <Helmet title={'Youtube Channel page'}>
          <html lang="en" />
        </Helmet>
        <Header siteTitle="Youtube Channel Videos" />
        <form onSubmit={this.search}>
          <div className="col">
            <Input
              placeholder={'enter your channel id'}
              className={'main'}
              label={'youtube channel'}
              onChange={e => this.setState({ channelId: e.target.value })}
              value={this.state.channelId}
            />
            {this.state.loading ? (
              <Loading />
            ) : (
              <div className="row center">
                <button className="btn" type="submit" onClick={this.search}>
                  search
                </button>
                {!!this.state.videos.length && (
                  <button className="btn" onClick={this.refresh}>
                    refresh
                  </button>
                )}
              </div>
            )}
          </div>
        </form>
        {!!this.state.error && <p className="error">{this.state.error}</p>}
        {this.renderVids()}
        <Modal />
      </div>
    )
  }
}

const mapStateToProps = ({ count }) => {
  return {}
}

const mapDispatchToProps = dispatch => {
  return {}
}

const ConnectedCounter = connect(
  mapStateToProps,
  mapDispatchToProps
)(IndexPage)

export default ConnectedCounter
