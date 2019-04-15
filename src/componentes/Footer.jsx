/*
*   Pie de pagina, con detalle para contacto
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
        <section id="footer"  style={this.stilo1}>
            <div className="container" id="Contacto">
                <div className="row force-to-bottom text-center">
                    <ul className="list-inline ml-auto h-100">
                        <li className="list-inline-item h-100"><a href="https://github.com/sebaeze"  target="_blank"><i className="fa fa-github"></i></a></li>
                        <li className="list-inline-item"><a href="https://ar.linkedin.com/in/sebastian-andreoletti-ba0a8728"  target="_blank"><i className="fa fa-linkedin"></i></a></li>
                    </ul>
                </div>
            </div>
        </section>
    )
  }
}

export default Header;