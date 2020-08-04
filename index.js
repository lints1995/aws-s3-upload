let AWS = require("aws-sdk"),
  fs = require("fs");
const { DataSync } = require("aws-sdk");

const uploadImagePath = "./images/";

// AWS s3 上传配置
const config = {
  accessKeyId: "",
  secretAccessKey: "",
  region: "",
  albumBucketName: "",
  domain: "",
};
AWS.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region: config.region,
});
let images = []; //存放图片源文件路径下图片数组

function readFileList(path, filesList) {
  let files = fs.readdirSync(path);
  files.forEach(function (item, index) {
    let stat = fs.statSync(path + item);
    if (stat.isDirectory()) {
      //递归读取文件
      readFileList(path + item + "/", filesList);
    } else {
      let obj = {}; //定义一个对象存放文件的路径和名字
      obj.path = path; //路径
      obj.filename = item; //名字
      filesList.push(obj);
    }
  });
}
let getFiles = {
  //获取文件夹下的所有文件
  getFileList: function (path) {
    let filesList = [];
    readFileList(path, filesList);
    return filesList;
  },
  //获取文件夹下的所有图片
  getImageFiles: function (path) {
    let imageList = [];
    this.getFileList(path).forEach((item) => {
      imageList.push({
        buffer: fs.readFileSync(item.path + item.filename),
        filename: item.filename,
      });
    });
    return imageList;
  },
};

images = getFiles.getImageFiles(uploadImagePath); // 获取文件夹下的所有图片
for (const value of images) {
  let s3bucket = new AWS.S3();
  s3bucket.createBucket(function () {
    let params = {
      Bucket: config.albumBucketName,
      Key: value.filename,
      Body: value.buffer,
      ACL: "public-read",
    };
    s3bucket.upload(params, function (err, data) {
      if (err) {
        console.log("ERROR MSG: ", err);
      } else {
        console.log(data);
      }
    });
  });
}
