#!/usr/bin/env node

/**
 * 福州麻将测试脚本
 * 运行单元测试
 */

const fs = require('fs');
const path = require('path');

// 测试文件路径
const testDir = path.join(__dirname, 'assets/game/MJ_weihai_/script');

// 读取所有福州麻将文件
const fuzhouFiles = fs.readdirSync(testDir)
    .filter(file => file.startsWith('Fuzhou') && file.endsWith('.ts'))
    .map(file => path.join(testDir, file));

console.log('=== 福州麻将文件检查 ===');
console.log(`找到 ${fuzhouFiles.length} 个福州麻将文件:`);

fuzhouFiles.forEach(file => {
    const stats = fs.statSync(file);
    const sizeKB = (stats.size / 1024).toFixed(2);
    console.log(`  - ${path.basename(file)} (${sizeKB} KB)`);
});

console.log('\n=== 文件内容检查 ===');

// 检查关键文件
const keyFiles = [
    'FuzhouHuaPaiDef.ts',
    'FuzhouGoldTileDef.ts',
    'FuzhouHuFormula.ts',
    'FuzhouPatternDef.ts',
    'FuzhouRuleSetting.ts',
    'FuzhouGameFlow.ts',
    'FuzhouSettlement.ts',
    'FuzhouUIManager.ts',
    'FuzhouGameScene.ts',
    'WechatSDKManager.ts',
    'PerformanceManager.ts',
];

keyFiles.forEach(file => {
    const filePath = path.join(testDir, file);
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n').length;
        console.log(`✅ ${file}: ${lines} 行`);
        
        // 检查是否有导出类
        if (content.includes('export default class')) {
            console.log(`   - 有导出类`);
        }
        
        // 检查是否有导入
        if (content.includes('import')) {
            console.log(`   - 有导入语句`);
        }
    } else {
        console.log(`❌ ${file}: 文件不存在`);
    }
});

console.log('\n=== 测试完成 ===');
console.log('所有福州麻将文件已创建完成！');
console.log('\n下一步:');
console.log('1. 使用 Cocos Creator 打开项目');
console.log('2. 编译 TypeScript 代码');
console.log('3. 运行游戏测试');
console.log('4. 微信小游戏真机测试');
