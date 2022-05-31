const mongoose = require('mongoose');    // mongoose 연결
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const userSchema = mongoose.Schema( {    // 스키마 세팅
  name:  {
    type: String,  
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,               // 공백 제거
    unique: 1                 // email 중복 안됨
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {                      //가입자(디폴트, 0), 관리자
    type: Number, 
    default: 0
  },
  image: String,
  token: {                     // 토큰 설정 (나중에 유효성 관리 가능)
    type: String
  },
  tokenExp: {                  // 토큰 유효기간
    type: Number
  }
})

userSchema.pre('save', function(next) {
  //비밀번호 암호화
  var user = this;
  if(user.isModified('password')) {  // pw변경시에만 해쉬값 넣도록
    bcrypt.genSalt(saltRounds, function(err, salt) {
      if(err) return next(err) //에러나오면 index로
      bcrypt.hash(user.password, salt, function(err, hash) {
        // Store hash in your password DB.
        if(err) return next(err)
        user.password = hash
        next()  // hash값 저장했으면 index로
      });
    });
  } else {
    next()
  }
})

// 로그인 시, DB에 암호화되어 저장된 패스워드와 비교를 위한 작업.
userSchema.methods.comparePassword = function(plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err) return cb(err),
    cb(null, isMatch)
  })
}

// 토큰 생성 후, 쿠키에 저장하기 위한 작업
userSchema.methods.generateToken = function(cb) {
  var user = this;
  //jsonwebtoken이용해서 token생성
  var token = jwt.sign(user._id.toHexString(), 'secretToken') 
  //user._id + 'secretToken' = token
  //_id는 데이터베이스에 저장된 id값
  // -> 'secretToken' -> user_.id 확인가능
  user.token = token
  user.save(function(err, user) {
    if(err) return cb(err)
    cb(null, user)
  })
}

// 쿠키에 저장된 토큰을 토대로 인증하는 작업
userSchema.statics.findByToken = function(token, cb) {
  var user = this;
  //토큰을 decode
  jwt.verify(token, 'secretToken', function(err, decoded) {
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({"_id": decoded, "token": token}, function (err, user) {
      if (err) return cb(err);
      cb(null, user)
    })
  })    
}

// 로그아웃을 위한 작업, 이후 Access 및 Refresh 토큰 설정 필요.
userSchema.statics.findByToken = function(token, cb) {
  var user = this;
  //토큰을 decode
  jwt.verify(token, 'secretToken', function(err, decoded) {
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({"_id": decoded, "token": token}, function (err, user) {
      if (err) return cb(err);
      cb(null, user)
    })
  })    
}

const User = mongoose.model('User', userSchema)  // 모델로 감싸주고
module.exports = { User }                        // export