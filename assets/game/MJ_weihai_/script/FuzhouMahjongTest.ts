/**
 * 福州麻将单元测试
 * 测试花牌、金牌、胡牌算法等核心功能
 */

import MahjongTileDef from "./MahjongTileDef";
import FuzhouHuaPaiDef from "./FuzhouHuaPaiDef";
import FuzhouGoldTileDef from "./FuzhouGoldTileDef";
import FuzhouHuFormula from "./FuzhouHuFormula";
import FuzhouPatternDef from "./FuzhouPatternDef";
import FuzhouRuleSetting from "./FuzhouRuleSetting";

/**
 * 测试结果
 */
interface TestResult {
    name: string;
    passed: boolean;
    message: string;
}

/**
 * 福州麻将单元测试
 */
export default class FuzhouMahjongTest {
    /** 测试结果 */
    private _oResults: Array<TestResult> = [];

    /**
     * 运行所有测试
     */
    runAllTests(): void {
        console.log('=== 福州麻将单元测试开始 ===');
        
        this.testHuaPaiDef();
        this.testGoldTileDef();
        this.testHuFormula();
        this.testPatternDef();
        this.testRuleSetting();
        
        this.printResults();
        
        console.log('=== 福州麻将单元测试结束 ===');
    }

    /**
     * 测试花牌定义
     */
    private testHuaPaiDef(): void {
        console.log('测试花牌定义...');
        
        // 测试花牌判断
        this.assert(
            '花牌判断-梅',
            FuzhouHuaPaiDef.isHuaPai(301) === true,
            '梅应该是花牌'
        );
        
        this.assert(
            '花牌判断-兰',
            FuzhouHuaPaiDef.isHuaPai(302) === true,
            '兰应该是花牌'
        );
        
        this.assert(
            '花牌判断-竹',
            FuzhouHuaPaiDef.isHuaPai(303) === true,
            '竹应该是花牌'
        );
        
        this.assert(
            '花牌判断-菊',
            FuzhouHuaPaiDef.isHuaPai(304) === true,
            '菊应该是花牌'
        );
        
        this.assert(
            '花牌判断-春',
            FuzhouHuaPaiDef.isHuaPai(305) === true,
            '春应该是花牌'
        );
        
        this.assert(
            '花牌判断-夏',
            FuzhouHuaPaiDef.isHuaPai(306) === true,
            '夏应该是花牌'
        );
        
        this.assert(
            '花牌判断-秋',
            FuzhouHuaPaiDef.isHuaPai(307) === true,
            '秋应该是花牌'
        );
        
        this.assert(
            '花牌判断-冬',
            FuzhouHuaPaiDef.isHuaPai(308) === true,
            '冬应该是花牌'
        );
        
        // 测试非花牌
        this.assert(
            '非花牌-一万',
            FuzhouHuaPaiDef.isHuaPai(21) === false,
            '一万不应该是花牌'
        );
        
        this.assert(
            '非花牌-红中',
            FuzhouHuaPaiDef.isHuaPai(126) === false,
            '红中不应该是花牌'
        );
        
        // 测试花牌名称
        this.assert(
            '花牌名称-梅',
            FuzhouHuaPaiDef.getHuaName(301) === '梅',
            '梅的名称应该是梅'
        );
        
        this.assert(
            '花牌名称-春',
            FuzhouHuaPaiDef.getHuaName(305) === '春',
            '春的名称应该是春'
        );
        
        // 测试花牌分组
        this.assert(
            '花牌分组-梅兰竹菊',
            FuzhouHuaPaiDef.isMeiLanZhuJu(301) === true,
            '梅应该属于梅兰竹菊组'
        );
        
        this.assert(
            '花牌分组-春夏秋冬',
            FuzhouHuaPaiDef.isChunXiaQiuDong(305) === true,
            '春应该属于春夏秋冬组'
        );
    }

