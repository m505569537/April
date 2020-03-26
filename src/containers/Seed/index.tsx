// Seed
// 每一颗种子都是我们一点一滴的积累
// 最后它们会变为果实

// 纪录我们的点滴吧！

import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { message } from 'antd'

import Dialog from '#/Dialog'
import Card from '#/Card'
import NoDataCard from '#/NoDataCard'
import { addSeed, getSeeds } from '&/api'
import { getCookies } from '../../utils'
import './style.less'

const Seed = () => {
  const [ visible, setVisible ] = useState(false)
  const [ loading, setLoading ] = useState(false)

  const [ data, setData ] = useState([])

  const holdingSeed = () => {
    setVisible(true)
  }

  const handleClose = () => {
    setVisible(false)
  }

  const getSeedsList = async () => {
    const token = await getCookies('token')
    const params = {
      token
    }
    getSeeds(params).then(res => {
      if (res.errcode === 0) {
        setData(res.data)
      } else {
        message.error(res.message)
      }
    })
  }

  const handleSubmit = (params) => {
    setLoading(true)
    let sign = false
    let timer = setTimeout(() => {
      if (sign) {
        setVisible(false)
        setLoading(false)
      }
    }, 500)
    addSeed(params).then(res => {
      if (res.errcode === 0) {
        if (Number(timer) < 500) {
          sign = true
        } else {
          clearTimeout(timer)
          message.success('添加成功')
          setVisible(false)
          setLoading(false)
        }
        getSeedsList()
      } else {
        clearTimeout(timer)
        setLoading(false)
        message.error(res.message)
      }
    })
  }

  useEffect(() => {
    getSeedsList()
  }, [])
  
  return (
    <div className='seed'>
      <nav>筛选框</nav>
      <div className='drips'>
        <div style={{ width: '70%' }}>
          {
            data && data.length > 0 ? data.map(item => <Card key={item._id} detail={item} getSeedsList={getSeedsList} />) : <NoDataCard />
          }
        </div>
      </div>
      <div className='add-seed' onClick={holdingSeed}>
        <i className='iconfont icon-hand-holding-seedling' />
        <i className={cx('iconfont icon-hand-holding-seedling','rise-icon', visible ? 'rise-animation' : '')} />
      </div>
      { visible && <Dialog visible={visible} loading={loading} type='seed' onClose={handleClose} onSubmit={handleSubmit} /> }
    </div>
  )
}

export default Seed