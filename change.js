const fs = require('fs');
const path = require('path');
const fileStartPath = path.resolve(__dirname, './changeStart.txt');
const fileEndPath = path.resolve(__dirname, './changeEnd.txt')
const dayjs = require('dayjs');
function changeLog() {
    let logInformation = '';
    // 1. 首先判断当前是否有这个文件, 然后读取文件
    if (fs.existsSync(fileStartPath)) {
        try {
            logInformation = fs.readFileSync(fileStartPath, 'utf-8')
        } catch (err) {
            throw new Error(err)
        }
    } else {
        throw new Error('请检查是否存在changeStart.txt文件')
    }
    // 2. 遍历当前文件, 划分模块
    const categoryMap = new Map();
    let logArray = logInformation.split(/### /).filter(item => item !== '');
    for (let i = 0; i < logArray.length; i++) {
        let middleArray = logArray[i].split('\n').filter(item => item !== '');
        if (categoryMap.has(middleArray[0])) {
            categoryMap.set(middleArray[0], [...categoryMap.get(middleArray[0]), ...middleArray.splice(1)])
        } else {
            categoryMap.set(middleArray[0], middleArray.splice(1));
        }
    }
    // 3. 按模块进行数据写入
    // 3.1 首先判断要写入的文件是否存在
    // 3.1 存疑 是否要保留之前的变更 ---- 先保存, 并使用---- 时间 --- 来进行区分
    // 3.1.1 创建模版
    let template =
        `-------------- ${dayjs().format('YYYY-MM-DD HH:mm:ss')} -------------- \n${dayjs().format('MM.DD')} RED BI[v   ]前端线上改动发布如下：\n`
    // 3.2.1 写入新特性模块
    if (categoryMap.has('Features')) {
        template += '### 🌟新特性\n';
        let FeaturesArray = categoryMap.get('Features');
        let changeEndArray = FeaturesArray.map(item => item.split('([')[0])
        changeEndArray.forEach(item => {
            template += `${item}\n`
        })
        template += '\n'
    }
    // 3.2.2 写入问题修复模块
    if (categoryMap.has('Bug Fixes')) {
        template += '### 🐞问题修复\n';
        let BugFixesArray = categoryMap.get('Bug Fixes');
        let changeEndArray = BugFixesArray.map(item => item.split('([')[0])
        changeEndArray.forEach(item => {
            template += `${item}\n`
        })
    }
    // 4. 将构建好的模版写入到目标文件中
    try {
        fs.appendFileSync(fileEndPath, template)
    } catch (error) {
        throw new Error(error)
    }
    console.log(template);
}

/**
 * 1. 如果文件存在则读取文件
 * 2. 遍历整个字符串, 划分模块, 区分出新增以及bug修复
 * 3. 按模块填入模版中
 * 4. 进行文件写入
 * 
 */

changeLog()