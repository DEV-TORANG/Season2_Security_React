const express = require('express')       // express 모듈 가져옴
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {User} = require("./models/User")
const config = require('./config/key')
const app = express()                    // express 앱 만들기
const port = 3000                        // 포트 번호 (아무거나)

app.use(cookieParser());

// body-parser가 클라이언트에서 오는 정보를 서버에서 분석해서 가져올 수 있게 하는 것
// application/x-www-form-urlencoded 이렇게 된 데이터를 분석해서 가져올 수 있게 해주는 것
app.use(bodyParser.urlencoded({extended: true})); 
//application/json으로 된 데이터를 가져올 수 있게 하는 기능
app.use(bodyParser.json());

// DB 연결 및 확인
mongoose.connect(config.mongoURI)
.then(() => console.log('== MongoDB Connected =='))
.catch(err => console.log(err))

// 회원가입을 위한 라우팅
app.post('/register', (req, res) => {
    // 회원가입 할 때 필요한 정보들 client에서 가져오면 
    //해당 데이터를 데이터베이스에 넣어준다.
    const user = new User(req.body) // req.body안에는 정보 들어있음(id, pw) *bodyparser 가져왔기 때문에 가능
    user.save((err,userInfo) => { // mongoDB 메소드, save해주면 Usermodel에 저장됨
        if(err) return res.json({success:false, err})
        return res.status(200).json ({sucess: true }) //status200은 성공했음을 의미
    })
})

// 로그인을 위한 라우팅
app.post('/login',(req,res) => {
    // 요청된 이메일을 데이터베이스에 있는지 찾기
    User.findOne({email: req.body.email}, (err, user) => {
      if(!user) {
        return res.json({
          loginSuccess: false,
          message: "제공된 이메일에 해당하는 유저가 없습니다."
        })
      }
      // 요청한 이메일이 데이터베이스에 있다면 비밀번호 맞는지 확인
      user.comparePassword(req.body.password, (err, isMatch) => {
        if(!isMatch)
          return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."})
        // 토큰 생성하기
        user.generateToken((err, user) => {
          //jsonwebtoken 활용
          if(err) return res.status(400).send(err);
          // 토큰을 저장한다. 어디에? -> 여러곳 가능 [쿠키, 세션, 로컬스토리지]
          // 어디가 가장 안전한지는 사람마다 다름, 로컬, 쿠키 등등
          // 여기서는 쿠키 -> 라이브러리 다운로드 필요 (express에서 제공하는 cookie paraser)
          res.cookie("x_auth", user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id })
        })
      })
    })
  })

// 인증 라우팅
const {auth} = require("./middleware/auth")
app.get('/api/users/auth', auth, (req, res) => {  // 미들웨어 (엔드포인트에 req받기 전에 중간에서 별도로 해주는 것)
  // 여기까지 왔다는 얘기는 Authentication이 true라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, // 0이면 일반유저
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image:req.user.image
  })
})

// 로그아웃 라우팅
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id},
    { token: ""},
    (err, user) => {
      if(err) return res.json({success: false, err});
      return res.status(200).send({
        success: true
      })
    })
})


app.get('/', (req, res) => {             // 루트 디렉토리 오면 hello~ 출력
  res.send('Hello World!')
})

app.listen(port, () => {                 // 3000번에서 앱 실행
  console.log(`Example app listening on port ${port}`)
})