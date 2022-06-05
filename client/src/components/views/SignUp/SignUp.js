import React, { useState } from 'react'
import './SignUp.css';
import osLogo from '../../images/osLogo.png';

import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineKey } from "react-icons/hi";
import { HiLockClosed } from "react-icons/hi";
import { HiOutlineStar } from "react-icons/hi";
import { HiMail } from "react-icons/hi";
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';

import Modal from 'react-modal';
import {Route, Link} from 'react-router-dom';

//TODO
// 아이콘 정렬, 모달 창 두가지로 뜨게 하는 방법 찾기

function SignUp(){ 

	const dispatch = useDispatch();

  const [userid,setuserid] = useState("");
  const [password,setpassword] = useState("");
  const [passwordcheck,setpasswordcheck] = useState("");
  const [username ,setusername] = useState("");
  const [usermail,setusermail] = useState("");
  
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [pass, setPass] = useState(false);


  const onUseridHandler = (event) =>{
    setuserid(event.currentTarget.value)
  }
  const onUserpasswordHandler = (event) =>{
    setpassword(event.currentTarget.value)
  }
  const onUserpasswordcheckHandler = (event) =>{
    setpasswordcheck(event.currentTarget.value)
  }
  const onUsernameHandler = (event) =>{
    setusername(event.currentTarget.value)
  }
  const onUsermailHandler = (event) =>{
    setusermail(event.currentTarget.value)
  }
	const onSubmit = () =>{
		if(password != passwordcheck){
			return console.log('비밀번호 확인이 일치하지 않습니다.');
		}

		let body ={
			userid: userid,
			password: password,
			email: usermail,
			name: username,
			username: username
		};

		// Action Dispatch 구문
		dispatch(registerUser(body)).then((response) =>{
			if(response.payload.success){
				props.history.push('/');
			}
			else{
				console.log('회원가입에 실패했습니다.');
			}
		})
	}

  return (
    <div className = "App">
       
        <img className = "logo" src = {osLogo} alt = 'osLogo'/> 

      <div className = "App-header">

        <div className = "text">
         <br/>
         <div style={{color : '#898989', fontSize : '15px'}}> 회원 정보 입력</div>
          
        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
           <HiOutlineUser size = "40" color = "#898989"/>
          </div>
          <input name="userid" type="text" placeholder='아이디' value={userid} onChange={onUseridHandler} className="input-box"  size = "20" />
        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
             <HiOutlineKey size = "40" color = "#898989" />
          </div> 
          <input name="password" type="text" placeholder="비밀번호" value={password} onChange={onUserpasswordHandler } className="input-box" size = "20" />
        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
             <HiLockClosed size = "40" color = "#898989"/>
         </div>   
         <input name="passwordcheck" type="text" placeholder="비밀번호 확인" value={passwordcheck} onChange={onUserpasswordcheckHandler} className="input-box" size = "20" />
        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
             <HiOutlineStar size = "40" color = "#898989" />
          </div>
          <input name="username" type="text" placeholder="닉네임" value={username} onChange={onUsernameHandler} className="input-box" size = "20" />
        </div>
        <br/>

        <div className="data-box">
          <div className="small-box">
             <HiMail size = "40" color = "#898989" />
          </div>
          <input name="usermail" type="text" placeholder="이메일" value={usermail} onChange={onUsermailHandler} className="input-box" size = "20" />
        </div>
        <br/>
				
				<div><button type='submit' onClick={onSubmit} className="loginregister__button"> 회원가입 </button></div>
				<br/><br/>
        
       	
      
     </div>
    </div>
  );
}

export default SignUp;