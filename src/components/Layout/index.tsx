import React, { useState } from 'react'
import cx from 'classnames'
import { Switch, Route, withRouter, Redirect } from 'react-router-dom'

import Seed from '@/Seed'
import './style.less'

interface Props {
  history: any
}

const Layout = (props: Props) => {

  const [ route, setRoute ] = useState('/seed')

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
    }
  ]

  const toRoute = (path) => { 
    props.history.push(path)
    setRoute(path)
  }
  
  return (
    <div className='layout'>
      <div className='left'>
        <div className='user'>
          <div className="avatar"></div>
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
            list.map(item => <Route exact key={item.path} path={item.path} component={item.component} />)
          }
          <Redirect to='/seed' />
        </Switch>
      </div>
    </div>
  )
}

export default withRouter(Layout)