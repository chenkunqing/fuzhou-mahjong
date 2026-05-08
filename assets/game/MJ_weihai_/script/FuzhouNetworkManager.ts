/**
 * 福州麻将网络管理器
 * 处理网络通信和多人对战
 */

/**
 * 网络消息类型
 */
export enum MessageType {
    // 房间管理
    CREATE_ROOM = 1001,
    JOIN_ROOM = 1002,
    LEAVE_ROOM = 1003,
    DISSOLVE_ROOM = 1004,
    
    // 游戏流程
    GAME_START = 2001,
    GAME_DEAL = 2002,
    GAME_DRAW = 2003,
    GAME_DISCARD = 2004,
    GAME_CHI = 2005,
    GAME_PENG = 2006,
    GAME_GANG = 2007,
    GAME_HU = 2008,
    GAME_BU_HUA = 2009,
    GAME_FLIP_GOLD = 2010,
    
    // 游戏状态
    SYNC_STATE = 3001,
    GAME_OVER = 3002,
    
    // 聊天
    CHAT = 4001,
    EMOJI = 4002,
}

/**
 * 网络消息
 */
export interface NetworkMessage {
    /** 消息类型 */
    type: MessageType;
    /** 消息数据 */
    data: any;
    /** 时间戳 */
    timestamp: number;
}

/**
 * 房间信息
 */
export interface RoomInfo {
    /** 房间ID */
    roomId: string;
    /** 房主ID */
    ownerId: string;
    /** 玩家列表 */
    players: Array<string>;
    /** 游戏状态 */
    gameState: number;
    /** 规则设置 */
    rules: any;
}

/**
 * 福州麻将网络管理器
 */
export default class FuzhouNetworkManager {
    /** 单例实例 */
    private static _oInstance: FuzhouNetworkManager = null;
    
    /** WebSocket连接 */
    private _oSocket: WebSocket = null;
    
    /** 服务器地址 */
    private _strServerUrl: string = '';
    
    /** 是否已连接 */
    private _bIsConnected: boolean = false;
    
    /** 消息回调 */
    private _oMessageCallbacks: Map<MessageType, Array<(data: any) => void>> = new Map();
    
    /** 房间信息 */
    private _oRoomInfo: RoomInfo = null;
    
    /** 玩家ID */
    private _strPlayerId: string = '';

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
    static getInstance(): FuzhouNetworkManager {
        if (!FuzhouNetworkManager._oInstance) {
            FuzhouNetworkManager._oInstance = new FuzhouNetworkManager();
        }
        return FuzhouNetworkManager._oInstance;
    }

    /**
     * 连接服务器
     * 
     * @param strUrl 服务器地址
     * @param callback 连接回调
     */
    connect(strUrl: string, callback: (success: boolean) => void): void {
        this._strServerUrl = strUrl;
        
        try {
            this._oSocket = new WebSocket(strUrl);
            
            this._oSocket.onopen = () => {
                console.log('连接服务器成功');
                this._bIsConnected = true;
                callback(true);
            };
            
            this._oSocket.onmessage = (event: MessageEvent) => {
                this.handleMessage(event.data);
            };
            
            this._oSocket.onclose = () => {
                console.log('连接关闭');
                this._bIsConnected = false;
            };
            
            this._oSocket.onerror = (error: Event) => {
                console.error('连接错误:', error);
                this._bIsConnected = false;
                callback(false);
            };
        } catch (error) {
            console.error('连接失败:', error);
            callback(false);
        }
    }

    /**
     * 断开连接
     */
    disconnect(): void {
        if (this._oSocket) {
            this._oSocket.close();
            this._oSocket = null;
            this._bIsConnected = false;
        }
    }

    /**
     * 发送消息
     * 
     * @param type 消息类型
     * @param data 消息数据
     */
    send(type: MessageType, data: any): void {
        if (!this._bIsConnected || !this._oSocket) {
            console.error('未连接到服务器');
            return;
        }
        
        let message: NetworkMessage = {
            type: type,
            data: data,
            timestamp: Date.now(),
        };
        
        this._oSocket.send(JSON.stringify(message));
    }

    /**
     * 处理消息
     * 
     * @param strData 消息数据
     */
    private handleMessage(strData: string): void {
        try {
            let message: NetworkMessage = JSON.parse(strData);
            
            // 调用回调
            let callbacks = this._oMessageCallbacks.get(message.type);
            if (callbacks) {
                for (let callback of callbacks) {
                    callback(message.data);
                }
            }
        } catch (error) {
            console.error('解析消息失败:', error);
        }
    }

