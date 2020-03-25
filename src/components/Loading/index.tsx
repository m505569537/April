import React from 'react'

import './style.less'

interface Props {
  loading: boolean;
}

const Loading = (props: Props) => {
  const { loading } = props
  return (
    <div className='loading-box' style={{ display: loading ? 'block' : 'none' }}>
      <div className='line-list'>
        <div className='line-0' />
        <div className='line-1' />
        <div className='line-2' />
        <div className='line-3' />
        <div className='line-4' />
      </div>
    </div>
  )
}

export default Loading