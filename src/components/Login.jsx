import React, { useState, useEffect } from "react";
import { useNavigate, useParams,Link } from "react-router-dom";
import { Box, CardMedia } from "@mui/material";

import { Videos, ChannelCard } from ".";
import { loginAPI, loginAsyncKeyAPI, loginFacebookAPI } from "../utils/fetchFromAPI";
import { toast } from "react-toastify";
import ReactFacebookLogin from "react-facebook-login";

const Login = () => {
  const [channelDetail, setChannelDetail] = useState();
  const [videos, setVideos] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {

  }, []);

  return <div className="p-5 " style={{ minHeight: "100vh" }}>
    <div className=" d-flex justify-content-center">
      <form className="row g-3 text-white">
        <div className="col-md-12">
          <label htmlFor="inputEmail4" className="form-label">Email</label>
          <input type="email" className="form-control" id="email" />
        </div>

        <div className="col-md-12">
          <label htmlFor="inputEmail4" className="form-label">Password</label>
          <input className="form-control" id="pass" />
        </div>
        <div className="col-md-12">
          <label htmlFor="inputEmail4" className="form-label">Code</label>
          <input className="form-control" id="code" />
        </div>
        <div className="col-12">
          <button type="button" className="btn btn-primary" 
          onClick={()=>{
            let email = document.getElementById("email").value;
            let pass_word=document.getElementById("pass").value;
            let code =document.getElementById("code").value;
            loginAsyncKeyAPI({email,pass_word,code}).
            then((result)=>{
              console.log("get result api login: ",result);
              
              //result gồm message và data ( access token)
              //Tạo pop up thông báo login thành công
                toast.success(result.message);
               //Lưu access token trong local storage của browser 
                localStorage.setItem("LOGIN_USER",result.data);
                //chuyển hướng sang trang chủ sau khi login thành công
                navigate("/");
            })
            .catch((error)=>{
              console.log("error from api login");
              toast.error(error.response.data.message)
            })            
          }}
          >Login</button>
       <Link
            className="text-primary"
            to="/forgot-pass"
          >
            Forgot password
          </Link>
         <ReactFacebookLogin
         appId="789591303057524"
         fields="name,email,picture"
          callback={(response)=>{
            console.log(response);
            let {id,email,name}=response;
            loginFacebookAPI({id,email,name})
            .then((result)=>{
              toast.success(result.message);
              localStorage.setItem("LOGIN_USER",result.data);
              navigate("/");
            })
            .catch((error)=>{
              toast.error(error.response.data.message);
            })
          }}
         />
        </div>
      </form>
    </div>
  </div>
};

export default Login;
