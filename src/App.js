//
import {Switch, Route, Redirect} from 'react-router-dom'
import Login from './components/LoginForm'
import Home from './components/Home'
import NotFound from './components/NotFound'
import AllJobs from './components/AllJobsView'
import AboutJob from './components/AboutJob'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

const App = () => (
  <>
    <Switch>
      <Route exact path="/login" component={Login} />
      <ProtectedRoute exact path="/" component={Home} />
      <ProtectedRoute exact path="/Jobs" component={AllJobs} />
      <ProtectedRoute exact path="/Jobs/:id" component={AboutJob} />
      <ProtectedRoute exact path="/not-found" component={NotFound} />
      <Redirect to="/not-found" />
    </Switch>
  </>
)

export default App
