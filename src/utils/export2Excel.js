const { exportJsonToExcel } = require('./vendor/Export2Excel')

const formatJson = (filterVal, jsonData) => {
  return jsonData.map(v => filterVal.map(j => v[j]))
}

const exportToExcel = (headers, props, data, fileName) => {
  data = formatJson(props, data) // 格式化表格数据
  exportJsonToExcel(headers, data, fileName)
}

export { exportToExcel }
