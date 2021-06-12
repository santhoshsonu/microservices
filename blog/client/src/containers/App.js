import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

// import config from "../config/config";
import Layout from '../components/Layout/Layout';

import './App.css';

import Blog from './Blog/Blog';
import AddPost from "./Blog/AddPost/AddPost";

import Error from "../components/UI/Error/Error";

const APP_TITLE = 'Blog App';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Layout title={APP_TITLE}>
          <Switch>
            {/* Blog routes */}
            <Route exact path='/' component={Blog} />
            <Route exact path='/post' component={AddPost} />

            <Route component={Error} />
          </Switch>
        </Layout>
      </BrowserRouter>
    );
  }
}

export default App;
