<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
// import uploadInfoStoreWidthOut from '@/stores/qiniu'
// import { inferenceSqueezenet } from '@/utils/predict'
import * as ort from 'onnxruntime-web'
import { transformImage, preprocess, predict } from '@/utils/predict'
import { getProxyImage } from '@/api/qiniu'

const token = ref('')
// const uploadInfoStore = uploadInfoStoreWidthOut()
const videoURL = ref([])
const coverURLList = ref([])

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
const inputImageUrls = ref<string[]>([
    'https://zihao-openmmlab.obs.cn-east-3.myhuaweicloud.com/20220716-mmclassification/test/husky1.jpeg',
    'https://zihao-openmmlab.obs.cn-east-3.myhuaweicloud.com/20220716-mmclassification/test/husky1.jpeg',
    'https://zihao-openmmlab.obs.cn-east-3.myhuaweicloud.com/20220716-mmclassification/test/husky1.jpeg',
])
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
    // videoURL.value = uploadInfoStore.videoURL
    // coverURLList.value = uploadInfoStore.coverURLList
    // console.log("Get uploadInfoStore => ",  uploadInfoStore)
    // console.log("Get videoURL => ",  videoURL)
    // console.log("Get coverURLList => ",  coverURLList)

    // const url = "http://s3h1q0hvd.bkt.clouddn.com/0703b806-699a-415e-abe7-cb726c46abbf_000001.jpg"
    // var [inferenceResult,inferenceTime] =  await inferenceSqueezenet(url)
    // console.log("inferenceResult => ",  inferenceResult)
    // console.log("inferenceTime => ",  inferenceTime)
    await InitOrt();
    await classificationOnImages();
})

// const submitInference = async () => {

// // var image: HTMLImageElement;
// const image = new Image();
// var sampleImage = getImage();
// image.src = sampleImage.value;

// var imageData = await Jimp.default.read(image.src).then((imageBuffer: Jimp) => {
//     return imageBuffer.resize(200, 200);
//   });
//   console.log("imageData => ",  imageData)

// // // Get the image data from the canvas and submit inference.
// // var [inferenceResult,inferenceTime] = await inferenceSqueezenet(image.src);

// // // Get the highest confidence.
// // var topResult = inferenceResult[0];

// // Update the label and confidence
// // console.log("inferenceResult => ",  inferenceResult)
// // console.log("topResult => ",  topResult)
// };

</script>

<template>
    123
    <!-- <img id="img" :src="coverURLList[0]" alt="" /> -->
    <!-- <button @click="submitInference">submitInference</button> -->
</template>

<style lang="less" scoped>
.upload {
    padding: 30px;
}

.upload-picker {
    #el-upload-dragger {
        background-color: aqua;
    }
}

.upload-tabs {
    margin-top: 35px;
    height: 48px;
    font-size: 18px;
    line-height: 48px;
}
</style>