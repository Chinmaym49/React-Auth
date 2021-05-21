import React, { Fragment, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import Login from './components/Login';
import Register from './components/Register';
import User from './components/User';
import Home from './components/Home';
import NotFound from './components/NotFound';
import {BrowserRouter,Switch,Link,Route,Redirect} from 'react-router-dom';

function App() {

  const [token,setToken]=useState(localStorage.getItem("token"));

  const logout=()=> {
    setToken("");
    localStorage.clear();
  }

  return (
    <BrowserRouter>
      <div className="App">

        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">Auth</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="true" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" aria-current="page" to="/user">User</Link>
                </li>
                {
                  !token?
                  <Fragment>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">Login</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/register">Register</Link>
                    </li>
                  </Fragment>:
                  <li className="nav-item">
                    <Link className="nav-link" to="/#" onClick={()=>(logout())}>Logout</Link>
                  </li>
                }
              </ul>
            </div>
          </div>
        </nav>

        <Switch>
          <Route exact path="/" render={()=>(<Home/>)}></Route>
          <Route path="/login" render={()=>(<Login setTokenHandler={setToken}/>)}></Route>
          <Route path="/register" render={()=>(<Register/>)}></Route>
          <Route path="/user" render={()=>(<User setTokenHandler={setToken}/>)}></Route>
          <Route path="/404" render={()=>(<NotFound/>)}></Route>
          <Redirect to="/404"></Redirect>
        </Switch>

      </div>
    </BrowserRouter>
  );
}

export default App;
