/**
 * 福州麻将游戏流程管理
 * 处理花牌、金牌、补花、翻金等特殊流程
 */

import MahjongTileDef from "./MahjongTileDef";
import FuzhouHuaPaiDef from "./FuzhouHuaPaiDef";
import FuzhouGoldTileDef from "./FuzhouGoldTileDef";
import FuzhouRuleSetting from "./FuzhouRuleSetting";

/**
 * 游戏阶段枚举
 */
export enum GamePhase {
    WAITING = 0,        // 等待开始
    DEALING = 1,        // 发牌
    BU_HUA = 2,         // 补花
    FLIP_GOLD = 3,      // 翻金
    PLAYING = 4,        // 游戏中
    SETTLEMENT = 5,     // 结算
}

/**
 * 福州麻将游戏流程管理
 */
export default class FuzhouGameFlow {
    /** 当前阶段 */
    private _nPhase: GamePhase = GamePhase.WAITING;
    
    /** 规则设置 */
    private _oRuleSetting: FuzhouRuleSetting;
    
    /** 牌墙 */
    private _oWall: Array<number> = [];
    
    /** 弃牌堆 */
    private _oDiscardPile: Array<number> = [];
    
    /** 玩家手牌 */
    private _oPlayerHands: Array<Array<number>> = [[], [], [], []];
    
    /** 玩家花牌 */
    private _oPlayerHuaPai: Array<Array<number>> = [[], [], [], []];
    
    /** 玩家明牌（吃碰杠） */
    private _oPlayerMingPai: Array<Array<Array<number>>> = [[], [], [], []];
    
    /** 金牌 */
    private _nGoldTile: number = -1;
    
    /** 当前玩家索引 */
    private _nCurrentPlayer: number = 0;
    
    /** 庄家索引 */
    private _nDealer: number = 0;
    
    /** 连庄次数 */
    private _nLianZhuang: number = 0;

    /**
     * 构造器
     * 
     * @param oRuleSetting 规则设置
     */
    constructor(oRuleSetting: FuzhouRuleSetting) {
        this._oRuleSetting = oRuleSetting;
    }

    /**
     * 初始化牌墙
     */
    initWall(): void {
        this._oWall = [];
        
        // 万条饼各1-9，每种4张
        for (let s of ['m', 'p', 's']) {
            for (let n = 1; n <= 9; n++) {
                for (let i = 0; i < 4; i++) {
                    let nTile = MahjongTileDef.getValidVal(parseInt(`${s}${n}`));
                    if (nTile > 0) {
                        this._oWall.push(nTile);
                    }
                }
            }
        }
        
        // 风牌（东南西北），每种4张
        for (let nTile of [101, 103, 105, 107]) {
            for (let i = 0; i < 4; i++) {
                this._oWall.push(nTile);
            }
        }
        
        // 箭牌（中发白），每种4张
        for (let nTile of [126, 188, 255]) {
            for (let i = 0; i < 4; i++) {
                this._oWall.push(nTile);
            }
        }
        
        // 花牌（梅兰竹菊春夏秋冬），每种1张
        if (this._oRuleSetting.isEnableHuaPai()) {
            for (let nTile of FuzhouHuaPaiDef.HUA_ARRAY) {
                this._oWall.push(nTile);
            }
        }
        
        // 洗牌
        this.shuffle();
    }

