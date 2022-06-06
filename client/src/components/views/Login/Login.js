import React, {useState} from 'react';
import './Login.css';
import { AiFillLock,AiOutlineUser} from "react-icons/ai";
import {Route, Link} from 'react-router-dom';
import swal from "sweetalert"

import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineKey } from "react-icons/hi";
import { HiLockClosed } from "react-icons/hi";
import { HiOutlineStar } from "react-icons/hi";
import { HiMail } from "react-icons/hi";
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { useNavigate } from 'react-router-dom'

function Login(){
{
  const [userid,setuserid] = useState("");
  const [password,setpassword] = useState("");

  const onUseridHandler = (event) =>{
    setuserid(event.currentTarget.value)
  }
  const onUserpasswordHandler = (event) =>{
    setpassword(event.currentTarget.value)
  }

  const onSubmit = (event) =>{
    event.preventDefault();
		// Action Dispatch 구문
    let body = {
      userid: userid,
      password: password
    }

		dispatch(loginUser(body))
    .then(response =>{
			if(response.payload.loginSuccess){
				console.log('로그인에 성공했습니다.');
        swal("로그인 성공", "환영합니다", "success")
            .then(()=>{
              window.location.replace('/');
            })
			}
			else{
				console.log('로그인에 실패했습니다.');
			}
		})
	}

  return (
    <div className="App">
      <div className="obserSpace">
      <img className='L1'
          src={require('../../images/LogoImage.jpeg')}
      />
      </div>

      <div>
        <div className="layoutId">
          <AiOutlineUser size="40" color='gray' className='IconId'/></div>
        <input name="userid" type="text" value={userid} onChange={onUseridHandler} className="loginId" placeholder="  아이디"></input>
      </div>

      <div>
        <div className="layoutPw">
          <AiFillLock size="40" color="gray" className='IconPw'/></div>
        <input name="password" type="password" value={password} onChange={onUserpasswordHandler} className="loginPw" placeholder='  비밀번호'></input>
      </div>
      
      
      <input type="submit" className="login" value="로그인" onClick = {onSubmit}></input>
      
      <div className="join1">
           <Link className="a" to = "/SignUp" >
             <a className='App-link'>+ 회원가입</a>
          </Link>
        
      </div>
     </div>
  );
};
}
export default Login;
