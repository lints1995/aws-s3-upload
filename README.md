# AWS-s3-upload

## 安装依赖

```shell
  yarn or npm install
```

## 添加 index.js 文件中 s3 上传配置

```js
// AWS s3 上传配置
const config = {
  accessKeyId: "",
  secretAccessKey: "",
  region: "",
  albumBucketName: "",
  domain: "",
};
```

## 上传准备

需要上传图片放入到目录/images 内

## 上传运行

```shell
  node index.js
```
