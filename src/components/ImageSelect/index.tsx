import React, { useEffect, useState } from 'react'
import { message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import './style.less'

// func 1.添加图片，当添加了一张图片后，图片tag不可点击，下方的图片选择框
// 后面会多出来一个图片添加框
// 2.可以删除图片
// 3.可以一次选择多个图片

interface Props {
  maxNum: number;
  imgs: object;
  addImgs: any;
}

interface IProps {
  idx: string;
  img: any;
  addImgs: any;
}

const ImageSelectThumbnail = (props: IProps) => {
  let inputRef:any
  const [ path, setPath ] = useState<any>('')
  const { idx, img, addImgs } = props

  useEffect(() => {
    if (img && window.FileReader) {
      let reader = new FileReader()
      reader.readAsDataURL(img)
      reader.onload = (e) => {
        setPath(e.target.result)
      }
    }
  }, [])

  const getFile = () => {
    const file = inputRef.files[0]
    if (!file) {
      message.error('请重新上传文件')
      return
    }
    const suffix = /\.(jpg|png|jpeg|gif)$/g
    if (!suffix.test(file.name.toLowerCase())) {
      message.error('请选择图片文件')
      inputRef.value = ''
    } else {
      addImgs(file)
    }
  }
  
  return (
    <div className='img-select-thumbnail'>
      <div className='image-select'>
        <input id={"upload" + idx} type='file' style={{ display: 'none' }} ref={input => inputRef = input} onChange={getFile} />
        <label htmlFor={"upload" + idx}>
          <PlusOutlined style={{ fontSize: '40px', color: '#999999' }} />
          { path && <div style={{ backgroundImage: `url(${path})` }} /> }
        </label>
        <p>{  img && img.name || '' }</p>
      </div>
    </div>
  )
}

const ImageSelect = (props: Props) => {
  const { maxNum, imgs, addImgs } = props

  const imgIdxs = Object.keys(imgs)
  if (imgIdxs.length < maxNum) {
    imgIdxs.push('-1')
  }
  
  return (
    <div className='img-select-box'>
      {
        imgIdxs.map(item => <ImageSelectThumbnail key={item} idx={item} img={imgs[item] || null} addImgs={addImgs} /> )
      }
    </div>
  )
}

export default ImageSelect