    /**
     * 注册消息回调
     * 
     * @param type 消息类型
     * @param callback 回调函数
     */
    on(type: MessageType, callback: (data: any) => void): void {
        if (!this._oMessageCallbacks.has(type)) {
            this._oMessageCallbacks.set(type, []);
        }
        this._oMessageCallbacks.get(type).push(callback);
    }

    /**
     * 移除消息回调
     * 
     * @param type 消息类型
     * @param callback 回调函数
     */
    off(type: MessageType, callback: (data: any) => void): void {
        let callbacks = this._oMessageCallbacks.get(type);
        if (callbacks) {
            let index = callbacks.indexOf(callback);
            if (index >= 0) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * 创建房间
     * 
     * @param rules 房间规则
     * @param callback 回调
     */
    createRoom(rules: any, callback: (roomId: string) => void): void {
        this.send(MessageType.CREATE_ROOM, { rules: rules });
        
        // 注册临时回调
        let handler = (data: any) => {
            if (data.roomId) {
                callback(data.roomId);
                this.off(MessageType.CREATE_ROOM, handler);
            }
        };
        this.on(MessageType.CREATE_ROOM, handler);
    }

    /**
     * 加入房间
     * 
     * @param roomId 房间ID
     * @param callback 回调
     */
    joinRoom(roomId: string, callback: (success: boolean) => void): void {
        this.send(MessageType.JOIN_ROOM, { roomId: roomId });
        
        // 注册临时回调
        let handler = (data: any) => {
            if (data.success !== undefined) {
                callback(data.success);
                this.off(MessageType.JOIN_ROOM, handler);
            }
        };
        this.on(MessageType.JOIN_ROOM, handler);
    }

    /**
     * 离开房间
     * 
     * @param callback 回调
     */
    leaveRoom(callback: (success: boolean) => void): void {
        this.send(MessageType.LEAVE_ROOM, {});
        
        // 注册临时回调
        let handler = (data: any) => {
            if (data.success !== undefined) {
                callback(data.success);
                this.off(MessageType.LEAVE_ROOM, handler);
            }
        };
        this.on(MessageType.LEAVE_ROOM, handler);
    }

    /**
     * 出牌
     * 
     * @param tile 牌值
     */
    discard(tile: number): void {
        this.send(MessageType.GAME_DISCARD, { tile: tile });
    }

    /**
     * 吃牌
     * 
     * @param tile 牌值
     * @param combo 吃的组合
     */
    chi(tile: number, combo: Array<number>): void {
        this.send(MessageType.GAME_CHI, { tile: tile, combo: combo });
    }

    /**
     * 碰牌
     * 
     * @param tile 牌值
     */
    peng(tile: number): void {
        this.send(MessageType.GAME_PENG, { tile: tile });
    }

    /**
     * 杠牌
     * 
     * @param tile 牌值
     * @param type 杠类型
     */
    gang(tile: number, type: number): void {
        this.send(MessageType.GAME_GANG, { tile: tile, type: type });
    }

    /**
     * 胡牌
     * 
     * @param tile 牌值
     */
    hu(tile: number): void {
        this.send(MessageType.GAME_HU, { tile: tile });
    }

    /**
     * 发送聊天消息
     * 
     * @param content 消息内容
     */
    chat(content: string): void {
        this.send(MessageType.CHAT, { content: content });
    }

    /**
     * 发送表情
     * 
     * @param emojiId 表情ID
     */
    emoji(emojiId: number): void {
        this.send(MessageType.EMOJI, { emojiId: emojiId });
    }

    /**
     * 是否已连接
     * 
     * @return 是否已连接
     */
    isConnected(): boolean {
        return this._bIsConnected;
    }

    /**
     * 获取房间信息
     * 
     * @return 房间信息
     */
    getRoomInfo(): RoomInfo {
        return this._oRoomInfo;
    }

    /**
     * 设置玩家ID
     * 
     * @param playerId 玩家ID
     */
    setPlayerId(playerId: string): void {
        this._strPlayerId = playerId;
    }

    /**
     * 获取玩家ID
     * 
     * @return 玩家ID
     */
    getPlayerId(): string {
        return this._strPlayerId;
    }
}
