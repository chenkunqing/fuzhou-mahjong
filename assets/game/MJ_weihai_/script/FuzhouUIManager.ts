/**
 * 福州麻将UI管理器
 * 处理横屏布局、花牌显示、金牌高亮等UI逻辑
 */

import FuzhouHuaPaiDef from "./FuzhouHuaPaiDef";
import FuzhouGoldTileDef from "./FuzhouGoldTileDef";
import FuzhouPatternDef from "./FuzhouPatternDef";

/**
 * UI布局配置
 */
export interface UILayoutConfig {
    /** 屏幕宽度 */
    screenWidth: number;
    /** 屏幕高度 */
    screenHeight: number;
    /** 是否横屏 */
    isLandscape: boolean;
    /** 缩放比例 */
    scale: number;
}

/**
 * 牌面显示配置
 */
export interface TileDisplayConfig {
    /** 牌面宽度 */
    width: number;
    /** 牌面高度 */
    height: number;
    /** 牌面间距 */
    gap: number;
    /** 是否显示牌背 */
    showBack: boolean;
}

/**
 * 福州麻将UI管理器
 */
export default class FuzhouUIManager {
    /** 布局配置 */
    private _oLayoutConfig: UILayoutConfig;
    
    /** 牌面配置 */
    private _oTileConfig: TileDisplayConfig;
    
    /** 画布节点 */
    private _oCanvas: cc.Node = null;
    
    /** 玩家手牌节点 */
    private _oPlayerHandNodes: Array<cc.Node> = [];
    
    /** 玩家花牌节点 */
    private _oPlayerHuaPaiNodes: Array<cc.Node> = [];
    
    /** 玩家明牌节点 */
    private _oPlayerMingPaiNodes: Array<cc.Node> = [];
    
    /** 弃牌堆节点 */
    private _oDiscardPileNode: cc.Node = null;
    
    /** 金牌显示节点 */
    private _oGoldTileNode: cc.Node = null;
    
    /** 最近出牌节点 */
    private _oLastDiscardNode: cc.Node = null;
    
    /** 信息面板节点 */
    private _oInfoPanelNodes: Array<cc.Node> = [];

    /**
     * 构造器
     * 
     * @param oCanvas 画布节点
     */
    constructor(oCanvas: cc.Node) {
        this._oCanvas = oCanvas;
        this.initLayoutConfig();
        this.initTileConfig();
    }

    /**
     * 初始化布局配置
     */
    private initLayoutConfig(): void {
        let nWidth = cc.winSize.width;
        let nHeight = cc.winSize.height;
        
        this._oLayoutConfig = {
            screenWidth: nWidth,
            screenHeight: nHeight,
            isLandscape: nWidth > nHeight,
            scale: 1,
        };
        
        // 计算缩放比例
        let nDesignWidth = 1920;
        let nDesignHeight = 1080;
        
        if (this._oLayoutConfig.isLandscape) {
            this._oLayoutConfig.scale = Math.min(
                nWidth / nDesignWidth,
                nHeight / nDesignHeight
            );
        } else {
            this._oLayoutConfig.scale = Math.min(
                nWidth / nDesignHeight,
                nHeight / nDesignWidth
            );
        }
    }

    /**
     * 初始化牌面配置
     */
    private initTileConfig(): void {
        this._oTileConfig = {
            width: 80 * this._oLayoutConfig.scale,
            height: 110 * this._oLayoutConfig.scale,
            gap: 5 * this._oLayoutConfig.scale,
            showBack: false,
        };
    }

    /**
     * 创建游戏UI
     */
    createGameUI(): void {
        // 创建玩家手牌区域
        this.createPlayerHandAreas();
        
        // 创建玩家花牌区域
        this.createPlayerHuaPaiAreas();
        
        // 创建玩家明牌区域
        this.createPlayerMingPaiAreas();
        
        // 创建弃牌堆区域
        this.createDiscardPileArea();
        
        // 创建金牌显示区域
        this.createGoldTileArea();
        
        // 创建最近出牌区域
        this.createLastDiscardArea();
        
        // 创建信息面板
        this.createInfoPanels();
    }

    /**
     * 创建玩家手牌区域
     */
    private createPlayerHandAreas(): void {
        for (let i = 0; i < 4; i++) {
            let oNode = new cc.Node(`PlayerHand_${i}`);
            oNode.parent = this._oCanvas;
            
            // 根据玩家位置设置位置
            let oPos = this.getPlayerHandPosition(i);
            oNode.setPosition(oPos);
            
            this._oPlayerHandNodes.push(oNode);
        }
    }

