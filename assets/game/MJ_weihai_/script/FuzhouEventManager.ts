/**
 * 福州麻将事件管理器
 * 处理游戏事件和消息传递
 */

/**
 * 事件类型
 */
export enum EventType {
    // 游戏流程事件
    GAME_START = 'game_start',
    GAME_DEAL = 'game_deal',
    GAME_DRAW = 'game_draw',
    GAME_DISCARD = 'game_discard',
    GAME_CHI = 'game_chi',
    GAME_PENG = 'game_peng',
    GAME_GANG = 'game_gang',
    GAME_HU = 'game_hu',
    GAME_BU_HUA = 'game_bu_hua',
    GAME_FLIP_GOLD = 'game_flip_gold',
    GAME_NEXT_ROUND = 'game_next_round',
    GAME_OVER = 'game_over',
    
    // UI事件
    TILE_CLICK = 'tile_click',
    BUTTON_CLICK = 'button_click',
    
    // 网络事件
    NETWORK_CONNECT = 'network_connect',
    NETWORK_DISCONNECT = 'network_disconnect',
    NETWORK_MESSAGE = 'network_message',
    
    // 系统事件
    SOUND_PLAY = 'sound_play',
    VIBRATE = 'vibrate',
    SHOW_TOAST = 'show_toast',
    SHOW_DIALOG = 'show_dialog',
}

/**
 * 事件数据
 */
export interface EventData {
    /** 事件类型 */
    type: EventType;
    /** 事件数据 */
    data: any;
    /** 时间戳 */
    timestamp: number;
}

/**
 * 事件回调
 */
export type EventCallback = (data: any) => void;

/**
 * 福州麻将事件管理器
 */
export default class FuzhouEventManager {
    /** 单例实例 */
    private static _oInstance: FuzhouEventManager = null;
    
    /** 事件监听器 */
    private _oListeners: Map<EventType, Array<EventCallback>> = new Map();
    
    /** 事件队列 */
    private _oEventQueue: Array<EventData> = [];
    
    /** 是否正在处理事件 */
    private _bProcessing: boolean = false;

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
    static getInstance(): FuzhouEventManager {
        if (!FuzhouEventManager._oInstance) {
            FuzhouEventManager._oInstance = new FuzhouEventManager();
        }
        return FuzhouEventManager._oInstance;
    }

    /**
     * 注册事件监听器
     * 
     * @param type 事件类型
     * @param callback 回调函数
     */
    on(type: EventType, callback: EventCallback): void {
        if (!this._oListeners.has(type)) {
            this._oListeners.set(type, []);
        }
        this._oListeners.get(type).push(callback);
    }

    /**
     * 移除事件监听器
     * 
     * @param type 事件类型
     * @param callback 回调函数
     */
    off(type: EventType, callback: EventCallback): void {
        let listeners = this._oListeners.get(type);
        if (listeners) {
            let index = listeners.indexOf(callback);
            if (index >= 0) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * 触发事件
     * 
     * @param type 事件类型
     * @param data 事件数据
     */
    emit(type: EventType, data: any = null): void {
        let event: EventData = {
            type: type,
            data: data,
            timestamp: Date.now(),
        };
        
        // 添加到事件队列
        this._oEventQueue.push(event);
        
        // 处理事件队列
        if (!this._bProcessing) {
            this.processEventQueue();
        }
    }

    /**
     * 同步触发事件
     * 
     * @param type 事件类型
     * @param data 事件数据
     */
    emitSync(type: EventType, data: any = null): void {
        let listeners = this._oListeners.get(type);
        if (listeners) {
            for (let callback of listeners) {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`事件处理错误 [${type}]:`, error);
                }
            }
        }
    }

    /**
     * 处理事件队列
     */
    private processEventQueue(): void {
        if (this._oEventQueue.length === 0) {
            this._bProcessing = false;
            return;
        }
        
        this._bProcessing = true;
        
        let event = this._oEventQueue.shift();
        let listeners = this._oListeners.get(event.type);
        
        if (listeners) {
            for (let callback of listeners) {
                try {
                    callback(event.data);
                } catch (error) {
                    console.error(`事件处理错误 [${event.type}]:`, error);
                }
            }
        }
        
        // 继续处理下一个事件
        setTimeout(() => {
            this.processEventQueue();
        }, 0);
    }

    /**
     * 清除所有监听器
     */
    clearAll(): void {
        this._oListeners.clear();
        this._oEventQueue = [];
        this._bProcessing = false;
    }

    /**
     * 清除指定类型的监听器
     * 
     * @param type 事件类型
     */
    clearByType(type: EventType): void {
        this._oListeners.delete(type);
    }

    /**
     * 获取监听器数量
     * 
     * @param type 事件类型
     * @return 监听器数量
     */
    getListenerCount(type: EventType): number {
        let listeners = this._oListeners.get(type);
        return listeners ? listeners.length : 0;
    }

    /**
     * 获取事件队列长度
     * 
     * @return 事件队列长度
     */
    getQueueLength(): number {
        return this._oEventQueue.length;
    }

    /**
     * 是否正在处理事件
     * 
     * @return 是否正在处理事件
     */
    isProcessing(): boolean {
        return this._bProcessing;
    }
}
