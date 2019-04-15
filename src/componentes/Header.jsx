/*
*   Header para todas las paginas
*/
import 'bootstrap/dist/css/bootstrap.min.css'   ;
import 'font-awesome/css/font-awesome.min.css'  ;
import '../css/wp-main.css'   ;
import $                    from 'jquery'       ;
import Popper               from 'popper.js'    ;
import 'bootstrap/dist/js/bootstrap.bundle.min' ;
import React, { Component } from 'react'        ;
//

class Header extends Component {
  constructor(props) {
    super(props);
    this.stilo1 = {
      backgroundColor: '#e3f2fd'
    }
  }
  render() {
    return (
        <section id="header" className="navbar navbar-expand-md navbar-light navbar-static-top"  style={this.stilo1}>
          <div className="container-fluid">
              <div className="row-fluid">
                <div className="span12">
                  <span className="navbar-brand font-roboto-mono wp-nombre " href="/">Sebastian Andreoletti</span>
                  <div className="span6">
                    <span className="wp-professional-description">Developer, It Specialist</span>
                  </div>
                  <div className="span3">
                    <div className="container-fluid wp-pestanias">
                      <ul className="nav nav-tabs float-right">
                        <li className="nav-item"><a className="nav-link"  href="#Contacto">Contacto</a></li>
                        <li className="nav-item"><a className="nav-link"         href="#About">Acerca de mí</a></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row-fluid">
              </div>
          </div>
        </section>
    )
  }
}
/* */
export default Header;
/* */