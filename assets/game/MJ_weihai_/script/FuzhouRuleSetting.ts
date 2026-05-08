/**
 * 福州麻将规则设置
 * 包含福州麻将的特殊规则配置
 */

/**
 * 福州麻将规则设置
 */
export default class FuzhouRuleSetting {
    /** 内置字典 */
    private _oInnerMap: { [nKey: number]: number } = {};

    /** 规则关键字定义 */
    static readonly KEY_MAX_PLAYER: number = 1001;           // 最大玩家数
    static readonly KEY_MAX_ROUND: number = 1002;            // 最大局数
    static readonly KEY_MAX_CIRCLE: number = 1003;           // 最大圈数
    static readonly KEY_ENABLE_HUA_PAI: number = 2001;       // 启用花牌
    static readonly KEY_ENABLE_GOLD_TILE: number = 2002;     // 启用金牌
    static readonly KEY_ENABLE_FUZHOU_RULE: number = 2003;   // 启用福州规则
    static readonly KEY_ENABLE_ZI_MO: number = 2004;         // 启用自摸
    static readonly KEY_ENABLE_DIAN_PAO: number = 2005;      // 启用点炮
    static readonly KEY_ENABLE_TIAN_HU: number = 2006;       // 启用天胡
    static readonly KEY_ENABLE_QIANG_JIN: number = 2007;     // 启用抢金
    static readonly KEY_ENABLE_SAN_JIN_DAO: number = 2008;   // 启用三金倒
    static readonly KEY_ENABLE_JIN_QUE: number = 2009;       // 启用金雀
    static readonly KEY_ENABLE_JIN_LONG: number = 2010;      // 启用金龙
    static readonly KEY_BASE_SCORE: number = 3001;           // 基础分
    static readonly KEY_ENABLE_MULTI_HU: number = 3002;      // 启用一炮多响

    /**
     * 类参数构造器
     * 
     * @param oRuleItemArray 规则条目数组
     */
    constructor(oRuleItemArray: Array<{ key?: number, val?: number }>) {
        if (!Array.isArray(oRuleItemArray)) {
            return;
        }

        for (let oRuleItem of oRuleItemArray) {
            if (null != oRuleItem) {
                this._oInnerMap[oRuleItem.key] = oRuleItem.val;
            }
        }
    }

    /**
     * 获取最大玩家数量
     * 
     * @return 最大玩家数量
     */
    getMaxPlayer(): number {
        return this._oInnerMap[FuzhouRuleSetting.KEY_MAX_PLAYER] || 4;
    }

    /**
     * 获取最大局数
     * 
     * @return 最大局数
     */
    getMaxRound(): number {
        return this._oInnerMap[FuzhouRuleSetting.KEY_MAX_ROUND] || 8;
    }

    /**
     * 获取最大圈数
     * 
     * @return 最大圈数
     */
    getMaxCircle(): number {
        return this._oInnerMap[FuzhouRuleSetting.KEY_MAX_CIRCLE] || 1;
    }

    /**
     * 是否启用花牌
     * 
     * @return true = 启用, false = 禁用
     */
    isEnableHuaPai(): boolean {
        return this._oInnerMap[FuzhouRuleSetting.KEY_ENABLE_HUA_PAI] === 1;
    }

    /**
     * 是否启用金牌
     * 
     * @return true = 启用, false = 禁用
     */
    isEnableGoldTile(): boolean {
        return this._oInnerMap[FuzhouRuleSetting.KEY_ENABLE_GOLD_TILE] === 1;
    }

    /**
     * 是否启用福州规则
     * 
     * @return true = 启用, false = 禁用
     */
    isEnableFuzhouRule(): boolean {
        return this._oInnerMap[FuzhouRuleSetting.KEY_ENABLE_FUZHOU_RULE] === 1;
    }

    /**
     * 是否启用自摸
     * 
     * @return true = 启用, false = 禁用
     */
    isEnableZiMo(): boolean {
        return this._oInnerMap[FuzhouRuleSetting.KEY_ENABLE_ZI_MO] === 1;
    }

    /**
     * 是否启用点炮
     * 
     * @return true = 启用, false = 禁用
     */
    isEnableDianPao(): boolean {
        return this._oInnerMap[FuzhouRuleSetting.KEY_ENABLE_DIAN_PAO] === 1;
    }

    /**
     * 是否启用天胡
     * 
     * @return true = 启用, false = 禁用
     */
    isEnableTianHu(): boolean {
        return this._oInnerMap[FuzhouRuleSetting.KEY_ENABLE_TIAN_HU] === 1;
    }

    /**
     * 是否启用抢金
     * 
     * @return true = 启用, false = 禁用
     */
    isEnableQiangJin(): boolean {
        return this._oInnerMap[FuzhouRuleSetting.KEY_ENABLE_QIANG_JIN] === 1;
    }

    /**
     * 是否启用三金倒
     * 
     * @return true = 启用, false = 禁用
     */
    isEnableSanJinDao(): boolean {
        return this._oInnerMap[FuzhouRuleSetting.KEY_ENABLE_SAN_JIN_DAO] === 1;
    }

    /**
     * 是否启用金雀
     * 
     * @return true = 启用, false = 禁用
     */
    isEnableJinQue(): boolean {
        return this._oInnerMap[FuzhouRuleSetting.KEY_ENABLE_JIN_QUE] === 1;
    }

    /**
     * 是否启用金龙
     * 
     * @return true = 启用, false = 禁用
     */
    isEnableJinLong(): boolean {
        return this._oInnerMap[FuzhouRuleSetting.KEY_ENABLE_JIN_LONG] === 1;
    }

    /**
     * 获取基础分
     * 
     * @return 基础分
     */
    getBaseScore(): number {
        return this._oInnerMap[FuzhouRuleSetting.KEY_BASE_SCORE] || 1;
    }

    /**
     * 是否启用一炮多响
     * 
     * @return true = 启用, false = 禁用
     */
    isEnableMultiHu(): boolean {
        return this._oInnerMap[FuzhouRuleSetting.KEY_ENABLE_MULTI_HU] === 1;
    }

    /**
     * 获取规则描述
     * 
     * @return 规则描述
     */
    getRuleDesc(): string {
        let oDescs: Array<string> = [];

        oDescs.push(`${this.getMaxPlayer()}人`);
        oDescs.push(`${this.getMaxRound()}局`);

        if (this.isEnableHuaPai()) {
            oDescs.push('花牌');
        }
        if (this.isEnableGoldTile()) {
            oDescs.push('金牌');
        }
        if (this.isEnableFuzhouRule()) {
            oDescs.push('福州规则');
        }
        if (this.isEnableZiMo()) {
            oDescs.push('自摸');
        }
        if (this.isEnableDianPao()) {
            oDescs.push('点炮');
        }
        if (this.isEnableTianHu()) {
            oDescs.push('天胡');
        }
        if (this.isEnableQiangJin()) {
            oDescs.push('抢金');
        }
        if (this.isEnableSanJinDao()) {
            oDescs.push('三金倒');
        }
        if (this.isEnableJinQue()) {
            oDescs.push('金雀');
        }
        if (this.isEnableJinLong()) {
            oDescs.push('金龙');
        }

        return oDescs.join(' | ');
    }
}