    /**
     * 获取玩家手牌位置
     * 
     * @param nPlayer 玩家索引
     * @return 位置
     */
    private getPlayerHandPosition(nPlayer: number): cc.Vec2 {
        let nWidth = this._oLayoutConfig.screenWidth;
        let nHeight = this._oLayoutConfig.screenHeight;
        
        switch (nPlayer) {
            case 0: // 自己（底部）
                return cc.v2(0, -nHeight / 2 + 100);
            case 1: // 下家（右侧）
                return cc.v2(nWidth / 2 - 100, 0);
            case 2: // 对家（顶部）
                return cc.v2(0, nHeight / 2 - 100);
            case 3: // 上家（左侧）
                return cc.v2(-nWidth / 2 + 100, 0);
            default:
                return cc.v2(0, 0);
        }
    }

    /**
     * 创建玩家花牌区域
     */
    private createPlayerHuaPaiAreas(): void {
        for (let i = 0; i < 4; i++) {
            let oNode = new cc.Node(`PlayerHuaPai_${i}`);
            oNode.parent = this._oCanvas;
            
            // 花牌区域在手牌区域旁边
            let oPos = this.getPlayerHuaPaiPosition(i);
            oNode.setPosition(oPos);
            
            this._oPlayerHuaPaiNodes.push(oNode);
        }
    }

    /**
     * 获取玩家花牌位置
     * 
     * @param nPlayer 玩家索引
     * @return 位置
     */
    private getPlayerHuaPaiPosition(nPlayer: number): cc.Vec2 {
        let nWidth = this._oLayoutConfig.screenWidth;
        let nHeight = this._oLayoutConfig.screenHeight;
        
        switch (nPlayer) {
            case 0: // 自己（底部左侧）
                return cc.v2(-nWidth / 2 + 150, -nHeight / 2 + 100);
            case 1: // 下家（右侧上方）
                return cc.v2(nWidth / 2 - 100, nHeight / 2 - 150);
            case 2: // 对家（顶部右侧）
                return cc.v2(nWidth / 2 - 150, nHeight / 2 - 100);
            case 3: // 上家（左侧下方）
                return cc.v2(-nWidth / 2 + 100, -nHeight / 2 + 150);
            default:
                return cc.v2(0, 0);
        }
    }

    /**
     * 创建玩家明牌区域
     */
    private createPlayerMingPaiAreas(): void {
        for (let i = 0; i < 4; i++) {
            let oNode = new cc.Node(`PlayerMingPai_${i}`);
            oNode.parent = this._oCanvas;
            
            // 明牌区域在手牌区域上方
            let oPos = this.getPlayerMingPaiPosition(i);
            oNode.setPosition(oPos);
            
            this._oPlayerMingPaiNodes.push(oNode);
        }
    }

    /**
     * 获取玩家明牌位置
     * 
     * @param nPlayer 玩家索引
     * @return 位置
     */
    private getPlayerMingPaiPosition(nPlayer: number): cc.Vec2 {
        let nWidth = this._oLayoutConfig.screenWidth;
        let nHeight = this._oLayoutConfig.screenHeight;
        
        switch (nPlayer) {
            case 0: // 自己（底部上方）
                return cc.v2(0, -nHeight / 2 + 200);
            case 1: // 下家（右侧左侧）
                return cc.v2(nWidth / 2 - 200, 0);
            case 2: // 对家（顶部下方）
                return cc.v2(0, nHeight / 2 - 200);
            case 3: // 上家（左侧右侧）
                return cc.v2(-nWidth / 2 + 200, 0);
            default:
                return cc.v2(0, 0);
        }
    }

    /**
     * 创建弃牌堆区域
     */
    private createDiscardPileArea(): void {
        this._oDiscardPileNode = new cc.Node('DiscardPile');
        this._oDiscardPileNode.parent = this._oCanvas;
        this._oDiscardPileNode.setPosition(cc.v2(0, 0));
    }

    /**
     * 创建金牌显示区域
     */
    private createGoldTileArea(): void {
        this._oGoldTileNode = new cc.Node('GoldTile');
        this._oGoldTileNode.parent = this._oCanvas;
        
        // 金牌显示在中央偏上
        let nHeight = this._oLayoutConfig.screenHeight;
        this._oGoldTileNode.setPosition(cc.v2(0, nHeight / 2 - 200));
    }

    /**
     * 创建最近出牌区域
     */
    private createLastDiscardArea(): void {
        this._oLastDiscardNode = new cc.Node('LastDiscard');
        this._oLastDiscardNode.parent = this._oCanvas;
        
        // 最近出牌显示在中央偏下
        let nHeight = this._oLayoutConfig.screenHeight;
        this._oLastDiscardNode.setPosition(cc.v2(0, -nHeight / 2 + 300));
    }

