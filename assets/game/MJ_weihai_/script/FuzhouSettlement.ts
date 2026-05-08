/**
 * 福州麻将结算逻辑
 * 处理福州麻将的计分和结算
 */

import MahjongTileDef from "./MahjongTileDef";
import FuzhouHuaPaiDef from "./FuzhouHuaPaiDef";
import FuzhouGoldTileDef from "./FuzhouGoldTileDef";
import FuzhouPatternDef from "./FuzhouPatternDef";
import FuzhouRuleSetting from "./FuzhouRuleSetting";

/**
 * 结算结果
 */
export interface SettlementResult {
    /** 赢家索引 */
    winner: number;
    /** 是否自摸 */
    isZiMo: boolean;
    /** 胡的牌 */
    huTile: number;
    /** 牌型数组 */
    patterns: Array<number>;
    /** 花牌数量 */
    huaCount: number;
    /** 金牌数量 */
    goldCount: number;
    /** 杠分 */
    gangScore: number;
    /** 基础分 */
    baseScore: number;
    /** 倍数 */
    multiplier: number;
    /** 特殊牌型分 */
    specialScore: number;
    /** 总分 */
    totalScore: number;
    /** 各玩家得分 */
    playerScores: Array<number>;
    /** 牌型描述 */
    patternDesc: string;
}

/**
 * 福州麻将结算逻辑
 */
export default class FuzhouSettlement {
    /** 规则设置 */
    private _oRuleSetting: FuzhouRuleSetting;

    /**
     * 构造器
     * 
     * @param oRuleSetting 规则设置
     */
    constructor(oRuleSetting: FuzhouRuleSetting) {
        this._oRuleSetting = oRuleSetting;
    }

    /**
     * 计算结算结果
     * 
     * @param nWinner 赢家索引
     * @param nHuTile 胡的牌
     * @param bIsZiMo 是否自摸
     * @param oPlayerHands 玩家手牌
     * @param oPlayerHuaPai 玩家花牌
     * @param oPlayerMingPai 玩家明牌
     * @param nGoldTile 金牌
     * @param nLianZhuang 连庄次数
     * @return 结算结果
     */
    calculate(
        nWinner: number,
        nHuTile: number,
        bIsZiMo: boolean,
        oPlayerHands: Array<Array<number>>,
        oPlayerHuaPai: Array<Array<number>>,
        oPlayerMingPai: Array<Array<Array<number>>>,
        nGoldTile: number,
        nLianZhuang: number
    ): SettlementResult {
        // 获取赢家手牌
        let oWinnerHand = [...oPlayerHands[nWinner], nHuTile];
        
        // 检测牌型
        let oPatterns = this.detectPatterns(
            oWinnerHand,
            oPlayerHuaPai[nWinner],
            oPlayerMingPai[nWinner],
            nGoldTile,
            bIsZiMo
        );
        
        // 计算花牌分
        let nHuaCount = this.calculateHuaScore(oPlayerHuaPai[nWinner]);
        
        // 计算金牌分
        let nGoldCount = FuzhouGoldTileDef.countGoldInHand(oWinnerHand);
        
        // 计算杠分
        let nGangScore = this.calculateGangScore(oPlayerMingPai);
        
        // 计算基础分
        let nBaseScore = nHuaCount + nGoldCount + nGangScore;
        
        // 计算倍数
        let nMultiplier = bIsZiMo ? 2 : 1;
        
        // 计算特殊牌型分
        let nSpecialScore = this.calculateSpecialScore(oPatterns);
        
        // 计算总分
        let nTotalScore = nBaseScore * nMultiplier + nSpecialScore;
        
        // 计算各玩家得分
        let oPlayerScores = this.calculatePlayerScores(
            nWinner,
            nTotalScore,
            bIsZiMo,
            nLianZhuang
        );
        
        // 获取牌型描述
        let strPatternDesc = FuzhouPatternDef.getPatternDesc(oPatterns);
        
        return {
            winner: nWinner,
            isZiMo: bIsZiMo,
            huTile: nHuTile,
            patterns: oPatterns,
            huaCount: nHuaCount,
            goldCount: nGoldCount,
            gangScore: nGangScore,
            baseScore: nBaseScore,
            multiplier: nMultiplier,
            specialScore: nSpecialScore,
            totalScore: nTotalScore,
            playerScores: oPlayerScores,
            patternDesc: strPatternDesc,
        };
    }

