import React, {useEffect, useState} from 'react';
import MasterLayout from "../components/shared/MasterLayout.jsx";
import axios from "axios";

const HomePage = () => {

    const[Data,SetData]=useState(null)
    useEffect(() => {
        (async ()=>{
            let res=await axios.get("/api/CreateInvoice")
            SetData(res.data)
        })()
    }, []);

    return (
        <div>
            <MasterLayout>
                <h1>Home Page Content</h1>
                {
                    Data!==null &&(
                        <ul>
                            <li>{Data['total']}</li>
                            <li>{Data['vat']}</li>
                            <li>{Data['payable']}</li>
                        </ul>
                    )
                }
            </MasterLayout>
        </div>
    );
};

export default HomePage;