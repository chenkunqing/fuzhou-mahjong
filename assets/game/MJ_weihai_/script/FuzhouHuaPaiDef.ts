/**
 * 福州麻将花牌定义
 * 包括：梅兰竹菊春夏秋冬
 */

/**
 * 花牌花色
 */
const SUIT_HUA = 300;

/**
 * 福州麻将花牌定义
 */
export default class FuzhouHuaPaiDef {
    /** 遮挡值 */
    static readonly MASK_VAL: number = 7;

    /** 梅 */
    static readonly HUA_MEI: number = 301;
    /** 兰 */
    static readonly HUA_LAN: number = 302;
    /** 竹 */
    static readonly HUA_ZHU: number = 303;
    /** 菊 */
    static readonly HUA_JU: number = 304;
    /** 春 */
    static readonly HUA_CHUN: number = 305;
    /** 夏 */
    static readonly HUA_XIA: number = 306;
    /** 秋 */
    static readonly HUA_QIU: number = 307;
    /** 冬 */
    static readonly HUA_DONG: number = 308;

    /** 花牌数值数组 */
    static readonly HUA_ARRAY: Array<number> = [
        FuzhouHuaPaiDef.HUA_MEI,
        FuzhouHuaPaiDef.HUA_LAN,
        FuzhouHuaPaiDef.HUA_ZHU,
        FuzhouHuaPaiDef.HUA_JU,
        FuzhouHuaPaiDef.HUA_CHUN,
        FuzhouHuaPaiDef.HUA_XIA,
        FuzhouHuaPaiDef.HUA_QIU,
        FuzhouHuaPaiDef.HUA_DONG,
    ];

    /** 花牌名称映射 */
    static readonly HUA_NAMES: { [key: number]: string } = {
        301: '梅',
        302: '兰',
        303: '竹',
        304: '菊',
        305: '春',
        306: '夏',
        307: '秋',
        308: '冬',
    };

    /**
     * 私有化类默认构造器
     */
    private constructor() {
        throw new Error("该类不能实例化");
    }

    /**
     * 是否是花牌
     * 
     * @param nVal 麻将牌数值
     * @return true = 是花牌, false = 不是花牌
     */
    static isHuaPai(nVal: number): boolean {
        return FuzhouHuaPaiDef.HUA_ARRAY.includes(nVal);
    }

    /**
     * 获取花牌名称
     * 
     * @param nVal 花牌数值
     * @return 花牌名称
     */
    static getHuaName(nVal: number): string {
        return FuzhouHuaPaiDef.HUA_NAMES[nVal] || '';
    }

    /**
     * 获取花牌花色
     * 
     * @param nVal 麻将牌数值
     * @return 花牌花色
     */
    static getSuit(nVal: number): number {
        if (FuzhouHuaPaiDef.isHuaPai(nVal)) {
            return SUIT_HUA;
        }
        return -1;
    }

    /**
     * 是否是梅兰竹菊
     * 
     * @param nVal 麻将牌数值
     * @return true = 是梅兰竹菊, false = 不是
     */
    static isMeiLanZhuJu(nVal: number): boolean {
        return nVal >= 301 && nVal <= 304;
    }

    /**
     * 是否是春夏秋冬
     * 
     * @param nVal 麻将牌数值
     * @return true = 是春夏秋冬, false = 不是
     */
    static isChunXiaQiuDong(nVal: number): boolean {
        return nVal >= 305 && nVal <= 308;
    }

    /**
     * 获取花牌组（梅兰竹菊或春夏秋冬）
     * 
     * @param nVal 花牌数值
     * @return 花牌组
     */
    static getHuaGroup(nVal: number): Array<number> {
        if (FuzhouHuaPaiDef.isMeiLanZhuJu(nVal)) {
            return [301, 302, 303, 304];
        } else if (FuzhouHuaPaiDef.isChunXiaQiuDong(nVal)) {
            return [305, 306, 307, 308];
        }
        return [];
    }
}
