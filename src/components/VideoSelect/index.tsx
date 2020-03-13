import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import './style.less'
import { message } from 'antd'

interface Props {
  vdes: object;
  maxNum: number;
  addVdes: any;
}

interface IProps {
  vde: any;
  idx: string|number;
  addVdes: any;
}

const VideoPreview = (props: IProps) => {
  let inputRef
  const [ path, setPath ] = useState<any>('')
  const [ loading, setLoading ] = useState(false)

  const { vde, idx, addVdes } = props

  useEffect(() => {
    if (vde && window.URL) {
      // setLoading(true)
      const url = window.URL.createObjectURL(vde)
      setPath(url)
      console.log(url)
    }
  }, [])

  const getFile = () => {
    const file = inputRef.files[0]
    if (!file) {
      message.error('请选择文件')
      return
    }
    const suffix = /\.(avi|rmvb|flv|mp4|wmv|mkv)$/
    if (!suffix.test(file.name)) {
      message.error('请选择视频文件')
      return
    } else {
      addVdes(file, idx)
    }
  }
  
  return (
    <div className='video-preview'>
      <Spin className='video-load' spinning={loading}>
        <div className='video-select'>
          <input id={"upload_video" + idx} type='file' ref={input => inputRef = input} onChange={getFile} />
          <label htmlFor={path ? '' : 'upload_video' + idx}>
            <PlusOutlined style={{ fontSize: '40px', color: '#999999' }} />
            { path && <video src={path} controls />}
            { path &&  <i className='iconfont icon-delete1' /> }
          </label>
        </div>
      </Spin>
    </div>
  )
}

const VideoSelect = (props: Props) => {
  const { vdes, maxNum, addVdes } = props

  const vdeIdxs = Object.keys(vdes)
  if (vdeIdxs.length < maxNum) {
    vdeIdxs.push('-1')
  }

  return (
    <div className='video-select-box'>
      {
        vdeIdxs.map(item => <VideoPreview key={item} vde={vdes[item] || null} idx={item} addVdes={addVdes} />)
      }
    </div>
  )
}

export default VideoSelect