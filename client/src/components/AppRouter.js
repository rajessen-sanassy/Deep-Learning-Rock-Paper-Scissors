import React from 'react'
import {Route, Switch} from 'react-router-dom'

import Home from "./pages/Home"
import Game from "./pages/Game"
import About from "./pages/About"

const AppRouter = (props) => (
    <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/game" component={Game}/>
        <Route path="/about" component={About}/>
    </Switch>
)

export default AppRouter