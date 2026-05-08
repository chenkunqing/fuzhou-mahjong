/**
 * 福州麻将AI管理器
 * 处理AI玩家的决策逻辑
 */

import MahjongTileDef from "./MahjongTileDef";
import FuzhouGoldTileDef from "./FuzhouGoldTileDef";
import FuzhouHuFormula from "./FuzhouHuFormula";

/**
 * AI难度
 */
export enum AIDifficulty {
    EASY = 0,       // 简单
    MEDIUM = 1,     // 中等
    HARD = 2,       // 困难
}

/**
 * AI决策
 */
export interface AIDecision {
    /** 操作类型 */
    action: 'discard' | 'chi' | 'peng' | 'gang' | 'hu' | 'pass';
    /** 牌值 */
    tile?: number;
    /** 吃牌组合 */
    combo?: Array<number>;
    /** 杠类型 */
    gangType?: number;
}

/**
 * 福州麻将AI管理器
 */
export default class FuzhouAIManager {
    /** 单例实例 */
    private static _oInstance: FuzhouAIManager = null;
    
    /** AI难度 */
    private _nDifficulty: AIDifficulty = AIDifficulty.MEDIUM;

    /**
     * 私有化类默认构造器
     */
    private constructor() {
    }

    /**
     * 获取单例实例
     * 
     * @return 单例实例
     */
    static getInstance(): FuzhouAIManager {
        if (!FuzhouAIManager._oInstance) {
            FuzhouAIManager._oInstance = new FuzhouAIManager();
        }
        return FuzhouAIManager._oInstance;
    }

    /**
     * 设置AI难度
     * 
     * @param difficulty 难度
     */
    setDifficulty(difficulty: AIDifficulty): void {
        this._nDifficulty = difficulty;
    }

    /**
     * 获取AI难度
     * 
     * @return 难度
     */
    getDifficulty(): AIDifficulty {
        return this._nDifficulty;
    }

    /**
     * AI决策出牌
     * 
     * @param hand 手牌
     * @param goldTile 金牌
     * @return 决策
     */
    decideDiscard(hand: Array<number>, goldTile: number): AIDecision {
        if (hand.length === 0) {
            return { action: 'pass' };
        }
        
        // 根据难度选择策略
        switch (this._nDifficulty) {
            case AIDifficulty.EASY:
                return this.decideDiscardEasy(hand, goldTile);
            case AIDifficulty.MEDIUM:
                return this.decideDiscardMedium(hand, goldTile);
            case AIDifficulty.HARD:
                return this.decideDiscardHard(hand, goldTile);
            default:
                return this.decideDiscardMedium(hand, goldTile);
        }
    }

    /**
     * 简单AI出牌决策
     * 
     * @param hand 手牌
     * @param goldTile 金牌
     * @return 决策
     */
    private decideDiscardEasy(hand: Array<number>, goldTile: number): AIDecision {
        // 随机出牌
        let randomIndex = Math.floor(Math.random() * hand.length);
        return { action: 'discard', tile: hand[randomIndex] };
    }

    /**
     * 中等AI出牌决策
     * 
     * @param hand 手牌
     * @param goldTile 金牌
     * @return 决策
     */
    private decideDiscardMedium(hand: Array<number>, goldTile: number): AIDecision {
        // 优先不出金牌
        let nonGoldTiles = hand.filter(t => t !== goldTile);
        if (nonGoldTiles.length > 0) {
            // 找出最没用的牌
            let bestTile = this.findLeastUsefulTile(nonGoldTiles, goldTile);
            return { action: 'discard', tile: bestTile };
        }
        
        // 只能出金牌
        return { action: 'discard', tile: hand[0] };
    }

    /**
     * 困难AI出牌决策
     * 
     * @param hand 手牌
     * @param goldTile 金牌
     * @return 决策
     */
    private decideDiscardHard(hand: Array<number>, goldTile: number): AIDecision {
        // 优先不出金牌
        let nonGoldTiles = hand.filter(t => t !== goldTile);
        if (nonGoldTiles.length > 0) {
            // 找出最没用的牌
            let bestTile = this.findLeastUsefulTile(nonGoldTiles, goldTile);
            return { action: 'discard', tile: bestTile };
        }
        
        // 只能出金牌
        return { action: 'discard', tile: hand[0] };
    }

    /**
     * 找出最没用的牌
     * 
     * @param hand 手牌
     * @param goldTile 金牌
     * @return 最没用的牌
     */
    private findLeastUsefulTile(hand: Array<number>, goldTile: number): number {
        let scores: Map<number, number> = new Map();
        
        // 计算每张牌的价值
        for (let tile of hand) {
            let score = this.calculateTileValue(tile, hand, goldTile);
            scores.set(tile, score);
        }
        
        // 找出价值最低的牌
        let minScore = Infinity;
        let minTile = hand[0];
        
        for (let [tile, score] of scores) {
            if (score < minScore) {
                minScore = score;
                minTile = tile;
            }
        }
        
        return minTile;
    }

