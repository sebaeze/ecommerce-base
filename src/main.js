import React    from "react";
import ReactDOM from "react-dom";
import Header   from "./componentes/Header";
import Footer   from "./componentes/Footer";
//
const App = () =>{
  return (
    <div id="divWrapperPAgina" className="container-fluid">
      <Header />
      <section id="body" className="wrapper-body bg-light">
        <div className="container-fluid">
          <div className="row wp-body">
            <span className="font-roboto-mono align-middle span-en-construccion" id="About">En Construcción</span>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
};
//
ReactDOM.render(
  <App className="container-fluid" />,
  document.getElementById("app")
);