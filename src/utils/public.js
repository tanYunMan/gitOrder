
import axios from 'axios'
import api from './request'
import { setToken } from '@/utils/auth'
// axios.defaults.withCredentials=true;

const utils = {
  data() {
    return {
      PageSizes: [10, 20, 30, 40],
      PageSize: 10,
      ClassInfo: [
        { label: '产品', value: 1 },
        { label: '资讯', value: 2 },
        { label: '人才', value: 3 },
        { label: '资本', value: 4 },
        { label: '技术', value: 5 },
        { label: '渠道', value: 6 }
      ]
    }
  },
  methods: {
    // 重启后
    AppStart() {
      this.$store.commit('reset')
    },

    /** 设置全局状态或对象
         *
         * @param  key 设置键值
         * @param  value
         */
    Set(key, value) {
      this.$store.commit('cache', {
        key,
        value
      })
    },

    // 读出 key
    Read(key) {
      var value = this.$store.getters.read(key)
      if (value) {
        return value.data
      } else {
        return null
      }
    },

    /**
         * 时间日期格式化
         * @param format
         * @returns {*}
         */
    DateFormat(dateObj, format) {
      const date = {
        'M+': dateObj.getMonth() + 1,
        'd+': dateObj.getDate(),
        'h+': dateObj.getHours(),
        'm+': dateObj.getMinutes(),
        's+': dateObj.getSeconds(),
        'q+': Math.floor((dateObj.getMonth() + 3) / 3),
        'S+': dateObj.getMilliseconds()
      }
      if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length))
      }
      for (const k in date) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1
            ? date[k] : ('00' + date[k]).substr(('' + date[k]).length))
        }
      }
      return format
    },

    /**
         * axios GET请求
         * @param url 请求链接
         * @param params 请求参数
         * @param success 成功回调
         * @param err 失败回调
         */
    GET(url, params, success, err) {
      url = process.env.VUE_APP_BASE_API + url
      var _this = this
      params = params || {}
      axios.get(
        url,
        {
          params: params,
          headers: {
            'x-auth-token': _this.Read('token')
          }
        }
      ).then(function(response) {
        if (response.data&&response.data.code == 1001) {
          success(response.data)
        } else if (response.data&&response.data.code == 101) {
          _this.$router.push({ path: '/' })
        } else {
          _this.$message.error(response.data.msg)
          if (err) {
            err()
          }
        }
      })
    },

    /**
         * axios POST请求
         * @param url 请求链接
         * @param params 请求参数
         * @param success 成功回调
         * @param err 失败回调
         */
    POST(url, params, success, err, isLogin) {
      url = process.env.VUE_APP_BASE_API + url
      const _this = this
      const obj = new FormData()
      for (const key in params) {
        obj.append(key, params[key])
      }
      axios.post(
        url,
        obj,
        {
          headers: {
            'x-auth-token': _this.Read('token')
          }
        }
      ).then(function(response) {
        if (isLogin) {
          _this.Set('token', response.headers['x-auth-token'])
          setToken(response.headers['x-auth-token'])
        }
        if (response.data.code == 1001) {
          success(response.data)
        } else if (response.data.code == 101) {
          _this.$router.push({ path: '/' })
        } else {
          _this.$message.error(response.data.msg)
          if (err) {
            err()
          }
        }
      })
    },

    /**
         * axios POST请求(带拦截器)
         * @param url 请求链接
         * @param params 请求参数
         * @param success 成功回调
         * @param err 失败回调
         */

    _POST(url, params, success, err) {
      api({
        url: url,
        method: 'post',
        data: params
      }).then(res => {
        if (res.code = 1001) {
          success(res)
        } else {
          if (err) {
            err(res)
          }
        }
      }).catch((error) => {
        if (err) {
          err(error)
        }
      })
    },

    /**
         * axios PUT
         * @param url 请求链接
         * @param params 请求参数
         * @param success 成功回调
         * @param err 失败回调
         */
    PUT(url, params, success, err) {
      url = process.env.VUE_APP_BASE_API + url
      var _this = this
      params = params || {}
      // let obj = new FormData();
      // for(let key in params){
      //     obj.append(key,params[key])
      // }
      axios.put(
        url,
        params,
        {
          headers: {
            // 'token':_this.Read('token')
          }
        }
      ).then(function(response) {
        if (response.data.code == 0) {
          success(response.data)
        } else if (response.data.code == 101) {
          _this.$router.push({ path: '/' })
        } else {
          _this.$message.error(response.data.message)
          if (err) {
            err()
          }
        }
      }).catch(function(error) {
        console.log(error)
      })
    },
    /**
         * axios DELETE
         * @param url 请求链接
         * @param params 请求参数
         * @param success 成功回调
         * @param err 失败回调
         */
    DELETE(url, params, success, err) {
      url = process.env.VUE_APP_BASE_API + url
      var _this = this
      params = params || {}
      axios.delete(
        url,
        {
          params: params,
          headers: {
            // 'token':_this.Read('token')
          }
        }
      ).then(function(response) {
        if (response.data.code == 0) {
          success(response.data)
        } else if (response.data.code == 101) {
          _this.$router.push({ path: '/' })
        } else {
          _this.$message.error(response.data.message)
          if (err) {
            err()
          }
        }
      }).catch(function(error) {
        console.log(error)
      })
    },

    // 必传验证
    // obj  验证对象
    // keyStr 排除对象key 如 'name,age,sex'
    // err  有为空的情况
    // ok  全部都已必填
    ObjRequired(obj, keyStr, err, ok) {
      var flag = false
      console.log(obj)
      for (var key in obj) {
        if (keyStr.indexOf(key) == -1) {
          if (typeof (obj[key]) === 'string') {
            obj[key] = obj[key].trim()
          }
          if (!obj[key] && obj[key] !== 0 && obj[key] !== false) {
            console.log(key)
            flag = true
          }
        }
      }
      if (flag) {
        if (err) {
          err()
        }
      } else {
        if (ok) {
          ok()
        }
      }
    },

    // 对象所有key值用,拼接
    // obj  拼接对象对象
    ObjKeyJoin(obj) {
      var keystr = ''
      for (var key in obj) {
        keystr += key + ','
      }
      return keystr
    },

    /**
         * 文件导入
         * @param e 上传文件
         * @param url 路径
         * @param formData
         */
    ImportFile(e, url, success, err) {
      var _this = this
      url = process.env.VUE_APP_BASE_API + url
      const file = e.target.files[0]
      const param = new FormData()
      param.append('file', file)
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
      axios.post(url, param, config)
        .then(res => {
          if (res.data.code === 0) {
            success()
            _this.$message({
              message: '数据导入成功！',
              type: 'success'
            })
          } else {
            _this.$message.error(res.data.message)
            if (err) {
              err()
            }
          }
        })
    }
  }
}

export default utils
