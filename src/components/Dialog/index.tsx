import React from 'react'
import cx from 'classnames'
import { Input, Button } from 'antd'

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

  const { visible, type, onClose } = props
  
  return (
    <div className='dialog-cover' style={{ display: visible ? 'flex' : 'none' }}>
      <div className='dialog'>
        <div className='over-icon' style={{ backgroundColor: styleObj[type].bgcolor }}>
          <i className={cx('iconfont', styleObj[type].cn)} style={{ color: styleObj[type].color }} />
          <p>{ styleObj[type].label }</p>
        </div>
        <i className='iconfont icon-close' onClick={onClose} />
        <div className='form-input'>
          <Input placeholder='请输入标题' prefix={<i className='iconfont icon-title' />} />
          <hr />
          <TextArea placeholder='请输入内容' autoSize={{ minRows:5, maxRows: 12 }} />
          <div className='tags'>
            <div className='img-tag'>
              <i className='iconfont icon-image' />
              <span>图片</span>
            </div>
            <div className='video-tag'>
              <i className='iconfont icon-Video' />
              <span>视频</span>
            </div>
          </div>
        </div>
        <div className='place-holder'>
          <Button type='primary' className='sticky-btn'>Submit</Button>
        </div>
      </div>
    </div>
  )
}

export default Dialog