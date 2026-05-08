/**
 * 福州麻将配置管理器
 * 处理游戏配置和常量定义
 */

/**
 * 游戏配置
 */
export interface GameConfig {
    /** 版本号 */
    version: string;
    /** 游戏名称 */
    gameName: string;
    /** 服务器地址 */
    serverUrl: string;
    /** 是否启用调试模式 */
    debugMode: boolean;
    /** 是否启用音效 */
    soundEnabled: boolean;
    /** 是否启用背景音乐 */
    bgmEnabled: boolean;
    /** 是否启用震动 */
    vibrateEnabled: boolean;
    /** 是否启用分享 */
    shareEnabled: boolean;
    /** 是否启用广告 */
    adEnabled: boolean;
}

/**
 * 福州麻将配置管理器
 */
export default class FuzhouConfigManager {
    /** 单例实例 */
    private static _oInstance: FuzhouConfigManager = null;
    
    /** 游戏配置 */
    private _oConfig: GameConfig;

    /**
     * 私有化类默认构造器
     */
    private constructor() {
        this.initConfig();
    }

    /**
     * 获取单例实例
     * 
     * @return 单例实例
     */
    static getInstance(): FuzhouConfigManager {
        if (!FuzhouConfigManager._oInstance) {
            FuzhouConfigManager._oInstance = new FuzhouConfigManager();
        }
        return FuzhouConfigManager._oInstance;
    }

    /**
     * 初始化配置
     */
    private initConfig(): void {
        this._oConfig = {
            version: '1.0.0',
            gameName: '福州麻将',
            serverUrl: 'ws://localhost:8080',
            debugMode: false,
            soundEnabled: true,
            bgmEnabled: true,
            vibrateEnabled: true,
            shareEnabled: true,
            adEnabled: false,
        };
    }

    /**
     * 获取配置
     * 
     * @return 配置
     */
    getConfig(): GameConfig {
        return this._oConfig;
    }

    /**
     * 设置配置
     * 
     * @param config 配置
     */
    setConfig(config: Partial<GameConfig>): void {
        this._oConfig = { ...this._oConfig, ...config };
    }

    /**
     * 获取版本号
     * 
     * @return 版本号
     */
    getVersion(): string {
        return this._oConfig.version;
    }

    /**
     * 获取游戏名称
     * 
     * @return 游戏名称
     */
    getGameName(): string {
        return this._oConfig.gameName;
    }

    /**
     * 获取服务器地址
     * 
     * @return 服务器地址
     */
    getServerUrl(): string {
        return this._oConfig.serverUrl;
    }

    /**
     * 是否启用调试模式
     * 
     * @return 是否启用调试模式
     */
    isDebugMode(): boolean {
        return this._oConfig.debugMode;
    }

    /**
     * 是否启用音效
     * 
     * @return 是否启用音效
     */
    isSoundEnabled(): boolean {
        return this._oConfig.soundEnabled;
    }

    /**
     * 是否启用背景音乐
     * 
     * @return 是否启用背景音乐
     */
    isBGMEnabled(): boolean {
        return this._oConfig.bgmEnabled;
    }

    /**
     * 是否启用震动
     * 
     * @return 是否启用震动
     */
    isVibrateEnabled(): boolean {
        return this._oConfig.vibrateEnabled;
    }

    /**
     * 是否启用分享
     * 
     * @return 是否启用分享
     */
    isShareEnabled(): boolean {
        return this._oConfig.shareEnabled;
    }

    /**
     * 是否启用广告
     * 
     * @return 是否启用广告
     */
    isAdEnabled(): boolean {
        return this._oConfig.adEnabled;
    }

    /**
     * 设置服务器地址
     * 
     * @param url 服务器地址
     */
    setServerUrl(url: string): void {
        this._oConfig.serverUrl = url;
    }

    /**
     * 设置调试模式
     * 
     * @param enabled 是否启用
     */
    setDebugMode(enabled: boolean): void {
        this._oConfig.debugMode = enabled;
    }

    /**
     * 设置音效开关
     * 
     * @param enabled 是否启用
     */
    setSoundEnabled(enabled: boolean): void {
        this._oConfig.soundEnabled = enabled;
    }

    /**
     * 设置背景音乐开关
     * 
     * @param enabled 是否启用
     */
    setBGMEnabled(enabled: boolean): void {
        this._oConfig.bgmEnabled = enabled;
    }

    /**
     * 设置震动开关
     * 
     * @param enabled 是否启用
     */
    setVibrateEnabled(enabled: boolean): void {
        this._oConfig.vibrateEnabled = enabled;
    }

    /**
     * 设置分享开关
     * 
     * @param enabled 是否启用
     */
    setShareEnabled(enabled: boolean): void {
        this._oConfig.shareEnabled = enabled;
    }

    /**
     * 设置广告开关
     * 
     * @param enabled 是否启用
     */
    setAdEnabled(enabled: boolean): void {
        this._oConfig.adEnabled = enabled;
    }
}
