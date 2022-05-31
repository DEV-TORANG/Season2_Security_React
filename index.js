const express = require('express')          // express 모듈 가져옴
const app = express()                       // express 앱 만들기
const port = 3000                           // 포트 번호 (아무거나)
const bodyParser = require('body-parser')   // 클라 - 서버를 위한 바디파서
const mongoose = require('mongoose')        // MongoDB 연결
const {User} = require('./models/User')

// 바디파서가 클라 정보를 서버에서 사용 가능하도록 하기 위한 구문
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// 보안을 위한 .env 파일 읽기 위한 구문
require('dotenv').config();                 // .env 파일 사용을 위함

// DB 연결 구문
mongoose
.connect(process.env.mongoURI)
.then(() => console.log(" == MongoDB Connected == "))
.catch((err) => console.log(err))

// 루트 디렉토리 오면 Hello World! 출력
app.get('/', (req, res) => {                
  res.send('Hello World!')
})

// Register를 위한 라우트
app.post('/register', (req, res) => {
    // 회원가입할 때 필요한 정보를  client에서 가져온다.
   const user = new User(req.body) // req.body (body-Parser)
   user.save((err, userInfo) => {
       // 에러 검출
       if(err) return res.json({success: false, err})
       // 에러 아닐때
       return res.status(200).json({success: true})
   })
})

// 3000번에서 앱 실행
app.listen(port, () => {                    
  console.log(`Example app listening on port ${port}`)
})