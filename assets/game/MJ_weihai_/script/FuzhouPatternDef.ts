/**
 * 福州麻将牌型定义
 * 包含福州特有的牌型和计分规则
 */

/**
 * 福州麻将牌型定义
 */
export default class FuzhouPatternDef {
    /**
     * 私有化类默认构造器
     */
    private constructor() {
        throw new Error("该类不能实例化");
    }

    // 基础牌型
    /** 平胡 */
    static readonly PING_HU: number = 1;
    /** 自摸 */
    static readonly ZI_MO: number = 1002;
    /** 点炮 */
    static readonly DIAN_PAO: number = 1003;

    // 特殊牌型
    /** 一枝花 */
    static readonly YI_ZHI_HUA: number = 2001;
    /** 天胡 */
    static readonly TIAN_HU: number = 2002;
    /** 抢金 */
    static readonly QIANG_JIN: number = 2003;
    /** 无花无杠 */
    static readonly WU_HUA_WU_GANG: number = 2004;
    /** 一水胡 */
    static readonly YI_SHUI_HU: number = 2005;
    /** 三金倒 */
    static readonly SAN_JIN_DAO: number = 2006;
    /** 单钓 */
    static readonly DAN_DIAO: number = 2007;
    /** 花胡 */
    static readonly HUA_HU: number = 2008;
    /** 金雀 */
    static readonly JIN_QUE: number = 2009;
    /** 金坎 */
    static readonly JIN_KAN: number = 2010;
    /** 金龙 */
    static readonly JIN_LONG: number = 2011;
    /** 混一色 */
    static readonly HUN_YI_SE: number = 2012;
    /** 清一色 */
    static readonly QING_YI_SE: number = 2013;

    // 人类语言字典
    private static readonly HUMAN_LANGUAGE_DICT: { [key: number]: string } = {
        1: "平胡",
        1002: "自摸",
        1003: "点炮",
        2001: "一枝花",
        2002: "天胡",
        2003: "抢金",
        2004: "无花无杠",
        2005: "一水胡",
        2006: "三金倒",
        2007: "单钓",
        2008: "花胡",
        2009: "金雀",
        2010: "金坎",
        2011: "金龙",
        2012: "混一色",
        2013: "清一色",
    };

    // 牌型分数
    private static readonly PATTERN_SCORES: { [key: number]: number } = {
        1: 0,       // 平胡（基础分）
        2001: 15,   // 一枝花
        2002: 30,   // 天胡
        2003: 30,   // 抢金
        2004: 30,   // 无花无杠
        2005: 30,   // 一水胡
        2006: 40,   // 三金倒
        2007: 40,   // 单钓
        2008: 50,   // 花胡
        2009: 60,   // 金雀
        2010: 60,   // 金坎
        2011: 120,  // 金龙
        2012: 120,  // 混一色
        2013: 240,  // 清一色
    };

    /**
     * 获取牌型名称
     * 
     * @param nPattern 牌型值
     * @return 牌型名称
     */
    static getPatternName(nPattern: number): string {
        return FuzhouPatternDef.HUMAN_LANGUAGE_DICT[nPattern] || '';
    }

    /**
     * 获取牌型分数
     * 
     * @param nPattern 牌型值
     * @return 牌型分数
     */
    static getPatternScore(nPattern: number): number {
        return FuzhouPatternDef.PATTERN_SCORES[nPattern] || 0;
    }

    /**
     * 获取牌型描述
     * 
     * @param oPatternArray 牌型数组
     * @return 牌型描述
     */
    static getPatternDesc(oPatternArray: Array<number>): string {
        if (!oPatternArray || oPatternArray.length === 0) {
            return '平胡';
        }

        // 找到最高分的牌型
        let nMaxScore = 0;
        let nMaxPattern = 1;

        for (let nPattern of oPatternArray) {
            let nScore = FuzhouPatternDef.getPatternScore(nPattern);
            if (nScore > nMaxScore) {
                nMaxScore = nScore;
                nMaxPattern = nPattern;
            }
        }

        return FuzhouPatternDef.getPatternName(nMaxPattern);
    }

    /**
     * 获取所有牌型描述
     * 
     * @param oPatternArray 牌型数组
     * @return 所有牌型描述
     */
    static getAllPatternDesc(oPatternArray: Array<number>): string {
        if (!oPatternArray || oPatternArray.length === 0) {
            return '平胡';
        }

        let oNames: Array<string> = [];
        for (let nPattern of oPatternArray) {
            let strName = FuzhouPatternDef.getPatternName(nPattern);
            if (strName) {
                oNames.push(strName);
            }
        }

        return oNames.join(', ') || '平胡';
    }

    /**
     * 检查是否包含指定牌型
     * 
     * @param oPatternArray 牌型数组
     * @param nPattern 要检查的牌型
     * @return true = 包含, false = 不包含
     */
    static hasPattern(oPatternArray: Array<number>, nPattern: number): boolean {
        if (!oPatternArray) {
            return false;
        }
        return oPatternArray.includes(nPattern);
    }

    /**
     * 获取最高分牌型
     * 
     * @param oPatternArray 牌型数组
     * @return 最高分牌型
     */
    static getMaxScorePattern(oPatternArray: Array<number>): number {
        if (!oPatternArray || oPatternArray.length === 0) {
            return 1; // 平胡
        }

        let nMaxScore = 0;
        let nMaxPattern = 1;

        for (let nPattern of oPatternArray) {
            let nScore = FuzhouPatternDef.getPatternScore(nPattern);
            if (nScore > nMaxScore) {
                nMaxScore = nScore;
                nMaxPattern = nPattern;
            }
        }

        return nMaxPattern;
    }
}
