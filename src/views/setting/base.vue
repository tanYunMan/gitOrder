<template>
<div :class="isWidth ? 'el-mobile-true-container container' : 'container'">
    <el-form ref="form" label-position="right" :model="form" :label-width="isWidth? '120px' : '140px'" :class="isWidth ? 'el-mobile-true' : ''">
        <el-form-item label="系统LOGO：">
            <Upload :imgList="form.logo" imgName="系统LOGO" v-on:listenTochildEvent="showMessageFromChild" v-if="imgLoading" />
            <span class="tips">图片尺寸：180*60</span>
        </el-form-item>
        <el-form-item label="菜单LOGO：">
            <Upload :imgList="form.menuLogo" imgName="系统LOGO" v-on:listenTochildEvent="showMenuLogoFromChild" v-if="imgLoading" />
            <span class="tips">图片尺寸：180*60</span>
        </el-form-item>
        <el-form-item label="菜单缩放LOGO：">
            <Upload :imgList="form.menuSmallLogo" imgName="系统LOGO" v-on:listenTochildEvent="showSmallLogoFromChild" v-if="imgLoading" />
            <span class="tips">图片尺寸：180*60</span>
        </el-form-item>
        <el-form-item label="系统名称：">
            <el-input v-model="form.systemName" placeholder="请输入系统名称"></el-input>
        </el-form-item>
        <el-form-item label="系统描述：">
            <el-input v-model="form.remark" placeholder="请输入系统描述"></el-input>
            <span class="tips">为优化推广而设置，尽量描述精炼，语句通顺</span>
        </el-form-item>
        <el-form-item label="关键字：">
            <el-input v-model="form.keyWord" placeholder="请输入关键字"></el-input>
            <span class="tips">为优化推广而设置，多个词用英文逗号隔开 ","</span>
        </el-form-item>
        <el-form-item label="ICP备案号：">
            <el-input v-model="form.icp" placeholder="请输入ICP备案号"></el-input>
        </el-form-item>
        <el-form-item label="运营商：">
            <el-input v-model="form.operator" placeholder="请输入运营商"></el-input>
        </el-form-item>
        <el-form-item label="公安部备案号：">
            <el-input v-model="form.icp2" placeholder="请输入公安部备案号"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit" :loading="loading">确认保存</el-button>
        </el-form-item>
    </el-form>
</div>
</template>

<script>
// import { getSiteExtendInfo, updateInfo } from '@/api/meun1/menu1-1/index'
import Upload from '@/components/Upload'
export default {
    data() {
        return {
            imageUrl: '',
            form: {},
            loading: false,
            isWidth: false,
            imageUrl: '',
            imgLoading: false
        }
    },
    components: {
        Upload
    },
    created() {
        var w = document.documentElement ? document.documentElement.clientWidth : document.body.clientWidth; //先获取窗口宽度
        if (w < 750) {
            this.isWidth = true
        }

        this.getSiteExtendInfo();
    },

    methods: {
        // 上传图片返回的信息
        showMessageFromChild(data) {
            this.form = {
                ...this.form,
                logo: data
            }
        },
        // 上传图片返回的信息
        showMenuLogoFromChild(data) {
            this.form = {
                ...this.form,
                menuLogo: data
            }
        },
        // 上传图片返回的信息
        showSmallLogoFromChild(data) {
            this.form = {
                ...this.form,
                menuSmallLogo: data
            }
        },

        // 获取信息
        getSiteExtendInfo() {
            this.GET(
                '/platform/platformBase/get', {},
                data => {
                    if (data.code === 1001) {
                        this.form = data.body
                    }
                    this.imgLoading = true
                    this.loading = false
                }
            )
        },

        onSubmit() {
            if (this.form.systemName === null && this.form.remark === null && this.form.keyWord === null && this.form.icp === null && this.form.operator === null && this.form.icp2 === null) {
                return false
            }
            this.loading = true
            //   updateInfo(this.form).then(res => {
            //     if (res.code === 1001) {
            //       this.$message({
            //         message: res.msg,
            //         type: 'success',
            //       });
            //     } else {
            //       this.$message({
            //         showClose: true,
            //         message: res.msg,
            //         type: 'error',
            //       });
            //     }
            //     setTimeout(()=>{
            //       this.loading = false
            //     },1500)
            //   })
            this.POST(
                '/platform/platformBase/update',
                this.form,
                data => {
                    if (data.code === 1001) {
                        this.$message({
                            message: data.msg,
                            type: 'success',
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: data.msg,
                            type: 'error',
                        });
                    }
                    this.loading = false
                }, err => {
                    this.loading = false
                }
            )

        }
    }
}
</script>

<style lang="scss">
.avatar-uploader {
    .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 180px;
        height: 60px;
        line-height: 60px;
        text-align: center;
    }

    .avatar {
        width: 180px;
        height: 60px;
        display: block;
    }
}
</style><style lang="scss" scoped>
.el-mobile-true-container {
    padding: 20px 0px;
}

.container {
    padding: 20px;

    .el-mobile-true {
        padding: 0;

        .el-form-item {
            .el-input {
                width: 210px;
            }
        }
    }

    .el-form {
        .el-input {
            width: 300px;
        }

        .tips {
            color: #909399;
            font-size: 12px;
            margin-left: 10px;
        }

        .el-div-item {
            margin-bottom: 20px;

            .label {
                color: #606266;
                margin: 0 10px;
            }
        }

    }

}
</style>
