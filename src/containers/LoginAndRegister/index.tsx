import React, { useState } from 'react'
import { Form, Input, Button, Tabs } from 'antd'
import ImageSelect from '@/ImageSelect'

const { TabPane } = Tabs
const FormItem = Form.Item

const LoginAndRegister = () => {

  const [ type, setType ] = useState('login')
  const [ imgs, setImgs ] = useState<any>({})

  const addImgs = (img: object, idx: string|number) => {
    const tmpImg = { ...imgs }
    if (idx != '-1') {
      // 修改要上传的图片
      tmpImg[idx] = img
    } else {
      // 添加要上传的图片
      const idxArr = Object.keys(imgs)
      let tmpIdx = idxArr.length > 0 ? (parseInt(idxArr[idxArr.length - 1]) + 1) : 0
      tmpImg[tmpIdx] = img
    }
    
    setImgs(tmpImg)
  }

  const register = () => (
    <Form>
      <FormItem label='邮箱'>
        <Input />
      </FormItem>
      <FormItem label='用户名'>
        <Input />
      </FormItem>
      <FormItem label='密码'>
        <Input />
      </FormItem>
      <FormItem label='确认密码'>
        <Input />
      </FormItem>
      <FormItem>
        <ImageSelect maxNum={1} imgs={imgs} addImgs={addImgs} />
      </FormItem>
      <FormItem>
        <Button>注册</Button>
      </FormItem>
    </Form>
  )

  const login = () => (
    <div className='login'>
      <Input placeholder='请输入用户名/邮箱' />
      <Input placeholder='请输入密码' />
      <Button>登录</Button>
    </div>
  )
  
  return (
    <div className='login-register'>
      <Tabs activeKey={type} onChange={key => setType(key)}>
        <TabPane tab='login' key='login'>
          { login() }
        </TabPane>
        <TabPane tab='register' key='register'>
          { register() }
        </TabPane>
      </Tabs>
    </div>
  )
}

export default LoginAndRegister