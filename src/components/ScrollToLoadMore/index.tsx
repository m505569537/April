import React, { useEffect, useState } from 'react'

import './style.less'

interface Props {
  scrollUp: boolean;  // 滚动方向
  loadFn: any;  // 到底/顶时候触发的方法
  distance: number;   // 距离底/顶部的距离时就触发加载函数
  children: any;
}

let box
let scrollStart = 0
let scrollEnd = 0

const ScrollToLoadMore = (props: Props) => {
  const { scrollUp, loadFn, distance, children } = props

  let dis:number
  if (distance === 0 || distance < 0) {
    dis = 0
  } else {
    if (!distance) {
      dis = 20
    } else {
      if (distance > 100) {
        dis = 100
      } else {
        dis = distance
      }
    }
  }

  const scrollDirection = (end) => {
    scrollEnd = end
    if (scrollEnd >= scrollStart) {
      scrollStart = end
      return 'down'
    } else {
      scrollStart = end
      return 'up'
    }
  }

  const handleScroll = (e) => {
    if (box.scrollHeight === box.clientHeight) {
      return
    }
    let direct = scrollDirection(box.scrollTop)
    if (scrollUp && direct == 'up') {
      if (box.scrollTop <= dis) {
        loadFn()
      }
    } 
    if (!scrollUp && direct == 'down') {
      // console.log(box.scrollTop >= (box.scrollHeight - box.clientHeight - dis), distance)
      if (box.scrollTop >= (box.scrollHeight - box.clientHeight - dis)) {
        loadFn()
      }
    }
  }
  
  return (
    <div className='scroll-to-load-more' ref={div => box = div} onScroll={handleScroll}>
      { children }
    </div>
  )
}

export default ScrollToLoadMore