// 一只博丽灵梦
import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { message } from 'antd'
import { PlusCircleOutlined, DownCircleOutlined } from '@ant-design/icons'

import NoDataCard from '#/NoDataCard'
import ScrollToLoadMore from '#/ScrollToLoadMore'
import FileCard from '#/FileCard'
import { getCookies } from '../../utils'
import { uploadFiles, getPlatform } from '&/api'
import './style.less'

const list = [
  {
    label: 'All',
    icon: 'icon-suoyouzhaobiaoxiangmu',
    key: 'all'
  },
  {
    label: 'Img',
    icon: 'icon-image',
    key: 'img',
    ref: 'imgRef'
  },
  {
    label: 'Video',
    icon: 'icon-Video',
    key: 'video',
    ref: 'videoRef'
  },
  {
    label: 'File',
    icon: 'icon-9wenjianchuanshu-1',
    key: 'file',
    ref: 'fileRef'
  }
]

const Reimu = () => {

  const [ data, setData ] = useState([])
  const [ cur, setCur ] = useState('')
  const [ dropDown, setDropDown ] = useState(false)

  const toggleTab = (key) => {
    if (cur != key) {
      setCur(key)
    }
    const params = {
      type: key
    }
    getPlatform(params).then(res => {
      if (res.errcode === 0) {
        setData(res.data)
      }
    })
  }

  const toggleDropDown = () => {
    setDropDown(!dropDown)
  }

  const uploadFn = (e, key) => {
    const files = Object.values(e.target.files)
    const imgSuffix = /\.(jpg|png|jpeg|gif)$/
    const vdeSuffix = /\.(avi|rmvb|flv|mp4|wmv|mkv)$/
    let params = new FormData()
    params.append('type', key)
    files.forEach((file:any) => {
      if (key=='img' && imgSuffix.test(file.name)) {
        params.append('files', file)
      } else if (key == 'video' && vdeSuffix.test(file.name)) {
        params.append('files', file)
      } else if (key == 'file') {
        params.append('files', file)
      }
    })
    e.target.value = ''
    uploadFiles(params).then(res => {
      if (res.errcode === 0) {
        message.success(res.message)
        toggleTab(cur)
        params = null
      } else {
        message.error(res.message)
      }
    })
  }

  useEffect(() => {
    toggleTab('all')
  }, [])
  
  return (
    <div className='reimu'>
      <nav>
        筛选：
        <ul className='navbar'>
          {
            list.map(item => <li key={item.key} className={cur == item.key ? 'active' : ''} onClick={() => toggleTab(item.key)}>
              <i className={cx('iconfont', item.icon)} />
              <span>{ item.label }</span>
            </li>)
          }
        </ul>
        <div className='add-collection'>
          { !dropDown ? <PlusCircleOutlined onClick={toggleDropDown} /> : <DownCircleOutlined style={{ color: 'red' }} onClick={toggleDropDown} /> }
          <div className={cx('drop-down-box', dropDown ? 'active' : '')}>
            {
              list.slice(1).map(item => <p key={item.key} >
                <input type='file' id={item.key} multiple style={{ display: 'none' }} onChange={(e) => uploadFn(e, item.key)} />
                <label htmlFor={item.key}>
                  <i className={cx('iconfont', item.icon)} />
                </label>
              </p>)
            }
          </div>
        </div>
      </nav>
      <ScrollToLoadMore scrollUp={false} distance={20}>
        <div className='files-box'>
          {
            data.length > 0 ? data.map(item => <FileCard key={item.url} type={item.type} url={item.url} updateData={() => toggleTab(cur)} />) : <NoDataCard />
          }
        </div>
      </ScrollToLoadMore>
    </div>
  )
}

export default Reimu