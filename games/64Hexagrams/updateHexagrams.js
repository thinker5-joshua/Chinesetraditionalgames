const fs = require('fs');
const path = require('path');

// 读取原有卦象数据
const originalHexagramsData = require('./originalHexagramsData.js');

// 读取新的卦象详细数据
const hexagramsFullDataPath = path.join(__dirname, 'hexagramsFullData.json');
const hexagramsFullData = JSON.parse(fs.readFileSync(hexagramsFullDataPath, 'utf8'));

// 合并数据
const mergedHexagramsData = originalHexagramsData.map(originalData => {
    // 找到对应的新数据
    const fullData = hexagramsFullData.find(item => item.id === originalData.id);
    
    // 合并数据，保留原有数据，添加新数据
    return {
        ...originalData,
        ...fullData
    };
});

// 读取script.js文件内容
const scriptPath = path.join(__dirname, 'script.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

// 构建要替换的内容
const updatedHexagramsData = `// 易经六十四卦数据
const hexagramsData = ${JSON.stringify(mergedHexagramsData, null, 4)};`;

// 替换script.js中的hexagramsData数组
const startMarker = '// 易经六十四卦数据';
const endMarker = '// 游戏状态';
const startIndex = scriptContent.indexOf(startMarker);
const endIndex = scriptContent.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const newContent = scriptContent.substring(0, startIndex) + updatedHexagramsData + '\n\n' + scriptContent.substring(endIndex);
    
    // 写入更新后的内容
    fs.writeFileSync(scriptPath, newContent, 'utf8');
    console.log('卦象数据已成功更新到script.js文件中');
} else {
    console.error('在script.js文件中找不到指定的标记');
}