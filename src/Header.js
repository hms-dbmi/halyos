import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Link } from 'react-router-dom';


class Header extends Component {

  constructor(props){
    super(props); 

  }

  render() {
    return (
      <header>
          <nav>
          <ul>
         <li><Link to='/'>Home</Link></li>
         <li><Link to='/measure/test'>Measurements</Link></li>
         <li><Link to='/risk'>Risk Scores</Link></li>
       </ul>
     </nav>
   </header>
    );
  }
}

export default Header;
