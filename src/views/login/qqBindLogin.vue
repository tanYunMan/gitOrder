<template>
  <div class="login-container">
    <canvas id="Mycanvas"></canvas>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="绑定账号" name="first">
          <el-form-item prop="username">
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="用户名"
              style="width: '100%'"
              name="username"
              type="text"
              tabindex="1"
              auto-complete="on"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
            />
          </el-form-item>

          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;margin-bottom:30px;padding: 10px 10px;"
            @click.native.prevent="handleLogin"
          >绑定</el-button>
        </el-tab-pane>
      </el-tabs>
      <!-- <div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: any</span>
      </div>-->
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";
export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      //if (!validUsername(value)) {
      if (!value) {
        callback(new Error("请输入用户名"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error("请输入大于6位的密码"));
      } else {
        callback();
      }
    };
    return {
      loginForm: {
        username: "",
        password: "",
      },
      openid: "",
      activeName: "first",
      loginRules: {
        username: [
          {
            required: true,
            trigger: "blur",
            validator: validateUsername,
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            validator: validatePassword,
          },
        ],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
      pageData: {
        qq: "",
        wx: "",
      },
    };
  },
  activated() {
    // this.canvas()
  },
  mounted() {
    // this.canvas()
    this.openid = this.$store.getters.openId;
    if (!this.openid) {
      // openid不存在，跳转到登录
      this.$router.push("/");
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },

    //判断账号是否有权限
    // getUserTree() {
    //   getDatas({}, "/user/function/getUserTree")
    //     .then((res) => {
    //       if (res.code == 1001) {
    //         if (res.body.length > 0) {
    //           this.$router.push({
    //             path: this.redirect || "/",
    //           });

    //           $(".meta").attr(
    //             "content",
    //             "width=device-width, initial-scale=0.1, maximum-scale=10, user-scalable=yes"
    //           );
    //         } else {
    //           this.$message({
    //             showClose: true,
    //             message: "您无权限登录，请联系管理员",
    //             type: "error",
    //           });
    //         }
    //       } else {
    //         this.$message({
    //           showClose: true,
    //           message: res.msg,
    //           type: "error",
    //         });
    //       }
    //     })
    //     .catch((err) => {});
    // },
    handleLogin() {
      sessionStorage.clear();

      this.$refs.loginForm.validate((valid) => {
        //console.log(this.loginForm)
        if (valid) {
          this.loading = true;
          this.POST(
            "/login/login/login",
            {
              login: this.loginForm.username,
              password: this.loginForm.password,
            },
            (data) => {
              this.Set("name", this.loginForm.username);
              this.Set("userID", data.body.userID);
              this.Set("userType", data.body.userType);
              this.POST(
                "/user/oauth/bind",
                { qqOpenid: this.openid, qqAccessToken: this.openid },
                (res) => {
                  console.log(res);
                }
              );
              this.$router.push({
                path: this.redirect || "/home",
              });
              this.loading = false;
            },
            (err) => {
              this.loading = false;
            },
            1
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #f0f2f5;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    // color: $cursor;
    // color:red;
  }
}

.login-container .el-input input {
  // color:red;
}

#Mycanvas {
  position: absolute;
  width: 100%;
  height: 100%;
}

/* reset element-ui css */
.login-container {
  // .el-input {
  //     display: inline-block;
  //     height: 47px;
  //     width: 85% !important;

  //     input {
  //         background: transparent;
  //         border: 0px;
  //         -webkit-appearance: none;
  //         border-radius: 0px;
  //         padding: 12px 5px 12px 15px;
  //         // color: $light_gray;
  //         height: 47px;
  //         // caret-color: $cursor;

  //         &:-webkit-autofill {
  //             // box-shadow: 0 0 0px 1000px $bg inset !important;
  //             // -webkit-text-fill-color: $cursor !important;
  //         }
  //     }
  // }

  // .el-form-item {
  //     border: 1px solid rgba(255, 255, 255, 0.1);
  //     // background: rgba(0, 0, 0, 0.1);
  //     border: 1px solid #bbb;
  //     border-radius: 5px;
  //     color: #454545;
  // }
}
</style><style lang="scss" scoped>
$bg: #f0f2f5;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: absolute;
    width: 500px;
    max-width: 100%;
    padding: 40px 30px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;

    & .third {
      // margin-top: 20px;
      text-align: center;

      & > a > span {
        width: 48px;
        height: 48px;
        display: inline-block;
        background: center center no-repeat;
        background-size: 100% auto;
      }

      .qq {
        background-image: url("~@/assets/login_qq.png");
        margin-right: 50px;
      }

      .wx {
        background-image: url("~@/assets/login_wx.png");
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
      width: 200px;
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