    /**
     * 洗牌
     */
    private shuffle(): void {
        for (let i = this._oWall.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this._oWall[i], this._oWall[j]] = [this._oWall[j], this._oWall[i]];
        }
    }

    /**
     * 发牌
     */
    deal(): void {
        this._nPhase = GamePhase.DEALING;
        
        // 清空所有玩家手牌
        for (let i = 0; i < 4; i++) {
            this._oPlayerHands[i] = [];
            this._oPlayerHuaPai[i] = [];
            this._oPlayerMingPai[i] = [];
        }
        
        // 发牌：庄家17张，闲家16张
        for (let l = 0; l < 4; l++) {
            let nCount = (l === this._nDealer) ? 17 : 16;
            
            for (let i = 0; i < nCount; i++) {
                let nTile = this.drawFromWall();
                if (nTile <= 0) break;
                
                // 如果是花牌，放入花牌区并补牌
                if (FuzhouHuaPaiDef.isHuaPai(nTile)) {
                    this._oPlayerHuaPai[l].push(nTile);
                    // 补牌
                    let nReplenish = this.drawFromWallEnd();
                    while (nReplenish > 0 && FuzhouHuaPaiDef.isHuaPai(nReplenish)) {
                        this._oPlayerHuaPai[l].push(nReplenish);
                        nReplenish = this.drawFromWallEnd();
                    }
                    if (nReplenish > 0) {
                        this._oPlayerHands[l].push(nReplenish);
                    }
                } else {
                    this._oPlayerHands[l].push(nTile);
                }
            }
        }
        
        // 所有玩家补花
        this.buHuaAll();
        
        // 翻金
        if (this._oRuleSetting.isEnableGoldTile()) {
            this.flipGold();
        }
        
        // 排序手牌
        for (let l = 0; l < 4; l++) {
            this.sortHand(l);
        }
        
        this._nPhase = GamePhase.PLAYING;
    }

    /**
     * 所有玩家补花
     */
    private buHuaAll(): void {
        this._nPhase = GamePhase.BU_HUA;
        
        let bChanged = true;
        while (bChanged) {
            bChanged = false;
            
            for (let l = 0; l < 4; l++) {
                let oNewHand: Array<number> = [];
                
                // 检查手牌中的花牌
                for (let nTile of this._oPlayerHands[l]) {
                    if (FuzhouHuaPaiDef.isHuaPai(nTile)) {
                        this._oPlayerHuaPai[l].push(nTile);
                        bChanged = true;
                    } else {
                        oNewHand.push(nTile);
                    }
                }
                
                this._oPlayerHands[l] = oNewHand;
                
                // 补牌
                while (true) {
                    let nReplenish = this.drawFromWallEnd();
                    if (nReplenish <= 0) break;
                    
                    if (FuzhouHuaPaiDef.isHuaPai(nReplenish)) {
                        this._oPlayerHuaPai[l].push(nReplenish);
                        bChanged = true;
                    } else {
                        this._oPlayerHands[l].push(nReplenish);
                        break;
                    }
                }
            }
        }
    }

    /**
     * 翻金
     */
    private flipGold(): void {
        this._nPhase = GamePhase.FLIP_GOLD;
        
        let nTile = this.drawFromWallEnd();
        
        // 如果翻出花牌，给庄家，重新翻
        while (nTile > 0 && FuzhouHuaPaiDef.isHuaPai(nTile)) {
            this._oPlayerHuaPai[this._nDealer].push(nTile);
            nTile = this.drawFromWallEnd();
        }
        
        // 设置金牌
        if (nTile > 0) {
            this._nGoldTile = nTile;
            FuzhouGoldTileDef.setGoldTile(nTile);
        }
    }

    /**
     * 从牌墙前面摸牌
     * 
     * @return 摸到的牌
     */
    drawFromWall(): number {
        if (this._oWall.length === 0) {
            return -1;
        }
        return this._oWall.shift();
    }

    /**
     * 从牌墙后面补牌
     * 
     * @return 补到的牌
     */
    drawFromWallEnd(): number {
        if (this._oWall.length === 0) {
            return -1;
        }
        return this._oWall.pop();
    }

    /**
     * 玩家摸牌
     * 
     * @param nPlayer 玩家索引
     * @return 摸到的牌
     */
    playerDraw(nPlayer: number): number {
        let nTile = this.drawFromWall();
        
        if (nTile <= 0) {
            return -1;
        }
        
        // 如果是花牌，补花
        if (FuzhouHuaPaiDef.isHuaPai(nTile)) {
            this._oPlayerHuaPai[nPlayer].push(nTile);
            return this.playerBuHua(nPlayer);
        }
        
        this._oPlayerHands[nPlayer].push(nTile);
        return nTile;
    }

    /**
     * 玩家补花
     * 
     * @param nPlayer 玩家索引
     * @return 补到的牌
     */
    private playerBuHua(nPlayer: number): number {
        let nTile = this.drawFromWallEnd();
        
        while (nTile > 0 && FuzhouHuaPaiDef.isHuaPai(nTile)) {
            this._oPlayerHuaPai[nPlayer].push(nTile);
            nTile = this.drawFromWallEnd();
        }
        
        if (nTile > 0) {
            this._oPlayerHands[nPlayer].push(nTile);
        }
        
        return nTile;
    }

    /**
     * 玩家出牌
     * 
     * @param nPlayer 玩家索引
     * @param nTile 要出的牌
     * @return 是否成功
     */
    playerDiscard(nPlayer: number, nTile: number): boolean {
        let nIndex = this._oPlayerHands[nPlayer].indexOf(nTile);
        
        if (nIndex < 0) {
            return false;
        }
        
        this._oPlayerHands[nPlayer].splice(nIndex, 1);
        this._oDiscardPile.push(nTile);
        
        return true;
    }

    /**
     * 玩家吃牌
     * 
     * @param nPlayer 玩家索引
     * @param nTile 吃的牌
     * @param oCombo 吃的组合
     * @return 是否成功
     */
    playerChi(nPlayer: number, nTile: number, oCombo: Array<number>): boolean {
        // 检查手牌中是否有吃牌
        for (let nComboTile of oCombo) {
            let nIndex = this._oPlayerHands[nPlayer].indexOf(nComboTile);
            if (nIndex < 0) {
                return false;
            }
        }
        
        // 从手牌中移除
        for (let nComboTile of oCombo) {
            let nIndex = this._oPlayerHands[nPlayer].indexOf(nComboTile);
            this._oPlayerHands[nPlayer].splice(nIndex, 1);
        }
        
        // 添加到明牌
        this._oPlayerMingPai[nPlayer].push([nTile, ...oCombo].sort());
        
        // 从弃牌堆移除
        this._oDiscardPile.pop();
        
        return true;
    }

    /**
     * 玩家碰牌
     * 
     * @param nPlayer 玩家索引
     * @param nTile 碰的牌
     * @return 是否成功
     */
    playerPeng(nPlayer: number, nTile: number): boolean {
        // 检查手牌中是否有2张相同的牌
        let nCount = 0;
        for (let nHandTile of this._oPlayerHands[nPlayer]) {
            if (nHandTile === nTile) {
                nCount++;
            }
        }
        
        if (nCount < 2) {
            return false;
        }
        
        // 从手牌中移除2张
        let nRemoved = 0;
        this._oPlayerHands[nPlayer] = this._oPlayerHands[nPlayer].filter(nHandTile => {
            if (nHandTile === nTile && nRemoved < 2) {
                nRemoved++;
                return false;
            }
            return true;
        });
        
        // 添加到明牌
        this._oPlayerMingPai[nPlayer].push([nTile, nTile, nTile]);
        
        // 从弃牌堆移除
        this._oDiscardPile.pop();
        
        return true;
    }

    /**
     * 玩家杠牌
     * 
     * @param nPlayer 玩家索引
     * @param nTile 杠的牌
     * @param nType 杠类型（0=明杠，1=暗杠，2=补杠）
     * @return 是否成功
     */
    playerGang(nPlayer: number, nTile: number, nType: number): boolean {
        if (nType === 0) {
            // 明杠：手牌中3张 + 弃牌1张
            let nCount = 0;
            for (let nHandTile of this._oPlayerHands[nPlayer]) {
                if (nHandTile === nTile) {
                    nCount++;
                }
            }
            
            if (nCount < 3) {
                return false;
            }
            
            // 从手牌中移除3张
            let nRemoved = 0;
            this._oPlayerHands[nPlayer] = this._oPlayerHands[nPlayer].filter(nHandTile => {
                if (nHandTile === nTile && nRemoved < 3) {
                    nRemoved++;
                    return false;
                }
                return true;
            });
            
            // 添加到明牌
            this._oPlayerMingPai[nPlayer].push([nTile, nTile, nTile, nTile]);
            
            // 从弃牌堆移除
            this._oDiscardPile.pop();
            
        } else if (nType === 1) {
            // 暗杠：手牌中4张
            let nCount = 0;
            for (let nHandTile of this._oPlayerHands[nPlayer]) {
                if (nHandTile === nTile) {
                    nCount++;
                }
            }
            
            if (nCount < 4) {
                return false;
            }
            
            // 从手牌中移除4张
            let nRemoved = 0;
            this._oPlayerHands[nPlayer] = this._oPlayerHands[nPlayer].filter(nHandTile => {
                if (nHandTile === nTile && nRemoved < 4) {
                    nRemoved++;
                    return false;
                }
                return true;
            });
            
            // 添加到明牌
            this._oPlayerMingPai[nPlayer].push([nTile, nTile, nTile, nTile]);
            
        } else if (nType === 2) {
            // 补杠：碰后摸到第4张
            let bFound = false;
            for (let oMeld of this._oPlayerMingPai[nPlayer]) {
                if (oMeld.length === 3 && oMeld[0] === nTile) {
                    oMeld.push(nTile);
                    bFound = true;
                    break;
                }
            }
            
            if (!bFound) {
                return false;
            }
            
            // 从手牌中移除1张
            let nIndex = this._oPlayerHands[nPlayer].indexOf(nTile);
            if (nIndex >= 0) {
                this._oPlayerHands[nPlayer].splice(nIndex, 1);
            }
        }
        
        // 杠后补牌
        let nReplenish = this.drawFromWallEnd();
        if (nReplenish > 0) {
            this._oPlayerHands[nPlayer].push(nReplenish);
        }
        
        return true;
    }

    /**
     * 玩家胡牌
     * 
     * @param nPlayer 玩家索引
     * @param nTile 胡的牌
     * @param bIsZiMo 是否自摸
     * @return 是否成功
     */
    playerHu(nPlayer: number, nTile: number, bIsZiMo: boolean): boolean {
        // TODO: 实现胡牌逻辑
        return true;
    }

    /**
     * 排序手牌
     * 
     * @param nPlayer 玩家索引
     */
    sortHand(nPlayer: number): void {
        this._oPlayerHands[nPlayer].sort((a, b) => {
            if (a[0] !== b[0]) return a[0].localeCompare(b[0]);
            return a[1] - b[1];
        });
    }

    /**
     * 获取当前阶段
     * 
     * @return 当前阶段
     */
    getPhase(): GamePhase {
        return this._nPhase;
    }

    /**
     * 获取牌墙剩余数量
     * 
     * @return 牌墙剩余数量
     */
    getWallCount(): number {
        return this._oWall.length;
    }

    /**
     * 获取玩家手牌
     * 
     * @param nPlayer 玩家索引
     * @return 手牌数组
     */
    getPlayerHand(nPlayer: number): Array<number> {
        return this._oPlayerHands[nPlayer];
    }

    /**
     * 获取玩家花牌
     * 
     * @param nPlayer 玩家索引
     * @return 花牌数组
     */
    getPlayerHuaPai(nPlayer: number): Array<number> {
        return this._oPlayerHuaPai[nPlayer];
    }

    /**
     * 获取玩家明牌
     * 
     * @param nPlayer 玩家索引
     * @return 明牌数组
     */
    getPlayerMingPai(nPlayer: number): Array<Array<number>> {
        return this._oPlayerMingPai[nPlayer];
    }

    /**
     * 获取金牌
     * 
     * @return 金牌
     */
    getGoldTile(): number {
        return this._nGoldTile;
    }

    /**
     * 获取当前玩家
     * 
     * @return 当前玩家索引
     */
    getCurrentPlayer(): number {
        return this._nCurrentPlayer;
    }

    /**
     * 获取庄家
     * 
     * @return 庄家索引
     */
    getDealer(): number {
        return this._nDealer;
    }

    /**
     * 获取连庄次数
     * 
     * @return 连庄次数
     */
    getLianZhuang(): number {
        return this._nLianZhuang;
    }

    /**
     * 设置下一回合
     * 
     * @param nWinner 赢家索引（-1表示流局）
     */
    nextRound(nWinner: number): void {
        if (nWinner === this._nDealer) {
            // 庄家赢，连庄
            this._nLianZhuang++;
        } else {
            // 庄家输，换庄
            this._nDealer = (this._nDealer + 1) % 4;
            this._nLianZhuang = 0;
        }
        
        this._nCurrentPlayer = this._nDealer;
        this._nPhase = GamePhase.WAITING;
    }
}
