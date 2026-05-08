/**
 * 福州麻将主入口文件
 * 游戏启动和初始化
 */

import FuzhouConfigManager from "./FuzhouConfigManager";
import FuzhouDataManager from "./FuzhouDataManager";
import FuzhouEventManager from "./FuzhouEventManager";
import FuzhouSoundManager from "./FuzhouSoundManager";
import FuzhouUIManager from "./FuzhouUIManager";
import FuzhouNetworkManager from "./FuzhouNetworkManager";
import FuzhouAIManager from "./FuzhouAIManager";
import WechatSDKManager from "./WechatSDKManager";
import PerformanceManager from "./PerformanceManager";

/**
 * 福州麻将主入口类
 */
export default class FuzhouMahjong {
    /** 单例实例 */
    private static _oInstance: FuzhouMahjong = null;
    
    /** 是否已初始化 */
    private _bInitialized: boolean = false;

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
    static getInstance(): FuzhouMahjong {
        if (!FuzhouMahjong._oInstance) {
            FuzhouMahjong._oInstance = new FuzhouMahjong();
        }
        return FuzhouMahjong._oInstance;
    }

    /**
     * 初始化游戏
     */
    init(): void {
        if (this._bInitialized) {
            console.log('福州麻将已初始化');
            return;
        }
        
        console.log('福州麻将初始化开始');
        
        // 初始化配置管理器
        let configManager = FuzhouConfigManager.getInstance();
        console.log('配置管理器初始化完成');
        
        // 初始化数据管理器
        let dataManager = FuzhouDataManager.getInstance();
        console.log('数据管理器初始化完成');
        
        // 初始化事件管理器
        let eventManager = FuzhouEventManager.getInstance();
        console.log('事件管理器初始化完成');
        
        // 初始化音效管理器
        let soundManager = FuzhouSoundManager.getInstance();
        console.log('音效管理器初始化完成');
        
        // 初始化AI管理器
        let aiManager = FuzhouAIManager.getInstance();
        console.log('AI管理器初始化完成');
        
        // 初始化性能优化
        let performanceManager = PerformanceManager.getInstance();
        performanceManager.init();
        console.log('性能优化初始化完成');
        
        // 初始化微信SDK
        if (typeof wx !== 'undefined') {
            let wechatManager = WechatSDKManager.getInstance();
            wechatManager.init();
            console.log('微信SDK初始化完成');
        }
        
        // 注册全局事件
        this.registerGlobalEvents();
        console.log('全局事件注册完成');
        
        this._bInitialized = true;
        
        console.log('福州麻将初始化完成');
    }

    /**
     * 注册全局事件
     */
    private registerGlobalEvents(): void {
        let eventManager = FuzhouEventManager.getInstance();
        
        // 注册音效事件
        eventManager.on('sound_play' as any, (data: any) => {
            let soundManager = FuzhouSoundManager.getInstance();
            soundManager.playSound(data.type);
        });
        
        // 注册震动事件
        eventManager.on('vibrate' as any, (data: any) => {
            if (cc.sys.isMobile) {
                // 微信小游戏震动
                if (typeof wx !== 'undefined') {
                    wx.vibrateShort();
                }
            }
        });
        
        // 注册提示事件
        eventManager.on('show_toast' as any, (data: any) => {
            console.log('提示:', data.message);
        });
        
        // 注册对话框事件
        eventManager.on('show_dialog' as any, (data: any) => {
            console.log('对话框:', data.title, data.content);
        });
    }

    /**
     * 获取配置管理器
     * 
     * @return 配置管理器
     */
    getConfigManager(): FuzhouConfigManager {
        return FuzhouConfigManager.getInstance();
    }

    /**
     * 获取数据管理器
     * 
     * @return 数据管理器
     */
    getDataManager(): FuzhouDataManager {
        return FuzhouDataManager.getInstance();
    }

    /**
     * 获取事件管理器
     * 
     * @return 事件管理器
     */
    getEventManager(): FuzhouEventManager {
        return FuzhouEventManager.getInstance();
    }

    /**
     * 获取音效管理器
     * 
     * @return 音效管理器
     */
    getSoundManager(): FuzhouSoundManager {
        return FuzhouSoundManager.getInstance();
    }

    /**
     * 获取UI管理器
     * 
     * @return UI管理器
     */
    getUIManager(): FuzhouUIManager {
        return FuzhouUIManager.getInstance();
    }

    /**
     * 获取网络管理器
     * 
     * @return 网络管理器
     */
    getNetworkManager(): FuzhouNetworkManager {
        return FuzhouNetworkManager.getInstance();
    }

    /**
     * 获取AI管理器
     * 
     * @return AI管理器
     */
    getAIManager(): FuzhouAIManager {
        return FuzhouAIManager.getInstance();
    }

    /**
     * 获取微信SDK管理器
     * 
     * @return 微信SDK管理器
     */
    getWechatManager(): WechatSDKManager {
        return WechatSDKManager.getInstance();
    }

    /**
     * 获取性能管理器
     * 
     * @return 性能管理器
     */
    getPerformanceManager(): PerformanceManager {
        return PerformanceManager.getInstance();
    }

    /**
     * 是否已初始化
     * 
     * @return 是否已初始化
     */
    isInitialized(): boolean {
        return this._bInitialized;
    }

    /**
     * 获取版本号
     * 
     * @return 版本号
     */
    getVersion(): string {
        return FuzhouConfigManager.getInstance().getVersion();
    }

    /**
     * 获取游戏名称
     * 
     * @return 游戏名称
     */
    getGameName(): string {
        return FuzhouConfigManager.getInstance().getGameName();
    }

    /**
     * 销毁游戏
     */
    destroy(): void {
        // 停止所有音效
        FuzhouSoundManager.getInstance().stopAll();
        
        // 清除所有事件
        FuzhouEventManager.getInstance().clearAll();
        
        // 断开网络连接
        FuzhouNetworkManager.getInstance().disconnect();
        
        this._bInitialized = false;
        
        console.log('福州麻将已销毁');
    }
}
