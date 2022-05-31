import React, { useEffect } from 'react';
import axios from 'axios';

//landingpage들어오자마자 실행
function LandingPage() {
  useEffect(() => {
    //get request를 서버에 보내는 것
    axios.get('/api/hello') //엔드 포인트
    //서버에서 보내오는 것을 콘솔창 출력
    .then(response => console.log(response.data)) 
  }, [])
  return <div>
    LandingPage
  </div>;
}
export default LandingPage;