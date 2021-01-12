import axios from "@/interceptor/httpInterceptor"
import path from '@/api/path'


//查询字典表
const GetCodeList = (params) => {
    return axios.post(path.GetCodeList, JSON.stringify(params))
}


export default {
    GetCodeList,
}