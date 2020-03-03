import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter } from 'react-router-dom'

import Layout from '#/Layout'
import './index.less'

ReactDOM.render(<BrowserRouter><Layout /></BrowserRouter>, document.getElementById("root"))
