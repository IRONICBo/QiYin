<script setup lang="ts">
import { nextTick, onMounted, ref, reactive } from 'vue';
import uploadInfoStoreWidthOut from '@/stores/qiniu'
// import { inferenceSqueezenet } from '@/utils/predict'
import * as ort from 'onnxruntime-web'
import { transformImage, preprocess, predict } from '@/utils/predict'
import { getProxyImage } from '@/api/qiniu'
import { TAGS } from '@/constant'


console.log("ALL TAGS => ",  TAGS)

const token = ref('')
const uploadInfoStore = uploadInfoStoreWidthOut()
const videoURL = ref([])

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

                console.log("res => ",  res)
            }
        }
    }
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
    await InitOrt();
    setTimeout(async () => {
        console.log("Start classificationOnImages with 10s delay")
        await classificationOnImages();
    }, 10000);
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
  console.log('submit!')
}
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
                style="width: 500px"
            >
                <el-form-item label="作品标题">
                <el-input v-model="videoInfo.title" />
                </el-form-item>
                <el-form-item label="作品简介">
                <el-input v-model="videoInfo.desc" />
                </el-form-item>
                <el-form-item label="设置封面" class="set-cover">
                <el-alert title="智能封面推荐" type="warning" :closable="false" />
                <el-radio-group v-model="videoInfo.cover" class="ml-4">
                    <el-radio label="1" size="large" class="image-label-cover">
                        <el-image class="image-label" src="http://s3h1q0hvd.bkt.clouddn.com/0703b806-699a-415e-abe7-cb726c46abbf_000001.jpg" fit="contain"/>
                    </el-radio>
                    <el-radio label="2" size="large" class="image-label-cover">
                        <el-image class="image-label" src="http://s3h1q0hvd.bkt.clouddn.com/0703b806-699a-415e-abe7-cb726c46abbf_000001.jpg" fit="contain"/>
                    </el-radio>
                    <el-radio label="3" size="large" class="image-label-cover">
                        <el-image class="image-label" src="http://s3h1q0hvd.bkt.clouddn.com/0703b806-699a-415e-abe7-cb726c46abbf_000001.jpg" fit="contain"/>
                    </el-radio>
                </el-radio-group>
                </el-form-item>
                <el-form-item label="设置分类Tag">
                    <el-select v-model="videoInfo.tag" class="" placeholder="设置你的作品类型～">
                        <el-option
                            v-for="item in TAGS"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item label="添加标签#">
                <el-input v-model="videoInfo.category" />
                </el-form-item>
                <el-form-item>
                    <el-button type="danger" @click="onSubmit" class="ml-4">发布</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
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
</style>