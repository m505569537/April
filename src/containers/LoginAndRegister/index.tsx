import React, { useState } from 'react'
import { Form, Input, Button, Tabs, message } from 'antd'

import { ImageSelectThumbnail } from '#/ImageSelect'
import { userLogin, userRegister } from '&/api'
import Cookies from '../../utils/cookies'
import './style.less'

interface Props {
  history:any;
}

const { TabPane } = Tabs
const FormItem = Form.Item

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}

const LoginAndRegister = (props: Props) => {

  const [ type, setType ] = useState('login')
  const [ img, setImg ] = useState(null)
  const [ email, setEmail ] = useState('')
  const [ username, setUsername ] = useState('')
  const [ pwd, setPwd ] = useState('')
  const [ pwd2, setPwd2 ] = useState('')

  const [ id, setId ] = useState('')

  const { history } = props

  const toRegister = () => {
    if (!email || !username || !pwd || pwd !== pwd2) {
      message.error('请输入正确的信息')
      return
    }
    if (!img) {
      message.error('请添加头像')
      return
    }
    const params = {
      username,
      email,
      pwd,
      avatar: img
    }
    userRegister(params).then(res => {
      if (res.errcode == 0) {
        history.push('/home')
      } else {
        message.error(res.message)
      }
    })
  }

  const toLogin = () => {
    if (!id || !pwd) {
      message.error('请输入账号/密码')
      return
    }
    const params = {
      id,
      pwd
    }
    userLogin(params).then(async res => {
      if (res.errcode == 0) {
        history.push('/home')
      } else {
        message.error(res.message)
      }
    })
  }

  const addImgs = (img: object, idx: string|number) => {
    setImg(img)
  }

  const handleChange = (key) => { 
    setType(key)
    setPwd('') 
    setId('')
  }

  const register = () => (
    <Form { ...layout }>
      <FormItem label='邮箱'>
        <Input value={email} onChange={e => setEmail(e.target.value)} />
      </FormItem>
      <FormItem label='用户名'>
        <Input value={username} onChange={e => setUsername(e.target.value)} />
      </FormItem>
      <FormItem label='密码'>
        <Input value={pwd} type='password' onChange={e => setPwd(e.target.value)} />
      </FormItem>
      <FormItem label='确认密码'>
        <Input value={pwd2} type='password' onChange={e => setPwd2(e.target.value)} />
      </FormItem>
      <FormItem label='选择头像'>
        <ImageSelectThumbnail  img={img} idx={-2} addImgs={addImgs} />
      </FormItem>
      <FormItem wrapperCol={{ offset: 4 }}>
        <Button onClick={toRegister}>注册</Button>
      </FormItem>
    </Form>
  )

  const login = () => (
    <div className='login'>
      <Input placeholder='请输入用户名/邮箱' value={id} onChange={e => setId(e.target.value)} />
      <Input placeholder='请输入密码' value={pwd} onChange={e => setPwd(e.target.value)} />
      <Button onClick={toLogin}>登录</Button>
    </div>
  )
  
  return (
    <div className='login-register'>
      <Tabs className='login-register-cont' activeKey={type} onChange={handleChange}>
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