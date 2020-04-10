import React, { useEffect } from 'react'
import { message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

import { deleteFile, getFileStream } from '&/api'
import { getTrueName } from '../../utils'
import './style.less'

interface Props {
  type: string;
  url: string;
  className: string;
  updateData: any;
}

const baseurl = 'http://localhost:4000'
// const baseurl = 'http://149.129.92.92:4000'

let playRange = 0
let sourceBuffer
let length = 0
let fragmentLength = 0
let queue = []
let vde

const FileCard = (props: Props) => {
  const { type, className, url, updateData } = props

  const handleDelete = () => {
    const params = {
      url
    }
    deleteFile(params).then(res => {
      if (res.errcode === 0) {
        message.success(res.message, 1)
        updateData()
      } else {
        message.error(res.message, 1)
      }
    })
  }

  const toFullScreen = (dom) => {
    if(dom.requestFullscreen){
      dom.requestFullscreen()
    }else if(vde.webkitRequestFullScreen){
      dom.webkitRequestFullScreen()
    }else if(vde.mozRequestFullScreen){
      dom.mozRequestFullScreen()
    }else{
      dom.msRequestFullscreen()
    }
  }

  const initPlayer = () => {
    const mediaSource = new MediaSource()
    vde.src = window.URL.createObjectURL(mediaSource)
    mediaSource.addEventListener('sourceopen', mediaSourceOpen, false)
  }

  function mediaSourceOpen (e) {
    console.log(playRange, length)
    if (playRange == length && playRange != 0) {
      return
    }
    // console.log(this.readyState)
    const mime = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
    // const mime = 'video/webm;codecs="vp8,vorbis"'
    const mediaSource = this
    sourceBuffer = mediaSource.addSourceBuffer(mime)
    getStreamFn(playRange, e)
    // vde.play()
  }

  function getStreamFn  (range, e) {
    const mediaSource = e.target
    const config = {
      headers: {
        'Content-Range': `bytes=${range}-`,
        // 'Accept-Ranges': 'bytes'
      }
    }
    getFileStream(config).then(res => {
      fragmentLength = parseInt(res.headers['content-length'])
      length = res.headers['content-range'].split('/')[1]
      playRange += fragmentLength
      sourceBuffer.addEventListener('update', () => {
        if(!sourceBuffer.updating && queue.length > 0) {// && mediaSource.readyState == "open"
          sourceBuffer.appendBuffer(queue.shift())
          sourceBuffer.removeEventListener("update")
        }
      }, false)

      if (!sourceBuffer.updating) {
        sourceBuffer.appendBuffer(new Uint8Array(res.data))
        console.log(sourceBuffer, Buffer.from(res.data, 'binary'), typeof res.data)
        // mediaSource.endOfStream()
        vde.play()
      } else {
        queue.push(new Uint8Array(res.data))
      }

      if (playRange < length - 1) {
        getStreamFn(playRange, e)
      } else {
        sourceBuffer.addEventListener('updateend', () => {
          mediaSource.endOfStream()
        })
      }
    })
  }

  const toggleVde = (e) => {
    e.stopPropagation()
    // initPlayer()
    toFullScreen(vde)
    return
  }

  useEffect(() => {
    if (type == 'video') {
      document.addEventListener('fullscreenchange', (e) => {
        if (document.fullscreen) {
          vde.play()
        } else {
          vde.pause()
        }
      })
    }
  }, [])

  const renderCard = () => {
    if (type == 'img') {
      return (
        <div className='img-card'>
          <div className='img-card-bg' style={{ backgroundImage: `url(${url})` }} />
          <a href={url} download={getTrueName(url)}><DownloadOutlined /></a>
        </div>
      )
    } else if (type == 'video') {
      return (
        <div className='video-card'>
          <video src={url} ref={video => vde = video} crossOrigin = "Anonymous">浏览器不支持video标签</video>
          <div className='cover'>
            <div className="play" style={{ backgroundImage: `url(${baseurl + '/static/play.png'})` }} onClick={toggleVde}></div>
            <a href={url} download={getTrueName(url)} />
          </div>
        </div>
      )
    } else {
      return (
        <div className='file-box'>
          <div className='file-card-bg img-card-bg' style={{ backgroundImage: `url(${baseurl + '/static/file_icon.png'})`, backgroundSize: 'auto' }} />
          <a href={url} download={getTrueName(url)}><DownloadOutlined /></a>
        </div>
      )
    }
  }

  return (
    <div className='file-card-box'>
      { url && renderCard() }
      <p>
        { getTrueName(url) }
        <i className='iconfont icon-delete1' onClick={handleDelete} />
      </p>
    </div>
  )

}

export default FileCard