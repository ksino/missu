# fork
* https://github.com/hackerzhou/Love
* 代码在此项目的基础上修改

# 设想
* 先显示心形图
* 点击心形图之后再显示信件内容
* 这样对于再手机观看的体验可能更好
* 通过修改配置的信息（info.json），来修改内容

## 自定义
```json5
  //读取的信件文件名
  "file": "letter.txt",
  //心形图里面显示的文字
  "message": "",
  "love": "",
  "sign": "",
  "tips": "尝试点击这里吗？",
  //开始认识的年月日时分秒
  "year": 2006,
  "month": 1,
  "day": 1,
  "hour": 0,
  "minute": 0,
  "second": 0,
  // 是否跳过动画 直接显示信件
  "is_skip": false,
  // speed = 0 显示信件的全部内容
  // speed > 0 按照设置的数值（ms）逐个字符显示
  "speed": 100,
  "version": "0.0.6"
```