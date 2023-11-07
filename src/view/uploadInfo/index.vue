<script setup lang="ts">
import { nextTick, onMounted, ref, reactive } from 'vue';
import uploadInfoStoreWidthOut from '@/stores/qiniu'
// import { inferenceSqueezenet } from '@/utils/predict'
import * as ort from 'onnxruntime-web'
import { transformImage, preprocess, predict } from '@/utils/predict'
import { getProxyImage } from '@/api/qiniu'
import { TAGS } from '@/constant'
import { uploadVideoInfo } from '@/api/video'
import { ElMessage } from "element-plus"
import { useRouter } from "vue-router";


console.log("ALL TAGS => ",  TAGS)

const router = useRouter();
const token = ref('')
const uploadInfoStore = uploadInfoStoreWidthOut()
const videoURL = ref('')

// -------------------ONNX Runtime Web Start-------------------

// Set default wasm path
// onnxruntime web 1.14.0
ort.env.wasm.wasmPaths = {
  'ort-wasm.wasm': 'https://cdnjs.cloudflare.com/ajax/libs/onnxruntime-web/1.14.0/ort-wasm.wasm',
  'ort-wasm-threaded.wasm':
    'https://cdnjs.cloudflare.com/ajax/libs/onnxruntime-web/1.14.0/ort-wasm-threaded.wasm',
  'ort-wasm-simd.wasm':
    'https://cdnjs.cloudflare.com/ajax/libs/onnxruntime-web/1.14.0/ort-wasm-simd.wasm',
  'ort-wasm-simd-threaded.wasm':
    'https://cdnjs.cloudflare.com/ajax/libs/onnxruntime-web/1.14.0/ort-wasm-simd-threaded.wasm'
}

// Set default config to wasm backend(webgl)
const classifiy = ref(false)
const executionProvider = ref<'wasm' | 'webgl'>('wasm')
const model = ref<ort.InferenceSession | null>(null)
const inputImageUrls = ref<string[]>([])
const modelPath = ref<string>('/resnet18_imagenet.onnx')
const classPath = ref<string>('/imagenet_1000_zh.json')
const classIndices = ref<{
  [key: number]: string
} | null>(null)
const InitOrt = async () => {
    // Initialize an onnx inference session with a webgl backend
    model.value = await ort.InferenceSession.create(modelPath.value, {
        executionProviders: [executionProvider.value]
    })
    const classes_text = await fetch(classPath.value).then((response) => response.text())
    classIndices.value = JSON.parse(classes_text)
    console.log("classIndices => ",  classIndices.value)
    console.log("model => ",  model.value)
    console.log("executionProvider => ",  executionProvider.value)
    console.log("inputImageUrls => ",  inputImageUrls.value)
}

const classificationOnImages = async () => {
    // Start classify
    classifiy.value = true
    let categorySet = new Set()
    for (const inputImageUrl of inputImageUrls.value) {
        if (model.value) {
            // get fake url
            const imageData = await getProxyImage(inputImageUrl)
            console.log("getProxyImage => ",  imageData)
            // const url = URL.createObjectURL(imageData.data)
            // console.log("url => ",  url)
            const inputTensor = await preprocess(imageData.data)
            const res = await predict(model.value, inputTensor, classIndices.value)
            if (res) {
                // timeCost.value = res.timeCost
                // seriesData.value = res.data
                // seriesLabels.value = res.labels

                // Set default videoInfo category, use Set to avoid duplicate
                console.log("res => ",  res)
                categorySet.add(res.labels[0])
                // categorySet.add(res.labels[1])
            }
        }
    }

    // Set default videoInfo category, use Set to avoid duplicate
    // concate with #
    let categorySetString = Array.from(categorySet).map((item) => '#' + item)
    console.log("categorySetString => ",  categorySetString)
    videoInfo.tag = categorySetString.toString()

    // Stop classify
    classifiy.value = false
}

onMounted(async () => {
    videoURL.value = uploadInfoStore.videoURL
    inputImageUrls.value = uploadInfoStore.coverURLList
    console.log("Get uploadInfoStore => ",  uploadInfoStore)
    console.log("Get videoURL => ",  videoURL.value)
    console.log("Get inputImageUrls => ",  inputImageUrls.value)

    // const url = "http://s3h1q0hvd.bkt.clouddn.com/0703b806-699a-415e-abe7-cb726c46abbf_000001.jpg"
    // var [inferenceResult,inferenceTime] =  await inferenceSqueezenet(url)
    // console.log("inferenceResult => ",  inferenceResult)
    // console.log("inferenceTime => ",  inferenceTime)
    
    // set video info
    videoInfo.videoURL = videoURL.value
    
    await InitOrt();
    setTimeout(async () => {
        console.log("Start classificationOnImages with 1s delay")
        await classificationOnImages();
    }, 1000);
})
// -------------------ONNX Runtime Web End-------------------

// -------------------QiYin Video Start-------------------
const videoInfo = reactive({
  title: '',
  desc: '',
  cover: '',
  videoURL: '',
  category: '',
  tag: '',
})

