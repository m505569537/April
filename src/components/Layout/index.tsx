import React, { useState, useEffect } from 'react'
import cx from 'classnames'
import { Switch, Route, withRouter, Redirect } from 'react-router-dom'

// import Cookies from '../../utils/cookies'
import { getCookies, deleteCookie } from '../../utils'
import Seed from '@/Seed'
import Reimu from '@/Reimu'
import { autoLogin } from '&/api'
import './style.less'
import { message } from 'antd'

interface Props {
  history: any
}

const Layout = (props: Props) => {

  const [ route, setRoute ] = useState('/seed')
  const [ user, setUser ] = useState<any>({})

  const list = [
    {
      label: 'Seed',
      icon: 'icon-seedling',
      path: '/seed',
      component: Seed
    },
    {
      label: 'Flower',
      icon: 'icon-flower',
      path: '/flower',
      component: Seed
    },
    {
      label: 'Reimu',
      icon: 'icon-landmark-japan-shrine',
      path: '/reimu',
      component: Reimu
    }
  ]

  const toRoute = (path) => { 
    props.history.push('/home' + path)
    setRoute(path)
  }

  const getToken = async () => {
    const token = await getCookies('token')
    if (!token) {
      props.history.push('/loginandregister')
    } else {
      autoLogin().then(res => {
        if (res.errcode == 0) {
          setUser(res.data)
        } else {
          deleteCookie('token')
          message.error(res.message)
          setTimeout(() => {
            props.history.push('/loginandregister')
          }, 500)
        }
      })
    }
  }

  useEffect(() => {
    getToken()
  }, [])

  return (
    <div className='layout'>
      <div className='left'>
        <div className='user'>
          <div className="avatar" style={{ backgroundImage: `url(${user.avatar})` }}></div>
        </div>
        <div className='list'>
          {
            list.map(item => <div key={item.label} onClick={() => toRoute(item.path)} className={cx(route == item.path ? 'active' : '', route == item.path ? `${item.label.toLowerCase()}-active` : '')}><i className={cx('iconfont', item.icon)} />{ item.label }</div>)
          }
        </div>
      </div>
      <div className="right">
        <Switch>
          {
            list.map(item => <Route key={item.path} path={'/home' + item.path} component={item.component} />)
          }
          <Redirect to='/home/seed' />
        </Switch>
      </div>
    </div>
  )
}

export default withRouter(Layout)