/**
 * 福州麻将游戏场景
 * 主游戏场景控制器
 */

import FuzhouGameFlow, { GamePhase } from "./FuzhouGameFlow";
import FuzhouSettlement, { SettlementResult } from "./FuzhouSettlement";
import FuzhouUIManager from "./FuzhouUIManager";
import FuzhouRuleSetting from "./FuzhouRuleSetting";
import FuzhouHuaPaiDef from "./FuzhouHuaPaiDef";
import FuzhouGoldTileDef from "./FuzhouGoldTileDef";
import FuzhouPatternDef from "./FuzhouPatternDef";

const { ccclass, property } = cc._decorator;

/**
 * 福州麻将游戏场景
 */
@ccclass
export default class FuzhouGameScene extends cc.Component {
    /** 游戏流程管理器 */
    private _oGameFlow: FuzhouGameFlow = null;
    
    /** 结算管理器 */
    private _oSettlement: FuzhouSettlement = null;
    
    /** UI管理器 */
    private _oUIManager: FuzhouUIManager = null;
    
    /** 规则设置 */
    private _oRuleSetting: FuzhouRuleSetting = null;
    
    /** 当前玩家索引 */
    private _nCurrentPlayer: number = 0;
    
    /** 庄家索引 */
    private _nDealer: number = 0;
    
    /** 连庄次数 */
    private _nLianZhuang: number = 0;
    
    /** 游戏是否结束 */
    private _bGameOver: boolean = false;

    /**
     * onLoad
     */
    onLoad(): void {
        // 初始化规则设置
        this._oRuleSetting = new FuzhouRuleSetting([
            { key: FuzhouRuleSetting.KEY_MAX_PLAYER, val: 4 },
            { key: FuzhouRuleSetting.KEY_MAX_ROUND, val: 8 },
            { key: FuzhouRuleSetting.KEY_ENABLE_HUA_PAI, val: 1 },
            { key: FuzhouRuleSetting.KEY_ENABLE_GOLD_TILE, val: 1 },
            { key: FuzhouRuleSetting.KEY_ENABLE_FUZHOU_RULE, val: 1 },
            { key: FuzhouRuleSetting.KEY_ENABLE_ZI_MO, val: 1 },
            { key: FuzhouRuleSetting.KEY_ENABLE_DIAN_PAO, val: 1 },
            { key: FuzhouRuleSetting.KEY_BASE_SCORE, val: 1 },
        ]);
        
        // 初始化游戏流程管理器
        this._oGameFlow = new FuzhouGameFlow(this._oRuleSetting);
        
        // 初始化结算管理器
        this._oSettlement = new FuzhouSettlement(this._oRuleSetting);
        
        // 初始化UI管理器
        this._oUIManager = new FuzhouUIManager(this.node);
        this._oUIManager.createGameUI();
        
        // 开始游戏
        this.startGame();
    }

    /**
     * start
     */
    start(): void {
        // 设置横屏
        this.setLandscape();
    }

    /**
     * 设置横屏
     */
    private setLandscape(): void {
        // 设置设计分辨率
        let oCanvas = this.node.getComponent(cc.Canvas);
        if (oCanvas) {
            oCanvas.designResolution = cc.size(1920, 1080);
            oCanvas.fitWidth = true;
            oCanvas.fitHeight = true;
        }
        
        // 设置屏幕方向
        if (cc.sys.isMobile) {
            // 移动端强制横屏
            cc.screen.orientation = cc.Screen.Orientation.LANDSCAPE;
        }
    }

    /**
     * 开始游戏
     */
    private startGame(): void {
        // 初始化牌墙
        this._oGameFlow.initWall();
        
        // 发牌
        this._oGameFlow.deal();
        
        // 更新UI
        this.updateUI();
        
        // 设置当前玩家
        this._nCurrentPlayer = this._oGameFlow.getCurrentPlayer();
        
        // 开始游戏循环
        this.gameLoop();
    }

    /**
     * 游戏循环
     */
    private gameLoop(): void {
        // 检查游戏是否结束
        if (this._bGameOver) {
            return;
        }
        
        // 获取当前阶段
        let nPhase = this._oGameFlow.getPhase();
        
        switch (nPhase) {
            case GamePhase.PLAYING:
                this.playingPhase();
                break;
            case GamePhase.SETTLEMENT:
                this.settlementPhase();
                break;
        }
    }

    /**
     * 游戏中阶段
     */
    private playingPhase(): void {
        // 检查牌墙是否耗尽
        if (this._oGameFlow.getWallCount() <= 0) {
            this._oGameFlow.nextRound(-1);
            this._bGameOver = true;
            return;
        }
        
        // 当前玩家摸牌
        let nTile = this._oGameFlow.playerDraw(this._nCurrentPlayer);
        
        if (nTile <= 0) {
            // 牌墙耗尽
            this._oGameFlow.nextRound(-1);
            this._bGameOver = true;
            return;
        }
        
        // 更新UI
        this.updateUI();
        
        // 检查是否可以胡牌
        if (this.canHu(this._nCurrentPlayer, nTile)) {
            this.showHuButton();
        }
        
        // 检查是否可以杠牌
        if (this.canGang(this._nCurrentPlayer)) {
            this.showGangButton();
        }
        
        // 如果是AI玩家，自动出牌
        if (this._nCurrentPlayer !== 0) {
            this.aiPlay();
        }
    }