    /**
     * 检测牌型
     * 
     * @param oHand 手牌
     * @param oHuaPai 花牌
     * @param oMingPai 明牌
     * @param nGoldTile 金牌
     * @param bIsZiMo 是否自摸
     * @return 牌型数组
     */
    private detectPatterns(
        oHand: Array<number>,
        oHuaPai: Array<number>,
        oMingPai: Array<Array<number>>,
        nGoldTile: number,
        bIsZiMo: boolean
    ): Array<number> {
        let oPatterns: Array<number> = [];
        
        // 基础牌型
        if (bIsZiMo) {
            oPatterns.push(FuzhouPatternDef.ZI_MO);
        } else {
            oPatterns.push(FuzhouPatternDef.DIAN_PAO);
        }
        
        // 一枝花
        if (oHuaPai.length === 1) {
            oPatterns.push(FuzhouPatternDef.YI_ZHI_HUA);
        }
        
        // 无花无杠
        if (oHuaPai.length === 0 && oMingPai.length === 0) {
            oPatterns.push(FuzhouPatternDef.WU_HUA_WU_GANG);
        }
        
        // 一水胡
        if (oHuaPai.length === 1 || (oMingPai.length === 1 && oHuaPai.length === 0)) {
            oPatterns.push(FuzhouPatternDef.YI_SHUI_HU);
        }
        
        // 三金倒
        if (FuzhouGoldTileDef.isSanJinDao(oHand)) {
            oPatterns.push(FuzhouPatternDef.SAN_JIN_DAO);
        }
        
        // 单钓
        if (oHand.length === 2) {
            oPatterns.push(FuzhouPatternDef.DAN_DIAO);
        }
        
        // 花胡
        if (oHuaPai.length >= 20) {
            oPatterns.push(FuzhouPatternDef.HUA_HU);
        }
        
        // 金雀
        if (FuzhouGoldTileDef.isJinQue(oHand)) {
            oPatterns.push(FuzhouPatternDef.JIN_QUE);
        }
        
        // 金坎
        if (oHand.length === 2 && FuzhouGoldTileDef.countGoldInHand(oHand) >= 1) {
            oPatterns.push(FuzhouPatternDef.JIN_KAN);
        }
        
        // 金龙
        if (FuzhouGoldTileDef.isJinLong(oHand)) {
            oPatterns.push(FuzhouPatternDef.JIN_LONG);
        }
        
        // 混一色
        if (this.isHunYiSe(oHand, oMingPai)) {
            oPatterns.push(FuzhouPatternDef.HUN_YI_SE);
        }
        
        // 清一色
        if (this.isQingYiSe(oHand, oMingPai)) {
            oPatterns.push(FuzhouPatternDef.QING_YI_SE);
        }
        
        return oPatterns;
    }

    /**
     * 计算花牌分
     * 
     * @param oHuaPai 花牌数组
     * @return 花牌分
     */
    private calculateHuaScore(oHuaPai: Array<number>): number {
        let nScore = 0;
        
        // 每张花牌1分
        nScore += oHuaPai.length;
        
        // 检查是否有梅兰竹菊一套
        let bHasMeiLanZhuJu = true;
        for (let nTile of [301, 302, 303, 304]) {
            if (!oHuaPai.includes(nTile)) {
                bHasMeiLanZhuJu = false;
                break;
            }
        }
        if (bHasMeiLanZhuJu) {
            nScore += 2; // 额外2分
        }
        
        // 检查是否有春夏秋冬一套
        let bHasChunXiaQiuDong = true;
        for (let nTile of [305, 306, 307, 308]) {
            if (!oHuaPai.includes(nTile)) {
                bHasChunXiaQiuDong = false;
                break;
            }
        }
        if (bHasChunXiaQiuDong) {
            nScore += 2; // 额外2分
        }
        
        return nScore;
    }

    /**
     * 计算杠分
     * 
     * @param oPlayerMingPai 所有玩家明牌
     * @return 杠分
     */
    private calculateGangScore(oPlayerMingPai: Array<Array<Array<number>>>): number {
        let nScore = 0;
        
        for (let oMingPai of oPlayerMingPai) {
            for (let oMeld of oMingPai) {
                if (oMeld.length === 4) {
                    // 杠
                    if (this.isAnGang(oMeld)) {
                        nScore += 2; // 暗杠2分
                    } else {
                        nScore += 1; // 明杠1分
                    }
                }
            }
        }
        
        return nScore;
    }

