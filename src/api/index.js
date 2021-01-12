import axios from "@/interceptor/httpInterceptor"
import path from './path'

import common from './common' // 通用字典查询接口


// 登录
const getLoginInfo = (params) => {
  return axios.post(path.getLoginInfo, params)
}
// 密码
const UserLoginInfo = {
  query: (params) => axios.post(path.UserLoginInfo.query, params),
  save: (params) => axios.post(path.UserLoginInfo.save, params)
}
// 用户主体
const QueryHrsscLoginInfo = (params) => axios.post(path.HrsscLoginInfo.query, params)

const SaveTenantInfo =  (params) => axios.post(path.SaveTenantInfo, params)
// 用户注册接口
const QueryThemeInfoByType =  (params) => axios.post(path.QueryThemeInfoByType, params)
//游戏开始结束时间
const QueryThemeTypeInfoByCode =  (params) => axios.post(path.QueryThemeTypeInfoByCode, params)
//剩余福金数
const QueryLastRecordByUserId =  (params) => axios.post(path.QueryLastRecordByUserId, params)
//我的福金
const QueryRecordFlowWaterInfo =  (params) => axios.post(path.QueryRecordFlowWaterInfo, params)
//字典表
const GetCodeList={
  Blessing: (params) => axios.post(path.GetCodeList.Blessing, params),//五福
  BusinessCulture: (params) => axios.post(path.GetCodeList.BusinessCulture, params)//企业文化
}
// 发福袋
const SaveBag =  (params) => axios.post(path.SaveBag, params)

// 发消息
const SaveMsgInfo = (params) => axios.post(path.SaveMsgInfo, params)

// 拆福袋
const OpenLuckyBag = (params) => axios.post(path.OpenLuckyBag.query, params)

export default {
  getLoginInfo,
  UserLoginInfo,

  common,

  QueryHrsscLoginInfo,
  SaveTenantInfo,
  GetCodeList,
  SaveBag,
  SaveMsgInfo,
  QueryThemeInfoByType,
  QueryThemeTypeInfoByCode,
  QueryLastRecordByUserId,
  OpenLuckyBag,
  QueryRecordFlowWaterInfo
}