import Api from './Api'

export default {
  upload(formData) {
    return Api().post('table-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}