    /**
     * 测试金牌定义
     */
    private testGoldTileDef(): void {
        console.log('测试金牌定义...');
        
        // 设置金牌
        FuzhouGoldTileDef.setGoldTile(21); // 一万作为金牌
        
        // 测试金牌判断
        this.assert(
            '金牌判断-一万',
            FuzhouGoldTileDef.isGoldTile(21) === true,
            '一万应该是金牌'
        );
        
        this.assert(
            '金牌判断-二万',
            FuzhouGoldTileDef.isGoldTile(22) === false,
            '二万不应该是金牌'
        );
        
        // 测试金牌替代
        this.assert(
            '金牌替代-二万',
            FuzhouGoldTileDef.canReplace(22) === true,
            '金牌应该可以替代二万'
        );
        
        this.assert(
            '金牌替代-花牌',
            FuzhouGoldTileDef.canReplace(301) === false,
            '金牌不应该可以替代花牌'
        );
        
        // 测试金牌数量统计
        let oHand = [21, 21, 22, 23, 24, 25, 26, 27, 28, 29, 41, 42, 43];
        this.assert(
            '金牌数量统计',
            FuzhouGoldTileDef.countGoldInHand(oHand) === 2,
            '应该有2张金牌'
        );
        
        // 测试三金倒
        let oHand2 = [21, 21, 21, 22, 23, 24, 25, 26, 27, 28, 29, 41, 42];
        this.assert(
            '三金倒判断',
            FuzhouGoldTileDef.isSanJinDao(oHand2) === true,
            '应该判断为三金倒'
        );
        
        // 测试金雀
        this.assert(
            '金雀判断',
            FuzhouGoldTileDef.isJinQue(oHand) === true,
            '应该判断为金雀'
        );
        
        // 测试金龙
        this.assert(
            '金龙判断',
            FuzhouGoldTileDef.isJinLong(oHand2) === true,
            '应该判断为金龙'
        );
    }

    /**
     * 测试胡牌算法
     */
    private testHuFormula(): void {
        console.log('测试胡牌算法...');
        
        // 设置金牌
        FuzhouGoldTileDef.setGoldTile(21);
        
        // 测试普通胡牌
        let oHand1 = [22, 23, 24, 25, 26, 27, 28, 29, 41, 42, 43, 44, 45];
        this.assert(
            '普通胡牌测试',
            FuzhouHuFormula.test(oHand1, 22) === true,
            '应该可以胡牌'
        );
        
        // 测试七小对
        let oHand2 = [22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28];
        this.assert(
            '七小对测试',
            FuzhouHuFormula.test(oHand2, 28) === true,
            '应该可以胡七小对'
        );
        
        // 测试金牌替代胡牌
        let oHand3 = [21, 22, 23, 24, 25, 26, 27, 28, 29, 41, 42, 43, 44];
        this.assert(
            '金牌替代胡牌测试',
            FuzhouHuFormula.test(oHand3, 21) === true,
            '金牌应该可以替代胡牌'
        );
        
        // 测试获取可胡牌列表
        let oCanHu = FuzhouHuFormula.getCanHuMahjongArray(oHand1);
        this.assert(
            '获取可胡牌列表',
            oCanHu !== null && oCanHu.length > 0,
            '应该返回可胡牌列表'
        );
    }

    /**
     * 测试牌型定义
     */
    private testPatternDef(): void {
        console.log('测试牌型定义...');
        
        // 测试牌型名称
        this.assert(
            '牌型名称-平胡',
            FuzhouPatternDef.getPatternName(1) === '平胡',
            '平胡名称正确'
        );
        
        this.assert(
            '牌型名称-自摸',
            FuzhouPatternDef.getPatternName(1002) === '自摸',
            '自摸名称正确'
        );
        
        this.assert(
            '牌型名称-天胡',
            FuzhouPatternDef.getPatternName(2002) === '天胡',
            '天胡名称正确'
        );
        
        // 测试牌型分数
        this.assert(
            '牌型分数-天胡',
            FuzhouPatternDef.getPatternScore(2002) === 30,
            '天胡应该是30分'
        );
        
        this.assert(
            '牌型分数-清一色',
            FuzhouPatternDef.getPatternScore(2013) === 240,
            '清一色应该是240分'
        );
        
        // 测试牌型描述
        let oPatterns = [1002, 2002, 2013];
        this.assert(
            '牌型描述',
            FuzhouPatternDef.getPatternDesc(oPatterns) === '清一色',
            '应该返回最高分牌型'
        );
    }