const onSubmit = () => {
    console.log('videoInfo => ', videoInfo)

    const params = {
        'category': videoInfo.category,
        'cover_url': videoInfo.cover,
        'desc': videoInfo.desc, 
        'tags': videoInfo.tag,
        'title': videoInfo.title,
        'play_url': videoInfo.videoURL,
    }

    uploadVideoInfo(params).then((res) => {
        console.log('uploadVideoInfo => ', res)
        ElMessage({
              showClose: true,
              message: '视频发布成功！🚀',
              type: "success",
        });

        // router to home
        router.push({path:"/"})
    }).catch((err) => {
        console.log('uploadVideoInfo => ', err)
        ElMessage({
              showClose: true,
              message: '呜呜呜 视频发布失败🙅',
              type: "error",
        });
    })
}

const chatInfo = ref('')
const chatResp = ref<string[]>(['玛尔济斯，小小身躯蕴藏无尽的可爱与忠诚。', '玛尔济斯，绒毛天使，带来幸福与欢笑。', '玛尔济斯，小小模样，却有着大大的爱意。'])

// -------------------QiYin Video End-------------------

</script>

<template>
    <el-card class="upload">
        <div class="upload-title">发布视频</div>
        <div class="upload-content">
            <el-form
                label-position="top"
                label-width="100px"
                :model="videoInfo"
                style="width: 500px;margin-right: 48px;"
            >
                <el-form-item label="作品标题🚗">
                <el-input v-model="videoInfo.title" placeholder="填写清晰的标题，会有更多人浏览..." />
                </el-form-item>
                <el-form-item label="作品简介💻">
                <el-input v-model="videoInfo.desc" placeholder="填写更详细的作品描述信息吧！" type="textarea" />
                </el-form-item>
                <el-form-item label="设置封面🔥" class="set-cover">
                <el-alert title="智能封面推荐🤖️" type="warning" :closable="false" >
                    <el-radio-group v-model="videoInfo.cover" class="ml-4">
                        <el-radio v-for="cover in inputImageUrls" :label="cover" size="large" class="image-label-cover">
                            <el-image class="image-label" :src="cover" fit="contain"/>
                        </el-radio>
                    </el-radio-group>
                </el-alert>
                <span class="radio-tip">
                    🎉好封面会吸引更多人浏览作品哦～🎉
                </span>
                </el-form-item>
                <el-form-item label="设置分类🏷️">
                    <el-select v-model="videoInfo.category" placeholder="设置你的作品类型～">
                        <el-option
                            v-for="item in TAGS"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="添加标签💡" v-loading="classifiy" element-loading-text="🚀🚀🚀 离线识别中...">
                    <el-input v-model="videoInfo.tag" placeholder="添加标签让更多人看到！"/>
                    <span class="radio-tip">
                        使用#添加标签并用逗号分割，最多添加5个标签📖，示例#玛尔济斯犬
                    </span>
                    <el-alert title="本地AI离线预推荐标签🤖️" type="success" :closable="false" ></el-alert>
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="onSubmit" class="ml-4">发布</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
            <div class="qiniu-video-helper">
                <span class="tip">
                    视频预览📺
                </span>
                <video-player
                    class="qiniu-video-player"
                    :src="videoURL"
                    autoplay
                    :loop="true"
                    :volume="0.6"
                />

                <span class="tip">
                    AI文案生成（基于Vicuna大模型）🐑
                </span>
                <el-card class="chat-card">
                    <template #header>
                    <div class="chat-card-header">
                        <span>📱AI文案助手</span>
                        <el-button class="button" text>提问</el-button>
                    </div>
                    </template>
                    <div class="chat-card-response">
                        <el-input v-model="chatInfo" placeholder="请输入文案需求～" />
                        <div class="chat-response">
                            <!-- <div v-for="r in chatResp" :key="r" class="chat-response">{{ r }}</div> -->
                            <el-alert
                                class="chat-response_item"
                                v-for="r in chatResp"
                                :key="r"
                                title="🤖️AI回复"
                                type="error"
                                :description="r"
                            />
                        </div>
                    </div>
                </el-card>
            </div>
        </div>
    </el-card>
</template>

<style lang="less" scoped>
.upload {
    padding: 30px;
    
    .upload-title {
        width: 870px;
        margin: 0 auto 24px;
        font-style: normal;
        font-weight: bold;
        font-size: 24px;
        line-height: 28px;
        color: #323538;
        margin-bottom: 16px;
    }

    .upload-content {
        display: flex;
        justify-content: center;
    }
}

.el-radio__label {
    width: 100px;
    height: 100px;
}

.el-radio__input {
    display: none !important;
}

.image-label {
    width: 100px;
    height: 100px;
    background-color: #161823;
    border: 0px;
    border-radius: 10px;
}

.el-radio {
    height: 100px;
    margin-top: 15px;
}

.radio-tip {
    color: var(--el-color-info-light-3);
    font-size: inherit;
    height: var(--el-input-inner-height);
    line-height: var(--el-input-inner-height);
}

.qiniu-video-helper {
    display: flex;
    flex-direction: column; // vertical

    .tip {
        color: var(--el-text-color-regular);
        font-size: inherit;
        height: var(--el-input-inner-height);
        line-height: var(--el-input-inner-height);
    }

    .qiniu-video-player {
        height: 300px;
        overflow: hidden;
        width: 320px;
        border-radius: 10px;

        margin-top: 20px;
        margin-bottom: 20px;
    }
}

.chat-card {
    width: 320px;
    margin-top: 20px;
    background-color: #f8f9fd;

    .chat-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .chat-card-response {
        font-size: 14px;
        margin-bottom: 18px;

        .chat-response {
            max-height: 150px;
            overflow-y: auto;
        }

        .chat-response_item {
            margin: 10px 0px;
        }
    }
}
</style>