    /**
     * 创建信息面板
     */
    private createInfoPanels(): void {
        for (let i = 0; i < 4; i++) {
            let oNode = new cc.Node(`InfoPanel_${i}`);
            oNode.parent = this._oCanvas;
            
            // 信息面板在玩家区域外侧
            let oPos = this.getInfoPanelPosition(i);
            oNode.setPosition(oPos);
            
            this._oInfoPanelNodes.push(oNode);
        }
    }

    /**
     * 获取信息面板位置
     * 
     * @param nPlayer 玩家索引
     * @return 位置
     */
    private getInfoPanelPosition(nPlayer: number): cc.Vec2 {
        let nWidth = this._oLayoutConfig.screenWidth;
        let nHeight = this._oLayoutConfig.screenHeight;
        
        switch (nPlayer) {
            case 0: // 自己（底部中央）
                return cc.v2(0, -nHeight / 2 + 50);
            case 1: // 下家（右侧边缘）
                return cc.v2(nWidth / 2 - 50, 0);
            case 2: // 对家（顶部中央）
                return cc.v2(0, nHeight / 2 - 50);
            case 3: // 上家（左侧边缘）
                return cc.v2(-nWidth / 2 + 50, 0);
            default:
                return cc.v2(0, 0);
        }
    }

    /**
     * 更新玩家手牌显示
     * 
     * @param nPlayer 玩家索引
     * @param oHand 手牌数组
     */
    updatePlayerHand(nPlayer: number, oHand: Array<number>): void {
        let oNode = this._oPlayerHandNodes[nPlayer];
        if (!oNode) return;
        
        // 清空现有子节点
        oNode.removeAllChildren();
        
        // 创建手牌
        for (let i = 0; i < oHand.length; i++) {
            let oTileNode = this.createTileNode(oHand[i], nPlayer !== 0);
            oTileNode.parent = oNode;
            
            // 设置位置
            let nX = (i - oHand.length / 2) * (this._oTileConfig.width + this._oTileConfig.gap);
            oTileNode.setPosition(cc.v2(nX, 0));
            
            // 如果是自己，添加点击事件
            if (nPlayer === 0) {
                this.addTileClickEvent(oTileNode, oHand[i]);
            }
        }
    }

    /**
     * 更新玩家花牌显示
     * 
     * @param nPlayer 玩家索引
     * @param oHuaPai 花牌数组
     */
    updatePlayerHuaPai(nPlayer: number, oHuaPai: Array<number>): void {
        let oNode = this._oPlayerHuaPaiNodes[nPlayer];
        if (!oNode) return;
        
        // 清空现有子节点
        oNode.removeAllChildren();
        
        // 创建花牌
        for (let i = 0; i < oHuaPai.length; i++) {
            let oTileNode = this.createHuaPaiNode(oHuaPai[i]);
            oTileNode.parent = oNode;
            
            // 设置位置
            let nX = (i - oHuaPai.length / 2) * (this._oTileConfig.width + this._oTileConfig.gap);
            oTileNode.setPosition(cc.v2(nX, 0));
        }
    }

    /**
     * 更新玩家明牌显示
     * 
     * @param nPlayer 玩家索引
     * @param oMingPai 明牌数组
     */
    updatePlayerMingPai(nPlayer: number, oMingPai: Array<Array<number>>): void {
        let oNode = this._oPlayerMingPaiNodes[nPlayer];
        if (!oNode) return;
        
        // 清空现有子节点
        oNode.removeAllChildren();
        
        // 创建明牌
        for (let i = 0; i < oMingPai.length; i++) {
            let oMeldNode = new cc.Node(`Meld_${i}`);
            oMeldNode.parent = oNode;
            
            // 设置位置
            let nX = (i - oMingPai.length / 2) * 150;
            oMeldNode.setPosition(cc.v2(nX, 0));
            
            // 创建面子中的牌
            for (let j = 0; j < oMingPai[i].length; j++) {
                let oTileNode = this.createTileNode(oMingPai[i][j], false);
                oTileNode.parent = oMeldNode;
                
                // 设置位置
                let nTileX = (j - oMingPai[i].length / 2) * (this._oTileConfig.width + 2);
                oTileNode.setPosition(cc.v2(nTileX, 0));
            }
        }
    }

