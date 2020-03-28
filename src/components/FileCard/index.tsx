import React, { useEffect } from 'react'
import { message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

import { deleteFile } from '&/api'
import { getTrueName } from '../../utils'
import './style.less'

interface Props {
  type: string;
  url: string;
  className: string;
  updateData: any;
}

const FileCard = (props: Props) => {
  let vde
  const { type, className, url, updateData } = props

  const handleDelete = () => {
    const params = {
      url
    }
    deleteFile(params).then(res => {
      if (res.errcode === 0) {
        message.success(res.message)
        updateData()
      } else {
        message.error(res.message)
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

  const toggleVde = (e) => {
    e.stopPropagation()
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
          <video src={url} ref={video => vde = video}>浏览器不支持video标签</video>
          <div className='cover'>
            <div className="play" style={{ backgroundImage: `url('http://localhost:4000/static/play.png')` }} onClick={toggleVde}></div>
            <a href={url} download={getTrueName(url)} />
          </div>
        </div>
      )
    } else {
      return (
        <div className='file-box'></div>
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