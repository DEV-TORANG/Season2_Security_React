const express = require('express')               // express 모듈 가져옴
const app = express()                            // express 앱 만들기
const port = 3000                                // 포트 번호 (아무거나)
const bodyParser = require('body-parser')        // 클라 - 서버를 위한 바디파서
const mongoose = require('mongoose')             // MongoDB 연결
const {User} = require('./models/User')          // DB에 저장할 값 모델에서 불러오기
const cookieParser = require('cookie-parser')    // 쿠키 저장을 위한 쿠키파서
app.use(cookieParser());

// 바디파서가 클라 정보를 서버에서 사용 가능하도록 하기 위한 구문
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// 보안을 위한 .env 파일 읽기 위한 구문
// require('dotenv').config();                 // .env 파일 사용을 위함, 없으면 만들기.

// HEROKU 사이트를 대비한 방식, 둘 중 아무거나 써도 상관없음.
const config = require('./config/key')

// DB 연결 구문
mongoose
.connect(config.mongoURI)
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

app.post('/login',(req,res) => {
	// 요청된 이메일을 데이터베이스에 있는지 찾기
	User.findOne({email: req.body.email}, (err, user) => {
			// User를 찾지 못한다면,
			if(!user) {
					return res.json({
					loginSuccess: false,  // 로그인 거부
					message: "동일한 이메일로 가입된 유저가 없습니다."
					})
			}
			// User를 찾은 경우, 비밀번호가 맞는지 확인
			user.comparePassword(req.body.password, (err, isMatch) => {
					// 비밀번호가 다르다면,
					if(!isMatch)
							return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})

					// 토큰 생성하기
					user.generateToken((err, user) => {
							//jsonwebtoken 활용
							if(err) return res.status(400).send(err);

							// 쿠키에 x_auth 라는 이름으로 저장.
							// 이후에 Access 및 Refresh 토큰 두가지로 수정해야하는 부분.
							res.cookie("x_auth", user.token)
							.status(200)
							.json({ loginSuccess: true, userId: user._id })
					})
			})
	})
})

// 3000번에서 앱 실행
app.listen(port, () => {                    
  console.log(`Example app listening on port ${port}`)
})