    /**
     * 计算牌的价值
     * 
     * @param tile 牌值
     * @param hand 手牌
     * @param goldTile 金牌
     * @return 价值
     */
    private calculateTileValue(tile: number, hand: Array<number>, goldTile: number): number {
        let value = 0;
        
        // 统计相同牌数量
        let sameCount = hand.filter(t => t === tile).length;
        value += sameCount * 10;
        
        // 检查是否能组成顺子
        if (MahjongTileDef.isWanTiaoBing(tile)) {
            let suit = MahjongTileDef.getSuit(tile);
            let num = tile % 10;
            
            // 检查相邻牌
            if (num > 1) {
                let prevTile = suit * 10 + num - 1;
                if (hand.includes(prevTile)) {
                    value += 5;
                }
            }
            
            if (num < 9) {
                let nextTile = suit * 10 + num + 1;
                if (hand.includes(nextTile)) {
                    value += 5;
                }
            }
            
            // 检查间隔牌
            if (num > 2) {
                let prevTile2 = suit * 10 + num - 2;
                if (hand.includes(prevTile2)) {
                    value += 2;
                }
            }
            
            if (num < 8) {
                let nextTile2 = suit * 10 + num + 2;
                if (hand.includes(nextTile2)) {
                    value += 2;
                }
            }
        }
        
        // 检查是否是字牌
        if (MahjongTileDef.isFeng(tile) || MahjongTileDef.isJian(tile)) {
            value += 3;
        }
        
        return value;
    }

    /**
     * AI决策吃牌
     * 
     * @param hand 手牌
     * @param tile 吃的牌
     * @param goldTile 金牌
     * @return 决策
     */
    decideChi(hand: Array<number>, tile: number, goldTile: number): AIDecision {
        // 检查是否能吃
        let combos = this.getChiCombos(hand, tile);
        if (combos.length === 0) {
            return { action: 'pass' };
        }
        
        // 简单策略：吃牌
        return { action: 'chi', tile: tile, combo: combos[0] };
    }

    /**
     * 获取吃牌组合
     * 
     * @param hand 手牌
     * @param tile 吃的牌
     * @return 吃牌组合
     */
    private getChiCombos(hand: Array<number>, tile: number): Array<Array<number>> {
        let combos: Array<Array<number>> = [];
        
        if (!MahjongTileDef.isWanTiaoBing(tile)) {
            return combos;
        }
        
        let suit = MahjongTileDef.getSuit(tile);
        let num = tile % 10;
        
        // 检查三种顺子组合
        if (num >= 3) {
            let t1 = suit * 10 + num - 2;
            let t2 = suit * 10 + num - 1;
            if (hand.includes(t1) && hand.includes(t2)) {
                combos.push([t1, t2]);
            }
        }
        
        if (num >= 2 && num <= 8) {
            let t1 = suit * 10 + num - 1;
            let t2 = suit * 10 + num + 1;
            if (hand.includes(t1) && hand.includes(t2)) {
                combos.push([t1, t2]);
            }
        }
        
        if (num <= 7) {
            let t1 = suit * 10 + num + 1;
            let t2 = suit * 10 + num + 2;
            if (hand.includes(t1) && hand.includes(t2)) {
                combos.push([t1, t2]);
            }
        }
        
        return combos;
    }

    /**
     * AI决策碰牌
     * 
     * @param hand 手牌
     * @param tile 碰的牌
     * @param goldTile 金牌
     * @return 决策
     */
    decidePeng(hand: Array<number>, tile: number, goldTile: number): AIDecision {
        // 检查是否能碰
        let sameCount = hand.filter(t => t === tile).length;
        if (sameCount < 2) {
            return { action: 'pass' };
        }
        
        // 简单策略：碰牌
        return { action: 'peng', tile: tile };
    }

    /**
     * AI决策杠牌
     * 
     * @param hand 手牌
     * @param tile 杠的牌
     * @param goldTile 金牌
     * @return 决策
     */
    decideGang(hand: Array<number>, tile: number, goldTile: number): AIDecision {
        // 检查是否能杠
        let sameCount = hand.filter(t => t === tile).length;
        if (sameCount < 3) {
            return { action: 'pass' };
        }
        
        // 简单策略：杠牌
        return { action: 'gang', tile: tile, gangType: 0 };
    }

    /**
     * AI决策胡牌
     * 
     * @param hand 手牌
     * @param tile 胡的牌
     * @param goldTile 金牌
     * @return 决策
     */
    decideHu(hand: Array<number>, tile: number, goldTile: number): AIDecision {
        // 检查是否能胡
        if (FuzhouHuFormula.test(hand, tile)) {
            return { action: 'hu', tile: tile };
        }
        
        return { action: 'pass' };
    }
}
