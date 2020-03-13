declare function require(string): string

import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

// 在ts中引入图片好像又那么点问题， 可以看下webpack中file-loader的options
import LeftImg from '%/images/left.png'
import RightImg from '%/images/right.png'
import './style.less'


// func 1.添加图片，当添加了一张图片后，图片tag不可点击，下方的图片选择框
// 后面会多出来一个图片添加框
// 2.可以删除图片
// 3.可以一次选择多个图片

interface Props {
  maxNum: number;
  imgs: object;
  addImgs: any;
  deleteImg: any;
}

interface IProps {
  idx: string;
  img: any;
  addImgs: any;
  deleteImg: any;
}

const ImageSelectThumbnail = (props: IProps) => {
  let inputRef:any
  const [ path, setPath ] = useState<any>('')
  const { idx, img, addImgs, deleteImg } = props

  useEffect(() => {
    if (img && window.URL) {
      // let reader = new FileReader()
      // reader.readAsDataURL(img)
      // reader.onload = (e) => {
      //   setPath(e.target.result)
      // }
      const url = URL.createObjectURL(img)
      setPath(url)
    }
  }, [])

  const getFile = () => {
    const file = inputRef.files[0]
    if (!file) {
      message.error('请重新上传文件')
      return
    }
    const suffix = /\.(jpg|png|jpeg|gif)$/g
    if (!suffix.test(file.name)) {
      message.error('请选择图片文件')
      inputRef.value = ''
    } else {
      addImgs(file, idx)
    }
  }
  
  return (
    <div className='img-select-thumbnail'>
      <div className='image-select'>
        <input id={"upload_img" + idx} type='file' ref={input => inputRef = input} onChange={getFile} />
        <label htmlFor={"upload_img" + idx}>
          <PlusOutlined style={{ fontSize: '40px', color: '#999999' }} />
          { path && <div style={{ backgroundImage: `url(${path})` }} /> }
          { path &&  <i className='iconfont icon-delete1' onClick={() => deleteImg(idx)} /> }
        </label>
        { path && <p>{  img && img.name || '' }</p> }
      </div>
    </div>
  )
}

const ImageSelect = (props: Props) => {
  const { maxNum, imgs, addImgs, deleteImg } = props

  const imgIdxs = Object.keys(imgs)
  if (imgIdxs.length < maxNum) {
    imgIdxs.push('-1')
  }
  
  return (
    <div className='img-select-box'>
      <img src={LeftImg} style={{ position: 'absolute', left: '-1px', top: '-1px' }} />
      {
        imgIdxs.map(item => <ImageSelectThumbnail key={item} idx={item} img={imgs[item] || null} addImgs={addImgs} deleteImg={deleteImg} /> )
      }
      <img src={RightImg} style={{ position: 'absolute', right: '-1px', bottom: '-1px' }} />
    </div>
  )
}

export default ImageSelect