    /**
     * 计算特殊牌型分
     * 
     * @param oPatterns 牌型数组
     * @return 特殊牌型分
     */
    private calculateSpecialScore(oPatterns: Array<number>): number {
        let nMaxScore = 0;
        
        for (let nPattern of oPatterns) {
            let nScore = FuzhouPatternDef.getPatternScore(nPattern);
            if (nScore > nMaxScore) {
                nMaxScore = nScore;
            }
        }
        
        return nMaxScore;
    }

    /**
     * 计算各玩家得分
     * 
     * @param nWinner 赢家索引
     * @param nTotalScore 总分
     * @param bIsZiMo 是否自摸
     * @param nLianZhuang 连庄次数
     * @return 各玩家得分
     */
    private calculatePlayerScores(
        nWinner: number,
        nTotalScore: number,
        bIsZiMo: boolean,
        nLianZhuang: number
    ): Array<number> {
        let oScores: Array<number> = [0, 0, 0, 0];
        
        if (bIsZiMo) {
            // 自摸：其他3家各付
            for (let l = 0; l < 4; l++) {
                if (l === nWinner) {
                    oScores[l] = nTotalScore * 3;
                } else {
                    oScores[l] = -nTotalScore;
                }
            }
        } else {
            // 点炮：放炮者付
            oScores[nWinner] = nTotalScore;
            // 这里需要知道是谁放的炮，暂时简化处理
            // 实际应该传入放炮者索引
        }
        
        return oScores;
    }

    /**
     * 是否是暗杠
     * 
     * @param oMeld 面子
     * @return true = 暗杠, false = 明杠
     */
    private isAnGang(oMeld: Array<number>): boolean {
        // 暗杠的判断逻辑需要根据实际情况调整
        // 这里简化处理
        return false;
    }

    /**
     * 是否是混一色
     * 
     * @param oHand 手牌
     * @param oMingPai 明牌
     * @return true = 混一色, false = 不是
     */
    private isHunYiSe(oHand: Array<number>, oMingPai: Array<Array<number>>): boolean {
        let oSuits: Set<number> = new Set();
        let bHasGold = false;
        
        // 检查手牌
        for (let nTile of oHand) {
            if (FuzhouGoldTileDef.isGoldTile(nTile)) {
                bHasGold = true;
            } else if (!FuzhouHuaPaiDef.isHuaPai(nTile)) {
                let nSuit = MahjongTileDef.getSuit(nTile);
                if (nSuit > 0) {
                    oSuits.add(nSuit);
                }
            }
        }
        
        // 检查明牌
        for (let oMeld of oMingPai) {
            for (let nTile of oMeld) {
                if (!FuzhouHuaPaiDef.isHuaPai(nTile)) {
                    let nSuit = MahjongTileDef.getSuit(nTile);
                    if (nSuit > 0) {
                        oSuits.add(nSuit);
                    }
                }
            }
        }
        
        // 混一色：只有一种花色 + 金牌
        return oSuits.size <= 1 && bHasGold;
    }

    /**
     * 是否是清一色
     * 
     * @param oHand 手牌
     * @param oMingPai 明牌
     * @return true = 清一色, false = 不是
     */
    private isQingYiSe(oHand: Array<number>, oMingPai: Array<Array<number>>): boolean {
        let oSuits: Set<number> = new Set();
        let bHasGold = false;
        
        // 检查手牌
        for (let nTile of oHand) {
            if (FuzhouGoldTileDef.isGoldTile(nTile)) {
                bHasGold = true;
            } else if (!FuzhouHuaPaiDef.isHuaPai(nTile)) {
                let nSuit = MahjongTileDef.getSuit(nTile);
                if (nSuit > 0) {
                    oSuits.add(nSuit);
                }
            }
        }
        
        // 检查明牌
        for (let oMeld of oMingPai) {
            for (let nTile of oMeld) {
                if (!FuzhouHuaPaiDef.isHuaPai(nTile)) {
                    let nSuit = MahjongTileDef.getSuit(nTile);
                    if (nSuit > 0) {
                        oSuits.add(nSuit);
                    }
                }
            }
        }
        
        // 清一色：只有一种花色，无金牌
        return oSuits.size === 1 && !bHasGold;
    }
}
