const ip = require('@/api/baseUrl')

// paas服务
const prefix = '/api' // 普通接口
const zdbprefix = '/dic' // 字典接口
const wsUrl = `ws://${ip.ws_dic.url}:${ip.ws_dic.port.ws}` // websocket地址

// const nkPrefix = '/niukun' // 牛坤服务的url拦截器前缀
const apiServiceName = '/LuckyBagService8008Service' // 普通接口的服务名
// const dicServiceName = '/DICT8001Service' // 字典接口的服务名
const paasServiceName = '/AppAddrService' // paas接口的服务名
// const Pay8001ServiceName = '/PAY8001Service'  // 薪酬模块接口服务名

const fileServerPreName = `http://117.71.53.199:50021/group1/M00/0A/B` // 文件服务器 前缀

export default {
  wsUrl: wsUrl, // websocket地址
  fileServerPreName: fileServerPreName,
  /** 登录、修改密码 */
  getLoginInfo: zdbprefix + paasServiceName + '/GetLoginResponseDto', // 登录
  UserLoginInfo: {
    query: prefix + apiServiceName + '/QueryUserLoginInfo', // 查询原密码
    save: prefix + apiServiceName + '/SaveUserLoginInfo', // 修改密码
    resName: 'QueryUserLoginInfo' + 'Result'
  },
  HrsscLoginInfo: {
    query: prefix + apiServiceName + '/QueryHrsscLoginInfo', // 查询用户信息
    save: prefix + apiServiceName + '/SaveHrsscLoginInfo', // 保存用户信息
    resName: 'QueryHrsscLoginInfo' + 'Result'
  },
  SaveTenantInfo: prefix + apiServiceName + '/SaveTenantInfo',

  // 字典表
  GetCodeList:{
    Blessing:prefix + apiServiceName + '/QueryBlessingTopic',//五福
    BusinessCulture:prefix + apiServiceName + '/QueryBusinessCultureTopic',//企业文化
  } ,
  // 用户注册接口
  QueryThemeInfoByType: prefix + apiServiceName + '/QueryThemeInfoByType',
  //游戏开始结束时间
  QueryThemeTypeInfoByCode: prefix + apiServiceName + '/QueryThemeTypeInfoByCode',
  //剩余福金数
  QueryLastRecordByUserId: prefix + apiServiceName + '/QueryLastRecordByUserId',
  //我的福金
  QueryRecordFlowWaterInfo: prefix + apiServiceName + '/QueryRecordFlowWaterInfo',
  // 发福袋
  SaveBag: prefix + apiServiceName + '/SaveBag',
  ThemeInfoByType: {
    query: prefix + apiServiceName + '/QueryThemeInfoByType',
    resName: 'QueryThemeInfoByType' + 'Result'
  },
  SaveMsgInfo: prefix + apiServiceName + '/SaveMsgInfo', // 发消息
  OpenLuckyBag: {
    query: prefix + apiServiceName + '/QueryOpenLuckyBag', // 拆福袋
    resName: 'QueryOpenLuckyBag' + 'Result'
  }
}