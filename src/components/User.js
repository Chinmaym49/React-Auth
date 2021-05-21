import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';

function User(props) {

    const [user,setUser]=useState({handle:"",id:"",skills:[]});
    const [load,setLoad]=useState(true);
    const [err,setErr]=useState("");

    useEffect(
        ()=> {

            async function refresh() {
                const data={
                    "token":localStorage.getItem("token")
                }
                await axios.post("/api/refresh",data)
                .then((resp)=>{
                    localStorage.setItem("token",resp.data["token"]);
                    props.setTokenHandler(resp.data["token"]);
                })
                .catch((err)=>(console.log(err.response.data.message)));
                foo();
            }

            async function foo() {
                const config={
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem("token")}`
                    }
                }
                setLoad(true);
                await axios.get("/api/user",config)
                .then((resp)=> {
                    setUser(resp.data);
                    setLoad(false);
                })
                .catch((e)=>{
                    const err=e.response.data;
                    console.log(err);
                    if(err.error==="ExpiredAccessError") {
                        refresh();
                    } else {
                        setErr(err.message);
                    }
                    setLoad(false);
                });
            }
            foo();
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
                !localStorage.getItem("token")?
                <h1>Login to view your profile</h1>:
                err?
                <h1 className="text-danger">{err}</h1>:
                <Fragment>
                    <ul className="list-group list-group-flush mx-3">
                        <li className="list-group-item"><strong>Handle</strong> - {user.handle}</li>
                        <li className="list-group-item"><strong>ID</strong> - {user.id}</li>
                        <li className="list-group-item">
                            <strong>Skills</strong> - 
                            <ul className="list-group">
                            {
                                user.skills.map((skill)=>(<li key={skill} className="list-group-item">{skill}</li>))
                            }
                            </ul>
                        </li>
                        <li className="list-group-item"></li>
                    </ul>
                </Fragment>
            }
        </Fragment>
    );

}

export default User;