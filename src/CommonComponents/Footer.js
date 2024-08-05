import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/footer.css";
// import Rules from '../Components/Rules'
import logo from "../assets/logo.png";
const Header = () => {
  return (
    <div className="footer_sec">
      <div className="container">
        <div className="footer_text">
          {/* <p>Powered By 
            <span><a className="navbar-brand"
              href="https://intelliatech.com/" 
            target="_blank" rel="noopener noreferrer">
       
            </a> Intelliatech Solutions PVT. Ltd.</span></p> */}
          <p>
            Powered By 
            
            <span>
               <a
                className="navbar-brand"
                href="https://intelliatech.com/" 
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: '8px' }} >
                 Intelliatech Solutions PVT. Ltd.
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
