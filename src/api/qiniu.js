import qiniu from 'qiniu';

// 创建各种上传凭证之前，我们需要定义好其中鉴权对象mac
var accessKey = 'lU_TJpTI_LksBDJRVzr8YHxSMfJ-jOAifh5Xfu4v';
var secretKey = 'kn98KjTOlCnRKpkX4GTZeW_v-Fx_qqY_TMyTwkNv';
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);

// 最简单的上传凭证只需要AccessKey，SecretKey和Bucket
//自定义凭证有效期（示例2小时，expires单位为秒，为上传凭证的有效时间）
var options= {
  bucket: 'university',
  expire: 7200
};
var putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

const token = 'lU_TJpTI_LksBDJRVzr8YHxSMfJ-jOAifh5Xfu4v:1JYTaKV_C3XCsgBzm3wO0njKNiI=:eyJzY29wZSI6InVuaXZlcnNpdHkiLCJkZWFkbGluZSI6MTUyNzI1NzMwMX0='

export default uploadToken;