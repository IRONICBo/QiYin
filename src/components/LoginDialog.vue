<template>
    <div class="LoginDialog " v-if="props.visible">
        <div class="content" @click.stop="stop">
            <div class="close-wrapper">
                <el-icon @click="cancel" class="close"><Close /></el-icon>
            </div>
            <div class="body">
                <div class="title" v-if="title">{{ state.register?'注册': props.title }}</div>
                <div class="subtitle" v-if="subtitle"><el-icon ><Star class="subicon"/></el-icon>{{ props.subtitle }}</div>
                <el-form
                    ref="ruleFormRef"
                    :model="user"
                    status-icon
                    :rules="rules"
                    label-width="100px"
                    class="demo-ruleForm"
                    style="transform:translate(-15px);"
                >
                    <el-form-item label="账号：" prop="name">
                        <el-input v-model="user.name" placeholder="请输入账号" maxlength="20" clearable prefix-icon="User"/>
                    </el-form-item>
                    <el-form-item label="密码：" prop="password">
                        <el-input v-model="user.password" type="password" placeholder="请输入密码" maxlength="20" show-password clearable prefix-icon="Key" />
                    </el-form-item>
                    <el-form-item label="确认密码：" prop="passwordCom" v-if="state.register">
                        <el-input v-model="user.passwordCom" type="password" placeholder="请确认密码" maxlength="20" show-password clearable prefix-icon="Key" />
                    </el-form-item>
                    <el-form-item label="签名：" prop="signature" v-if="state.register">
                        <el-input v-model="user.signature" placeholder="写下你独一无二的介绍吧~" maxlength="20" :rows="2" clearable type="textarea"/>
                    </el-form-item>
                    <el-button class="btn" type="primary" :loading="state.loading" :loading-icon="Eleme" @click="onSubmit(ruleFormRef)" style="transform:translate(15px);">{{state.register?"注册":"登录"}}</el-button>
                    <div style="text-align: right">
                        <el-link type="warning" @click="changeRegist">{{state.register?"登录":"没有账号？去注册"}}</el-link>
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup>
	import {reactive, ref} from 'vue';
	import {tokenStore, accountStore, tokenStoreWidthOut, accountStoreWidthOut} from '../stores/user';
    import {login,register} from "../api/login";
	import {ElMessage} from "element-plus";
	import {Eleme} from '@element-plus/icons-vue';
    const props = defineProps({
	    visible:{
	    	type:Boolean,
            default:false
        },
	    title:String,
	    subtitle:String,
    })
    const ruleFormRef = ref()
    const emits=defineEmits(['changeVisible','changeLogin'])
    let state = reactive({
      loading:false,
      register:false
    })
    const user  = reactive({
        name: '',
        password: '',
        passwordCom:'',
	    signature:'',
    })
    const validatePassword= (rule, value, callback)=>{
        if (value === '') {
            callback(new Error('请输入密码'));
        } else if(value.length < 6){
	        callback(new Error('密码不能少于6个字符'));
        } else {
	        if (user.passwordCom !== '') {
		        if (!ruleFormRef.value) return
		        ruleFormRef.value.validateField('passwordCom', () => null)
	        }
            callback();
        }
    }
    const validatePasswordCom= (rule, value, callback)=>{
        if (value === '') {
            callback(new Error('请确认密码'));
        } else if(value !== user.password){
	        callback(new Error('两次密码必须相同'));
        } else {
            callback();
        }
    }
    const validateAccount= (rule, value, callback)=>{
        if (value === '') {
            callback(new Error('请输入账号'));
        } else if(value.length < 6){
	        callback(new Error('账号不能少于6个字符'));
        }else {
            callback();
        }
    }

    const rules = reactive({
        password: [{ validator: validatePassword, trigger: 'blur' }],
        name: [{ validator: validateAccount, trigger: 'blur' }],
	    passwordCom:[{ validator: validatePasswordCom, trigger: 'blur' }],
    })

    const cancel=() =>{
	    emits('changeVisible', false)
    }

    const changeRegist=()=>{
	    state.register=!state.register
    };

    const onSubmit =(formEl)=>{
        if (!formEl) return
        formEl.validate((valid) => {
            if (valid) {
            	let submit = state.register ? register:login
            	state.loading=true
	            submit( {name:user.name,password:user.password,signature:user.signature} ).then((res) => {
                    if (res.code === 200) {
                        ElMessage({
                            message: '成功',
                            type: 'success'
                        })
                        // 把信息存储到全局变量中
                        tokenStoreWidthOut().setToken(res.data.token)
                        accountStoreWidthOut().setAccountId(res.data.id)
	                    state.register ? state.register=!state.register:cancel()
                        if(!state.register){
	                        emits('changeLogin', true)
                        //   查看是否选择了风格
                        }
                    } else {
                        ElMessage.error("账号或验证码错误！")
                    }
                }).catch(error=>{
                    ElMessage.error(error)
                })
	            state.loading=false
            }
        })
    }
</script>

<style scoped lang="less">
    .LoginDialog {
        z-index: 20;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(105, 107, 109, 0.73);
        display: flex;
        justify-content: center;
        align-items: center;
        color: black;

        .content {
            border-radius: 10px !important;
            border: 0px;

            background: white;
            border-radius: 2px;
            box-sizing: border-box;
            font-size: 15px;
            text-align: center;

            .close-wrapper{
                text-align: right;
            }
            .close {
                text-align: right;
                top: 6px;
                right: 10px;
                cursor: pointer;
                z-index: 10;
            }

            .body {
                padding: 25px;
                .title {
                    font-size: 20px;
                    font-weight: bold;
                }

                .subtitle {
                    margin: 10px;
                    font-size: 13px;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    .subicon{
                        padding-top: 1px;
                        margin-right: 3px;
                    }
                    &.gray {
                        color: rgb(143, 143, 158);
                    }
                }
            }

            .footer {
                height: 46px;
                display: flex;
                border-top: 1px solid whitesmoke;
                font-size: 14px;

                .cancel, .ok {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 49%;
                }

                .ok {
                    font-weight: bold;
                }

                .cancel {
                    border-right: 1px solid whitesmoke;

                    &.gray {
                        color: rgb(143, 143, 158);
                    }
                }
            }
        }
        @media (min-width: 1024px) {
           .content{
               width: 30%;
               .body {
                   padding: 15px;
               }
           }
        }

        @media (min-width: 700px) and (max-width: 1024px){
            .content{
                width: 75%;
                .body {
                    padding: 15px;
                }
            }
        }

        @media (min-width: 200px) and (max-width: 700px){
            .content{
                width: 90%;
                .body {
                    padding: 7px;
                }
            }
        }
    }
</style>