    /**
     * 测试规则设置
     */
    private testRuleSetting(): void {
        console.log('测试规则设置...');
        
        let oRuleSetting = new FuzhouRuleSetting([
            { key: FuzhouRuleSetting.KEY_MAX_PLAYER, val: 4 },
            { key: FuzhouRuleSetting.KEY_MAX_ROUND, val: 8 },
            { key: FuzhouRuleSetting.KEY_ENABLE_HUA_PAI, val: 1 },
            { key: FuzhouRuleSetting.KEY_ENABLE_GOLD_TILE, val: 1 },
            { key: FuzhouRuleSetting.KEY_ENABLE_FUZHOU_RULE, val: 1 },
        ]);
        
        // 测试最大玩家数
        this.assert(
            '最大玩家数',
            oRuleSetting.getMaxPlayer() === 4,
            '应该是4人'
        );
        
        // 测试最大局数
        this.assert(
            '最大局数',
            oRuleSetting.getMaxRound() === 8,
            '应该是8局'
        );
        
        // 测试花牌开关
        this.assert(
            '花牌开关',
            oRuleSetting.isEnableHuaPai() === true,
            '应该启用花牌'
        );
        
        // 测试金牌开关
        this.assert(
            '金牌开关',
            oRuleSetting.isEnableGoldTile() === true,
            '应该启用金牌'
        );
        
        // 测试福州规则开关
        this.assert(
            '福州规则开关',
            oRuleSetting.isEnableFuzhouRule() === true,
            '应该启用福州规则'
        );
        
        // 测试规则描述
        let strDesc = oRuleSetting.getRuleDesc();
        this.assert(
            '规则描述',
            strDesc.includes('4人') && strDesc.includes('8局'),
            '规则描述应该包含人数和局数'
        );
    }

    /**
     * 断言
     * 
     * @param strName 测试名称
     * @param bCondition 条件
     * @param strMessage 错误消息
     */
    private assert(strName: string, bCondition: boolean, strMessage: string): void {
        let oResult: TestResult = {
            name: strName,
            passed: bCondition,
            message: strMessage,
        };
        
        this._oResults.push(oResult);
        
        if (!bCondition) {
            console.error(`❌ ${strName}: ${strMessage}`);
        } else {
            console.log(`✅ ${strName}`);
        }
    }

    /**
     * 打印测试结果
     */
    private printResults(): void {
        let nPassed = 0;
        let nFailed = 0;
        
        for (let oResult of this._oResults) {
            if (oResult.passed) {
                nPassed++;
            } else {
                nFailed++;
            }
        }
        
        console.log('\n=== 测试结果 ===');
        console.log(`总计: ${this._oResults.length}`);
        console.log(`通过: ${nPassed}`);
        console.log(`失败: ${nFailed}`);
        console.log(`通过率: ${((nPassed / this._oResults.length) * 100).toFixed(2)}%`);
        
        if (nFailed > 0) {
            console.log('\n失败的测试:');
            for (let oResult of this._oResults) {
                if (!oResult.passed) {
                    console.log(`  - ${oResult.name}: ${oResult.message}`);
                }
            }
        }
    }

    /**
     * 获取测试结果
     * 
     * @return 测试结果
     */
    getResults(): Array<TestResult> {
        return this._oResults;
    }
}
