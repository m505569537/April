import React, { useEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Layout from '#/Layout'
import LoginAndRegister from '@/LoginAndRegister'

const Router = () => {

  return (
    <Switch>
      <Route path='/home' component={Layout} />
      <Route path='/loginandregister' component={LoginAndRegister} />
      <Redirect to='/home' />
    </Switch>
  )
}

export default Router