    /**
     * 结算阶段
     */
    private settlementPhase(): void {
        // 显示结算界面
        this.showSettlementUI();
    }

    /**
     * 更新UI
     */
    private updateUI(): void {
        // 更新玩家手牌
        for (let i = 0; i < 4; i++) {
            this._oUIManager.updatePlayerHand(i, this._oGameFlow.getPlayerHand(i));
            this._oUIManager.updatePlayerHuaPai(i, this._oGameFlow.getPlayerHuaPai(i));
            this._oUIManager.updatePlayerMingPai(i, this._oGameFlow.getPlayerMingPai(i));
        }
        
        // 更新弃牌堆
        // TODO: 需要获取弃牌堆数据
        
        // 更新金牌显示
        this._oUIManager.updateGoldTile(this._oGameFlow.getGoldTile());
        
        // 更新信息面板
        for (let i = 0; i < 4; i++) {
            this._oUIManager.updateInfoPanel(
                i,
                `玩家${i + 1}`,
                0, // TODO: 获取玩家分数
                this._oGameFlow.getPlayerHuaPai(i).length
            );
        }
    }

    /**
     * 检查是否可以胡牌
     * 
     * @param nPlayer 玩家索引
     * @param nTile 牌值
     * @return 是否可以胡牌
     */
    private canHu(nPlayer: number, nTile: number): boolean {
        let oHand = this._oGameFlow.getPlayerHand(nPlayer);
        return this._oGameFlow.playerHu(nPlayer, nTile, true);
    }

    /**
     * 检查是否可以杠牌
     * 
     * @param nPlayer 玩家索引
     * @return 是否可以杠牌
     */
    private canGang(nPlayer: number): boolean {
        let oHand = this._oGameFlow.getPlayerHand(nPlayer);
        
        // 检查是否有4张相同的牌
        let oCounts: { [key: number]: number } = {};
        for (let nTile of oHand) {
            oCounts[nTile] = (oCounts[nTile] || 0) + 1;
        }
        
        for (let nTile in oCounts) {
            if (oCounts[nTile] >= 4) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * 显示胡牌按钮
     */
    private showHuButton(): void {
        // TODO: 显示胡牌按钮
        console.log('显示胡牌按钮');
    }

    /**
     * 显示杠牌按钮
     */
    private showGangButton(): void {
        // TODO: 显示杠牌按钮
        console.log('显示杠牌按钮');
    }

    /**
     * AI玩家出牌
     */
    private aiPlay(): void {
        // TODO: 实现AI出牌逻辑
        console.log('AI出牌');
        
        // 简单的AI：随机出一张牌
        let oHand = this._oGameFlow.getPlayerHand(this._nCurrentPlayer);
        if (oHand.length > 0) {
            let nRandomIndex = Math.floor(Math.random() * oHand.length);
            let nTile = oHand[nRandomIndex];
            this._oGameFlow.playerDiscard(this._nCurrentPlayer, nTile);
            
            // 更新最近出牌显示
            this._oUIManager.updateLastDiscard(nTile, this._nCurrentPlayer);
            
            // 切换到下一个玩家
            this._nCurrentPlayer = (this._nCurrentPlayer + 1) % 4;
            
            // 继续游戏循环
            this.scheduleOnce(() => {
                this.gameLoop();
            }, 1);
        }
    }

    /**
     * 显示结算界面
     */
    private showSettlementUI(): void {
        // TODO: 显示结算界面
        console.log('显示结算界面');
    }

    /**
     * 牌面点击事件
     * 
     * @param event 事件
     * @param strTile 牌值字符串
     */
    onTileClick(event: cc.Event, strTile: string): void {
        let nTile = parseInt(strTile);
        
        // 只有当前玩家可以出牌
        if (this._nCurrentPlayer !== 0) {
            return;
        }
        
        // 出牌
        this._oGameFlow.playerDiscard(0, nTile);
        
        // 更新最近出牌显示
        this._oUIManager.updateLastDiscard(nTile, 0);
        
        // 切换到下一个玩家
        this._nCurrentPlayer = 1;
        
        // 继续游戏循环
        this.scheduleOnce(() => {
            this.gameLoop();
        }, 1);
    }

    /**
     * 胡牌按钮点击事件
     */
    onHuClick(): void {
        // TODO: 实现胡牌逻辑
        console.log('胡牌');
    }

    /**
     * 杠牌按钮点击事件
     */
    onGangClick(): void {
        // TODO: 实现杠牌逻辑
        console.log('杠牌');
    }

    /**
     * 碰牌按钮点击事件
     */
    onPengClick(): void {
        // TODO: 实现碰牌逻辑
        console.log('碰牌');
    }

    /**
     * 吃牌按钮点击事件
     */
    onChiClick(): void {
        // TODO: 实现吃牌逻辑
        console.log('吃牌');
    }

    /**
     * 过按钮点击事件
     */
    onPassClick(): void {
        // TODO: 实现过逻辑
        console.log('过');
    }
}
