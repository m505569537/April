import React, { useEffect } from 'react'

import './style.less'

interface Props {
  scrollUp: boolean;  // 滚动方向
  loadFn: any;  // 到底/顶时候触发的方法
  distance: number;   // 距离底/顶部的距离时就触发加载函数
  children: any;
}

const ScrollToLoadMore = (props: Props) => {

  const { scrollUp, loadFn, distance, children } = props

  const handleScroll = (e) => {
    console.log('e',e)
  }
  
  return (
    <div className='scroll-to-load-more' onScroll={handleScroll}>
      { children }
    </div>
  )
}

export default ScrollToLoadMore