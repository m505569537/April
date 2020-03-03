import React from 'react'
import cx from 'classnames'

import './style.less'

interface Props {
  visible: boolean;
  type: string;
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

  const { visible, type } = props
  
  return (
    <div className='dialog-cover' style={{ visibility: visible ? 'visible' : 'hidden' }}>
      <div className='dialog'>
        <div className='over-icon' style={{ backgroundColor: styleObj[type].bgcolor }}>
          <i className={cx('iconfont', styleObj[type].cn)} style={{ color: styleObj[type].color }} />
          <p>{ styleObj[type].label }</p>
        </div>
        <i className='iconfont icon-close' />
        <div className='form-input'></div>
      </div>
    </div>
  )
}

export default Dialog