    /**
     * 更新弃牌堆显示
     * 
     * @param oDiscardPile 弃牌堆数组
     */
    updateDiscardPile(oDiscardPile: Array<number>): void {
        if (!this._oDiscardPileNode) return;
        
        // 清空现有子节点
        this._oDiscardPileNode.removeAllChildren();
        
        // 创建弃牌
        for (let i = 0; i < oDiscardPile.length; i++) {
            let oTileNode = this.createTileNode(oDiscardPile[i], false);
            oTileNode.parent = this._oDiscardPileNode;
            
            // 环形布局
            let nAngle = (i / Math.max(oDiscardPile.length, 1)) * Math.PI * 2 - Math.PI / 2;
            let nRadius = 100 + (i % 4) * 30;
            let nX = Math.cos(nAngle) * nRadius;
            let nY = Math.sin(nAngle) * nRadius;
            oTileNode.setPosition(cc.v2(nX, nY));
        }
    }

    /**
     * 更新金牌显示
     * 
     * @param nGoldTile 金牌
     */
    updateGoldTile(nGoldTile: number): void {
        if (!this._oGoldTileNode) return;
        
        // 清空现有子节点
        this._oGoldTileNode.removeAllChildren();
        
        if (nGoldTile > 0) {
            // 创建金牌显示
            let oTileNode = this.createTileNode(nGoldTile, false);
            oTileNode.parent = this._oGoldTileNode;
            
            // 添加金牌高亮效果
            this.addGoldHighlight(oTileNode);
            
            // 添加标签
            let oLabelNode = new cc.Node('GoldLabel');
            oLabelNode.parent = this._oGoldTileNode;
            oLabelNode.setPosition(cc.v2(0, -80));
            
            let oLabel = oLabelNode.addComponent(cc.Label);
            oLabel.string = '金牌';
            oLabel.fontSize = 24;
            oLabel.node.color = cc.Color.YELLOW;
        }
    }

    /**
     * 更新最近出牌显示
     * 
     * @param nTile 最近出的牌
     * @param nPlayer 出牌玩家
     */
    updateLastDiscard(nTile: number, nPlayer: number): void {
        if (!this._oLastDiscardNode) return;
        
        // 清空现有子节点
        this._oLastDiscardNode.removeAllChildren();
        
        if (nTile > 0) {
            // 创建最近出牌显示
            let oTileNode = this.createTileNode(nTile, false);
            oTileNode.parent = this._oLastDiscardNode;
            
            // 添加红色高亮效果
            this.addLastDiscardHighlight(oTileNode);
            
            // 添加标签
            let oLabelNode = new cc.Node('LastDiscardLabel');
            oLabelNode.parent = this._oLastDiscardNode;
            oLabelNode.setPosition(cc.v2(0, -80));
            
            let oLabel = oLabelNode.addComponent(cc.Label);
            oLabel.string = `最新出牌 (玩家${nPlayer + 1})`;
            oLabel.fontSize = 20;
            oLabel.node.color = cc.Color.RED;
        }
    }

    /**
     * 创建牌面节点
     * 
     * @param nTile 牌值
     * @param bShowBack 是否显示牌背
     * @return 牌面节点
     */
    private createTileNode(nTile: number, bShowBack: boolean): cc.Node {
        let oNode = new cc.Node('Tile');
        
        // 添加精灵组件
        let oSprite = oNode.addComponent(cc.Sprite);
        
        if (bShowBack) {
            // 显示牌背
            // TODO: 加载牌背图片
            oNode.setContentSize(this._oTileConfig.width, this._oTileConfig.height);
        } else {
            // 显示牌面
            // TODO: 加载牌面图片
            oNode.setContentSize(this._oTileConfig.width, this._oTileConfig.height);
            
            // 如果是金牌，添加金牌标记
            if (FuzhouGoldTileDef.isGoldTile(nTile)) {
                this.addGoldMark(oNode);
            }
        }
        
        return oNode;
    }

    /**
     * 创建花牌节点
     * 
     * @param nTile 花牌值
     * @return 花牌节点
     */
    private createHuaPaiNode(nTile: number): cc.Node {
        let oNode = new cc.Node('HuaPai');
        
        // 添加精灵组件
        let oSprite = oNode.addComponent(cc.Sprite);
        
        // TODO: 加载花牌图片
        oNode.setContentSize(this._oTileConfig.width, this._oTileConfig.height);
        
        // 添加花牌名称
        let oLabelNode = new cc.Node('HuaPaiLabel');
        oLabelNode.parent = oNode;
        
        let oLabel = oLabelNode.addComponent(cc.Label);
        oLabel.string = FuzhouHuaPaiDef.getHuaName(nTile);
        oLabel.fontSize = 16;
        oLabel.node.color = cc.Color.RED;
        
        return oNode;
    }

