import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom"
import 'bulma/css/bulma.css'
import 'bulma-divider/dist/css/bulma-divider.min.css'
import './assets/css/general.css'


import HomePage from "./components/components.home"

function App() {
  return (
    <Router>
      <Route path="/" exact component={HomePage}/> 
    </Router>
  );
}

export default App;
