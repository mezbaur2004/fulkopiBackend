import React from 'react';
import NavBar from "./NavBar.jsx";
import Footer from "./Footer.jsx";

const MasterLayout = (props) => {
    return (
        <div>
            <NavBar></NavBar>
            {props.children}
            <Footer></Footer>
        </div>
    );
};

export default MasterLayout;