// Seed
// 每一颗种子都是我们一点一滴的积累
// 最后它们会变为果实

// 纪录我们的点滴吧！

import React, { useState, createContext } from 'react'
import cx from 'classnames'

import Dialog from '#/Dialog'
import './style.less'

const Seed = () => {
  const [ visible, setVisible ] = useState(false)

  const holdingSeed = () => {
    setVisible(true)
  }
  
  return (
    <div className='seed'>
      <div className='drips'>
        <nav>筛选框</nav>
        {
          // list
        }
      </div>
      <div className='add-seed' onClick={holdingSeed}>
        <i className='iconfont icon-hand-holding-seedling' />
        <i className={cx('iconfont icon-hand-holding-seedling','rise-icon', visible ? 'rise-animation' : '')} />
      </div>
      <Dialog visible={visible} type='seed' />
    </div>
  )
}

export default Seed