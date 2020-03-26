import React, { useState, useEffect } from 'react'
import { Spin, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { getTrueName } from '../../utils'
import { uploadVde } from '&/api'
import './style.less'

interface Props {
  vdes: object;
  maxNum: number;
  addVdes: any;
  deleteVde: any;
}

interface IProps {
  vde: any;
  idx: string|number;
  addVdes: any;
  deleteVde: any;
}

const VideoPreview = (props: IProps) => {
  let inputRef
  const { vde, idx, addVdes, deleteVde } = props

  const [ loading, setLoading ] = useState(false)


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
      let params = new FormData()
      params.append('vde', file)
      uploadVde(params).then(res => {
        if (res.errcode === 0) {
          inputRef.value = ''
          addVdes(res.vde_url, idx)
        }
      })
    }
  }
  
  return (
    <div className='video-preview'>
      <Spin className='video-load' spinning={loading}>
        <div className='video-select'>
          <input id={"upload_video" + idx} type='file' ref={input => inputRef = input} onChange={getFile} />
          <label htmlFor={vde ? '' : 'upload_video' + idx}>
            { !vde && <PlusOutlined style={{ fontSize: '40px', color: '#999999', position:'absolute', }} /> }
            { vde && <video src={vde} controls />}
            { vde && deleteVde && <i className='iconfont icon-delete1' onClick={() => deleteVde(idx)} /> }
          </label>
          { vde && <p>{ vde && getTrueName(vde) }</p> }
        </div>
      </Spin>
    </div>
  )
}

const VideoSelect = (props: Props) => {
  const { vdes, maxNum, addVdes, deleteVde } = props

  const vdeIdxs = Object.keys(vdes)
  if (vdeIdxs.length < maxNum) {
    vdeIdxs.push('-1')
  }

  return (
    <div className='video-select-box'>
      {
        vdeIdxs.map(item => <VideoPreview key={item} vde={vdes[item] || null} idx={item} addVdes={addVdes} deleteVde={deleteVde} />)
      }
    </div>
  )
}

export default VideoSelect