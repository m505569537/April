import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { Input, Button } from 'antd'

import ImageSelect from '../ImageSelect'
import './style.less'

const { TextArea } = Input

interface Props {
  visible: boolean;
  type: string;
  onClose: any;
}

const styleObj = {
  'seed': {
    cn: 'icon-seedling',
    color: '#4daf0f',
    bgcolor: '#52d052',
    label: 'Seed'
  }
}

const Dialog = (props: Props) => {

  const [ imgs, setImgs ] = useState({})
  const [ showImgs, setShowImgs ] = useState(false)
  const imgsMaxNum = 5  // 限制图片数量

  const [ vdes, setVdes ] = useState<any>({})
  const [ showVdes, setShowVdes ] = useState(false)
  const vdesMaxNum = 3  // 限制视频数量

  const { visible, type, onClose } = props

  const toggleImgs = () => {
    setShowImgs(true)
  }

  const addImgs = (img: object, idx: string|number) => {
    const tmpImg = { ...imgs }
    if (idx != '-1') {
      // 修改要上传的图片
      tmpImg[idx] = img
    } else {
      // 添加要上传的图片
      const idxArr = Object.keys(imgs)
      let tmpIdx = idxArr.length > 0 ? (parseInt(idxArr[idxArr.length - 1]) + 1) : 0
      tmpImg[tmpIdx] = img
    }
    
    console.log('imgss', tmpImg)
    setImgs(tmpImg)
  }

  const deleteImg = (idx: string|number) => {
    const tmpImgs = { ...imgs }
    delete tmpImgs[idx]
    if (Object.keys(tmpImgs).length == 0) {
      setShowImgs(false)
    }
    setImgs(tmpImgs)
  }
  
  return (
    <div className='dialog-cover' style={{ display: visible ? 'flex' : 'none' }}>
      <div className='dialog'>
        <div className='over-icon' style={{ backgroundColor: styleObj[type].bgcolor }}>
          <i className={cx('iconfont', styleObj[type].cn)} style={{ color: styleObj[type].color }} />
          <p>{ styleObj[type].label }</p>
        </div>
        <i className='iconfont icon-close' onClick={onClose} />
        <div className='overflow-box'>
          <div className='form-input'>
            <Input placeholder='请输入标题' prefix={<i className='iconfont icon-title' />} />
            <hr />
            <TextArea placeholder='请输入内容' autoSize={{ minRows: 5, maxRows: 12 }} />
            <div className='tags'>
              <div className={cx('img-tag', showImgs ? 'img-tag-active' : '')} onClick={!showImgs ? toggleImgs : null}>
                <i className='iconfont icon-image' />
                <span>图片</span>
              </div>
              <div className={cx('video-tag', Object.keys(vdes).length > 0 ? 'video-tag-active' : '')}>
                <i className='iconfont icon-Video' />
                <span>视频</span>
              </div>
            </div>
            <div className='media-box'>
              { showImgs && <ImageSelect maxNum={imgsMaxNum} imgs={imgs} addImgs={addImgs} deleteImg={deleteImg} /> }
              <div className='video-box'>
              </div>
            </div>
          </div>
          <div className='place-holder'>
            <Button type='primary' className='sticky-btn'>Submit</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dialog