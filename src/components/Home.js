import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';

function Home() {

    const [data,setData]=useState({});
    const [load,setLoad]=useState(true);

    useEffect(
        ()=> {
            setLoad(true);
            axios.get("/api")
            .then((resp)=>{
                setData(resp.data);
                setLoad(false);
            })
            .catch((err)=>{
                console.log(err);
                setLoad(false);
            });
        },
        []
    );

    return(
        <Fragment>
            <br></br>
            {
                load?
                <div className="spinner-border mb-3 mx-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>:
                <h1>{data.message}</h1>
            }
        </Fragment>
    );

}

export default Home;