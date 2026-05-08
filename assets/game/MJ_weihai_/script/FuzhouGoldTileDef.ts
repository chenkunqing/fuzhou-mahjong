/**
 * 福州麻将金牌（百搭牌）定义
 * 金牌可以替代任何非花牌
 */

import MahjongTileDef from "./MahjongTileDef";
import FuzhouHuaPaiDef from "./FuzhouHuaPaiDef";

/**
 * 福州麻将金牌定义
 */
export default class FuzhouGoldTileDef {
    /** 当前金牌数值 */
    private static _nGoldTile: number = -1;

    /**
     * 私有化类默认构造器
     */
    private constructor() {
        throw new Error("该类不能实例化");
    }

    /**
     * 设置金牌
     * 
     * @param nTile 金牌数值
     */
    static setGoldTile(nTile: number): void {
        FuzhouGoldTileDef._nGoldTile = nTile;
    }

    /**
     * 获取金牌数值
     * 
     * @return 金牌数值
     */
    static getGoldTile(): number {
        return FuzhouGoldTileDef._nGoldTile;
    }

    /**
     * 是否是金牌
     * 
     * @param nTile 麻将牌数值
     * @return true = 是金牌, false = 不是金牌
     */
    static isGoldTile(nTile: number): boolean {
        return nTile === FuzhouGoldTileDef._nGoldTile;
    }

    /**
     * 金牌是否可以替代指定牌
     * 金牌可以替代任何非花牌
     * 
     * @param nTile 要替代的牌
     * @return true = 可以替代, false = 不能替代
     */
    static canReplace(nTile: number): boolean {
        // 金牌不能替代花牌
        if (FuzhouHuaPaiDef.isHuaPai(nTile)) {
            return false;
        }
        // 金牌不能替代自己
        if (FuzhouGoldTileDef.isGoldTile(nTile)) {
            return false;
        }
        return true;
    }

    /**
     * 获取金牌可以替代的所有牌
     * 
     * @return 可以替代的牌数组
     */
    static getReplaceableTiles(): Array<number> {
        const oResult: Array<number> = [];
        
        // 万条饼
        for (let nTile of MahjongTileDef.VALUE_ARRAY) {
            if (FuzhouGoldTileDef.canReplace(nTile)) {
                oResult.push(nTile);
            }
        }
        
        return oResult;
    }

    /**
     * 检查手牌中金牌的数量
     * 
     * @param oMahjongInHand 手牌列表
     * @return 金牌数量
     */
    static countGoldInHand(oMahjongInHand: Array<number>): number {
        let nCount = 0;
        for (let nTile of oMahjongInHand) {
            if (FuzhouGoldTileDef.isGoldTile(nTile)) {
                nCount++;
            }
        }
        return nCount;
    }

    /**
     * 检查是否是三金倒（3张金牌）
     * 
     * @param oMahjongInHand 手牌列表
     * @return true = 是三金倒, false = 不是
     */
    static isSanJinDao(oMahjongInHand: Array<number>): boolean {
        return FuzhouGoldTileDef.countGoldInHand(oMahjongInHand) >= 3;
    }

    /**
     * 检查是否是金雀（2张金牌做对子）
     * 
     * @param oMahjongInHand 手牌列表
     * @return true = 是金雀, false = 不是
     */
    static isJinQue(oMahjongInHand: Array<number>): boolean {
        return FuzhouGoldTileDef.countGoldInHand(oMahjongInHand) >= 2;
    }

    /**
     * 检查是否是金龙（3张金牌做刻子）
     * 
     * @param oMahjongInHand 手牌列表
     * @return true = 是金龙, false = 不是
     */
    static isJinLong(oMahjongInHand: Array<number>): boolean {
        return FuzhouGoldTileDef.countGoldInHand(oMahjongInHand) >= 3;
    }
}
