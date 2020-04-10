// 一只博丽灵梦
import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { message } from 'antd'
import { PlusCircleOutlined, DownCircleOutlined } from '@ant-design/icons'

import NoDataCard from '#/NoDataCard'
import ScrollToLoadMore from '#/ScrollToLoadMore'
import FileCard from '#/FileCard'
import { deleteCookie } from '../../utils'
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

interface Props {
  history: any;
}

const Reimu = (props: Props) => {

  const [ data, setData ] = useState([])  // data.length表示已经获得的数据长度
  const [ cur, setCur ] = useState('')
  const [ page, setPage ] = useState(1) // page + pageSize表示自己想要获得哪一段的数据
  // const [ pager, setPager ] = useState<any>({})
  const [ dropDown, setDropDown ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(false)

  const div = document.querySelector('.add-collection')

  const getData = (params, initData = []) => {
    getPlatform(params).then(res => {
      if (res.errcode === 0) {
        setData(initData.concat(res.data))
        // setPager(res.pager)
        if (res.data.length != 0) {
          setPage(res.pager.curPage)
        }
      } else if (res.errcode == 401) {
        message.error(res.message)
        deleteCookie('token')
        setTimeout(() => {
          props.history.push('/loginandregister')
        }, 1000)
      }
      setIsLoading(false)
    })
  }

  const toggleTab = (key, bool = '') => {
    if (isLoading) {
      if (cur == key) {
        return
      } 
    }
    setIsLoading(true)
    if (cur != key) {
      setCur(key)
      const params = {
        type: key,
        page: 1,
        pageSize: 10,
        curLength: 0
      }
      getData(params)
    } else {
      let params
      if (bool) {
        if (bool == 'add') {
          params = {
            type: key,
            page: data.length % 10 == 0 ? page + 1 : page,
            pageSize: 10,
            curLength: 0
          }
        } else if (bool == 'delet') {
          params = {
            type: key,
            page: page > 1 && data.length % 10 == 1 ? page - 1 : page,
            pageSize: 10,
            curLength: 0
          }
        }
        getData(params)
      } else {
        params = {
          type: key,
          page: page + 1,
          pageSize: 10,
          curLength: data.length
        }
        getData(params, data)
      }
    }
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
        message.success(res.message, 1)
        if (cur == 'all' || cur == key) {
          toggleTab(cur, 'add')
        }
        params = null
      } else {
        message.error(res.message, 1)
      }
    })
  }

  useEffect(() => {
    toggleTab('all')
  }, [])

  useEffect(() => {
    // on只能绑定一次，多次绑定，后面的fn会覆盖前面的fn
    // addEventListener能多次绑定不覆盖
    const fn = (e) => {
      // e.preventDefault()
      if (!dropDown) {
        return
      }
      if (e.target != div) {
        setDropDown(false)
      }
    }
    document.onclick = fn
    // document.removeEventListener('click', fn, false)
    // document.addEventListener('click', fn, false)
  }, [dropDown])
  
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
        <div className='add-collection' onClick={toggleDropDown}>
          { !dropDown ? <PlusCircleOutlined /> : <DownCircleOutlined style={{ color: 'red' }} /> }
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
      <ScrollToLoadMore scrollUp={false} loadFn={() => toggleTab(cur)} distance={20}>
        <div className='files-box'>
          {
            data.length > 0 ? data.map(item => <FileCard key={item.url} type={item.type} url={item.url} updateData={() => toggleTab(cur, 'delet')} />) : <NoDataCard />
          }
        </div>
      </ScrollToLoadMore>
    </div>
  )
}

export default Reimu