    /**
     * 添加牌面点击事件
     * 
     * @param oTileNode 牌面节点
     * @param nTile 牌值
     */
    private addTileClickEvent(oTileNode: cc.Node, nTile: number): void {
        let oButton = oTileNode.addComponent(cc.Button);
        
        // 设置点击事件
        let oEventHandler = new cc.Component.EventHandler();
        oEventHandler.target = this._oCanvas;
        oEventHandler.component = 'FuzhouGameScene';
        oEventHandler.handler = 'onTileClick';
        oEventHandler.customEventData = nTile.toString();
        
        oButton.clickEvents.push(oEventHandler);
    }

    /**
     * 添加金牌高亮效果
     * 
     * @param oNode 节点
     */
    private addGoldHighlight(oNode: cc.Node): void {
        // 添加金色边框
        let oGraphics = oNode.addComponent(cc.Graphics);
        oGraphics.strokeColor = cc.Color.YELLOW;
        oGraphics.lineWidth = 3;
        oGraphics.rect(
            -this._oTileConfig.width / 2,
            -this._oTileConfig.height / 2,
            this._oTileConfig.width,
            this._oTileConfig.height
        );
        oGraphics.stroke();
        
        // 添加发光效果
        // TODO: 实现发光效果
    }

    /**
     * 添加最近出牌高亮效果
     * 
     * @param oNode 节点
     */
    private addLastDiscardHighlight(oNode: cc.Node): void {
        // 添加红色边框
        let oGraphics = oNode.addComponent(cc.Graphics);
        oGraphics.strokeColor = cc.Color.RED;
        oGraphics.lineWidth = 3;
        oGraphics.rect(
            -this._oTileConfig.width / 2,
            -this._oTileConfig.height / 2,
            this._oTileConfig.width,
            this._oTileConfig.height
        );
        oGraphics.stroke();
        
        // 添加脉冲动画
        // TODO: 实现脉冲动画
    }

    /**
     * 添加金牌标记
     * 
     * @param oNode 节点
     */
    private addGoldMark(oNode: cc.Node): void {
        // 添加"金"字标记
        let oMarkNode = new cc.Node('GoldMark');
        oMarkNode.parent = oNode;
        oMarkNode.setPosition(cc.v2(
            this._oTileConfig.width / 2 - 10,
            this._oTileConfig.height / 2 - 10
        ));
        
        let oLabel = oMarkNode.addComponent(cc.Label);
        oLabel.string = '金';
        oLabel.fontSize = 14;
        oLabel.node.color = cc.Color.YELLOW;
    }

    /**
     * 更新信息面板
     * 
     * @param nPlayer 玩家索引
     * @param strName 玩家名称
     * @param nScore 分数
     * @param nHuaCount 花牌数量
     */
    updateInfoPanel(nPlayer: number, strName: string, nScore: number, nHuaCount: number): void {
        let oNode = this._oInfoPanelNodes[nPlayer];
        if (!oNode) return;
        
        // 清空现有子节点
        oNode.removeAllChildren();
        
        // 创建玩家名称
        let oNameNode = new cc.Node('PlayerName');
        oNameNode.parent = oNode;
        oNameNode.setPosition(cc.v2(0, 20));
        
        let oNameLabel = oNameNode.addComponent(cc.Label);
        oNameLabel.string = strName;
        oNameLabel.fontSize = 18;
        
        // 创建分数显示
        let oScoreNode = new cc.Node('Score');
        oScoreNode.parent = oNode;
        oScoreNode.setPosition(cc.v2(0, 0));
        
        let oScoreLabel = oScoreNode.addComponent(cc.Label);
        oScoreLabel.string = `分数: ${nScore}`;
        oScoreLabel.fontSize = 16;
        
        // 创建花牌数量显示
        let oHuaNode = new cc.Node('HuaCount');
        oHuaNode.parent = oNode;
        oHuaNode.setPosition(cc.v2(0, -20));
        
        let oHuaLabel = oHuaNode.addComponent(cc.Label);
        oHuaLabel.string = `花牌: ${nHuaCount}`;
        oHuaLabel.fontSize = 16;
    }

    /**
     * 获取布局配置
     * 
     * @return 布局配置
     */
    getLayoutConfig(): UILayoutConfig {
        return this._oLayoutConfig;
    }

    /**
     * 获取牌面配置
     * 
     * @return 牌面配置
     */
    getTileConfig(): TileDisplayConfig {
        return this._oTileConfig;
    }
}
