import React, { Fragment, useState } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';

function Login(props) {

    const [handle,setHandle]=useState("");
    const [pwd,setPwd]=useState("");
    const [load,setLoad]=useState(false);
    const [err,setErr]=useState("");

    const formSubmit=async(e)=> {
        e.preventDefault();
        setLoad(true);
        const data={
            "handle":handle,
            "password":pwd
        }
        
        await axios.post("/api/login",data)
        .then((resp=> {
            localStorage.setItem("token",resp.data["token"]);
            props.setTokenHandler(resp.data["token"]);
            setLoad(false);
        }))
        .catch((err)=> {
            setHandle("");
            setPwd("");
            const msg=err.response.data.message;
            setErr(msg);
            setLoad(false);
        });
    }

    return(
        localStorage.getItem("token")?
        <Redirect to="/user"></Redirect>:
        <Fragment>
            <br></br>
            <svg xmlns="http://www.w3.org/2000/svg" style={{display:"none"}}>
                <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </symbol>
            </svg>
            {
                load?
                <div className="spinner-border mb-3 mx-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>:
                <Fragment>
                    {
                        err 
                        &&
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlinkHref="#exclamation-triangle-fill"/></svg>
                            {err}
                            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>
                    }
                    <form className="mx-3" onSubmit={(e)=>(formSubmit(e))}>
                        <div className="mb-3">
                            <label htmlFor="handle" className="form-label">Handle</label>
                            <input value={handle} onChange={(e)=>(setHandle(e.target.value))} type="text" className="form-control" id="handle"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input value={pwd} onChange={(e)=>(setPwd(e.target.value))} type="password" className="form-control" id="password"/>
                        </div>
                        <center><button type="submit" className="btn btn-outline-primary">Submit</button></center>
                    </form>
                </Fragment>
            }
        </Fragment>
    );

}

export default Login;