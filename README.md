# QiYin

柒音前端服务仓库

### 设计文档和DEMO

文档地址和演示地址：https://eq2pyit41ih.feishu.cn/docx/M6L8dYYg6oq3cvxsBSpcoteLnuc

### 运行服务

1. 安装npm&node

2. 安装依赖
```bash
npm i
```

3. 修改映射配置地址，dev环境下改为proxy后的地址，或者使用nginx反向代理解决跨域问题
```bash
'/api': { // 后端服务
    target: 'http://127.0.0.1:10010',
    changeOrigin: true,
    secure:false,
    // rewrite: (path) => path.replace(/^\/api/, '')
},
'/chat': { // AI LLM 服务   
    target: 'http://127.0.0.1:8002',
    changeOrigin: true,
    secure:false,
    // rewrite: (path) => path.replace(/^\/api/, '') // 不可以省略rewrite
}
```

4. 运行服务
```bash
npm run dev
```

5. 构建发布，放置nginx中
```sh
npm run build
```
