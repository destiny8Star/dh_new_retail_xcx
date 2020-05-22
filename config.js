
let configObj = {
	RequestUrl: '',
}

if(process.env.NODE_ENV === 'development'){
    // 开发环境
    // configObj.RequestUrl = 'http://192.168.1.92:6001/'
	// configObj.RequestUrl = 'http://192.168.1.125:6001/'
	configObj.RequestUrl = 'http://192.168.1.118:6001/'
}else{
    // 生产环境
    configObj.RequestUrl = 'https://s.huishihuo.com/'
}




export default configObj