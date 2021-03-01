<template>
  <div></div>
</template>

<script>
import { getToken, setToken, removeToken } from "@/utils/auth";
export default {
  created() {
    const code = this.getQueryString("code");
    const state = this.getQueryString("state");
    this.GET(
      "/user/qqConfig/return",
      { userType: 2, code: code, state: state },
      (res) => {
        if (res.code === 1001) {
          const type = res.body.type;
          if (type === 1) {
            this.$message.success("请绑定已有账号");
            this.$store.commit("app/SET_OPEN_ID", res.body.qqOpenid);
            this.$router.push("/qqBindLogin");
          } else {
            setToken(res.body.token);
            this.Set('userID', res.body.userID)
            this.Set('userType', res.body.userType)
            this.Set('token', res.body.token)
            this.$router.push({
                path: this.redirect || '/home'
            })
            // this.$store.commit("user/SET_TOKEN", getToken());
            // this.getUserTree(); //判断账户是否有权限
          }
        }
      }
    );
  },
  methods: {
    getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      console.log(window.location);
      const params = window.location.href.split("?")[1];
      if (!params) {
        return null;
      }
      const paramsArr = params.split("&");
      for (let index = 0; index < paramsArr.length; index++) {
        const data = paramsArr[index];
        if (data) {
          const splits = data.split("=");
          const key = splits[0];
          if (key == name) {
            return splits[1];
          }
        }
      }
      return null;
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
  },
};
</script>