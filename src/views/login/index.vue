<template>
<div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" label-position="left" auto-complete="on">

        <div class="title-container">
            <img :src="loginLogo" />
        </div>

        <el-form-item prop="username">
            <el-input ref="username" v-model="loginForm.username" placeholder="用户名" name="username" type="text" auto-complete="on" tabindex="1" />
        </el-form-item>

        <el-form-item prop="password">

            <el-input :key="passwordType" ref="password" v-model="loginForm.password" :type="passwordType" placeholder="密码" name="password" auto-complete="on" tabindex="2" @keyup.enter.native="handleLogin" />

        </el-form-item>
        <el-checkbox v-model="checked" style="margin-bottom: 10px;">记住密码</el-checkbox>
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
        <div class="third">
            <a :href="pageData.qq" target="_blank" ref="nofollow"><span class="qq"></span></a>
            <a :href="pageData.wx" target="_blank" ref="nofollow"><span class="wx"></span></a>
        </div>
    </el-form>
</div>
</template>

<script>
import {
    setTimeout
} from 'timers'

export default {
    name: 'Login',
    metaInfo: {
    meta: [
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes" }
    ],
  },
    data() {
        const validateUsername = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入用户名'))
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            if (!value) {
                callback(new Error('请输入密码'))
            } else {
                callback()
            }
        }
        return {
            loginForm: {
                username: '',
                password: ''
            },
            loginRules: {
                username: [{
                    required: true,
                    trigger: 'blur',
                    validator: validateUsername
                }],
                password: [{
                    required: true,
                    trigger: 'blur',
                    validator: validatePassword
                }]
            },
            loading: false,
            passwordType: 'password',
            redirect: undefined,
            pageData: {
                qq: '',
                wx: ''
            },
            loginLogo: require('@/assets/logo_icon.jpg'),
            checked: false
        }
    },
    mounted() {
        if (localStorage.getItem('user')) {
            this.loginForm.username = localStorage.getItem('user')
            this.loginForm.password = localStorage.getItem('secret')
            this.checked = true
        }
        this.getLoginUrl();
        this.getPicture();
    },
    watch: {
        $route: {
            handler: function (route) {
                this.redirect = route.query && route.query.redirect
            },
            immediate: true
        }
    },
    methods: {
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
            this.$nextTick(() => {
                this.$refs.password.focus()
            })
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    if (this.checked) {
                        localStorage.setItem('user', this.loginForm.username)
                        localStorage.setItem('secret', this.loginForm.password)
                    } else {
                        localStorage.removeItem('user')
                        localStorage.removeItem('secret')
                    }
                    this.loading = true
                    this.POST(
                        '/login/login/login', {
                            login: this.loginForm.username,
                            password: this.loginForm.password
                        },
                        data => {
                            this.Set('name', this.loginForm.username)
                            this.Set('userID', data.body.userID)
                            this.Set('userType', data.body.userType)
                            this.$router.push({
                                path: this.redirect || '/home'
                            })
                            this.loading = false
                        },
                        err => {
                            this.loading = false
                        }, 1
                    )
                } else {
                    return false
                }
            })
        },
        getLoginUrl() {
            this.GET(
                '/user/qqConfig/getLoginUrl', {userType: 2},
                data => {
                    if (data.code === 1001 && data.body) {
                        this.pageData.qq = data.body
                    }
                    this.pageData.wx = ''
                }
            )
        },
        // getPicture() {
        //     this.GET(
        //         '/platform/platformBase/getByDomain', {},
        //         data => {
        //             if (data.code === 1001 && data.body) {
        //                 this.loginLogo = data.body.logo
        //             }
        //         }
        //     )
        // }
    }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #555;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;
    }
}

/* reset element-ui css */
.login-container {
    // .el-input {
    //     display: inline-block;
    //     height: 47px;
    //     width: 85%;

    // input {
    //     background: transparent;
    //     border: 0px;
    //     -webkit-appearance: none;
    //     border-radius: 0px;
    //     padding: 12px 5px 12px 15px;
    //     color: $light_gray;
    //     height: 47px;
    //     caret-color: $cursor;

    //     &:-webkit-autofill {
    //         box-shadow: 0 0 0px 1000px $bg inset !important;
    //         -webkit-text-fill-color: $cursor !important;
    //     }
    // }

    // .el-form-item {
    //     border: 1px solid rgba(255, 255, 255, 0.1);
    //     background: rgba(0, 0, 0, 0.1);
    //     border-radius: 5px;
    //     color: #454545;
    // }
}
</style><style lang="scss" scoped>
// $bg:#2d3a4b;
$bg:#f0f2f5;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
        position: absolute;
        width: 320px;
        max-width: 100%;
        padding: 40px 30px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;

        & .third {
            // margin-top: 20px;
            text-align: center;

            &>a>span {
                width: 48px;
                height: 48px;
                display: inline-block;
                background: center center no-repeat;
                background-size: 100% auto;
            }

            .qq {
                background-image: url('~@/assets/login_qq.png');
                margin-right: 50px;
            }

            .wx {
                background-image: url('~@/assets/login_wx.png');
            }
        }
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title-container {
        text-align: center;
        margin-bottom: 22px;

        & img {
            width: 200px
        }
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
}
</style>
