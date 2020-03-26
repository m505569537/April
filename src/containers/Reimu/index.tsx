// 一只博丽灵梦
import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { PlusCircleOutlined, DownCircleOutlined } from '@ant-design/icons'

import ScrollToLoadMore from '#/ScrollToLoadMore'
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
    key: 'img'
  },
  {
    label: 'Video',
    icon: 'icon-Video',
    key: 'video'
  },
  {
    label: 'File',
    icon: 'icon-9wenjianchuanshu-1',
    key: 'file'
  }
]

const Reimu = () => {

  const [ cur, setCur ] = useState('')
  const [ dropDown, setDropDown ] = useState(false)

  const toggleTab = (key) => {
    setCur(key)
  }

  const toggleDropDown = () => {
    setDropDown(!dropDown)
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
              list.slice(1).map(item => <p key={item.key}><i className={cx('iconfont', item.icon)} /></p>)
            }
          </div>
        </div>
      </nav>
      <ScrollToLoadMore scrollUp={false} distance={20}>
        <div>hh</div>
      </ScrollToLoadMore>
    </div>
  )
}

export default Reimu