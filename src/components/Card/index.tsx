import React from 'react'
import { message } from 'antd'

import { deleteSeed } from '&/api'
import './style.less'


interface Props {
  detail: any;
  getSeedsList: any;
}

const Card = (props: Props) => {
  const { detail, getSeedsList } = props

  const deleteItem = () => {
    deleteSeed({ detail }).then(res => {
      if (res.errcode === 0) {
        message.success(res.message)
        getSeedsList()
      } else {
        message.error(res.message)
      }
    })
  }
  
  return (
    <div className='card-box'>
      <div className='card-header'>
        <div className='title'>
          <p>{ detail.title }</p>
          <div>
            <i className='iconfont icon-delete1' onClick={deleteItem} />
          </div>
        </div>
        <div className='publish-date'>时间：{ detail.publish_date }</div>
      </div>
      <div className='card-content-box'>
        <div className='content'>{ detail.content }</div>
        <div className='imgs'>{ detail.imgs.length > 0 && detail.imgs.map(item => <div key={item} style={{ backgroundImage: `url(${item})` }} />) }</div>
        <div className='vdes'>{ detail.vdes.length > 0 && detail.vdes.map(item => <video key={item} src={item} controls>暂不支持该视频格式</video>) }</div>
      </div>
    </div>
  )
}

export default Card