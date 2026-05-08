/**
 * 微信小游戏SDK管理器
 * 处理微信登录、分享、排行榜等功能
 */

/**
 * 微信用户信息
 */
export interface WechatUserInfo {
    /** 用户ID */
    openid: string;
    /** 昵称 */
    nickName: string;
    /** 头像URL */
    avatarUrl: string;
    /** 性别 */
    gender: number;
    /** 城市 */
    city: string;
    /** 省份 */
    province: string;
    /** 国家 */
    country: string;
}

/**
 * 分享配置
 */
export interface ShareConfig {
    /** 分享标题 */
    title: string;
    /** 分享描述 */
    desc: string;
    /** 分享链接 */
    link: string;
    /** 分享图片URL */
    imageUrl: string;
}

/**
 * 排行榜数据
 */
export interface RankData {
    /** 用户ID */
    openid: string;
    /** 昵称 */
    nickName: string;
    /** 头像URL */
    avatarUrl: string;
    /** 分数 */
    score: number;
    /** 排名 */
    rank: number;
}

/**
 * 微信小游戏SDK管理器
 */
export default class WechatSDKManager {
    /** 单例实例 */
    private static _oInstance: WechatSDKManager = null;
    
    /** 用户信息 */
    private _oUserInfo: WechatUserInfo = null;
    
    /** 是否已登录 */
    private _bIsLogin: boolean = false;
    
    /** 登录回调 */
    private _oLoginCallback: (success: boolean) => void = null;
    
    /** 分享回调 */
    private _oShareCallback: (success: boolean) => void = null;

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
    static getInstance(): WechatSDKManager {
        if (!WechatSDKManager._oInstance) {
            WechatSDKManager._oInstance = new WechatSDKManager();
        }
        return WechatSDKManager._oInstance;
    }

    /**
     * 初始化微信SDK
     */
    init(): void {
        // 检查是否在微信环境中
        if (!this.isWechatEnvironment()) {
            console.log('不在微信环境中');
            return;
        }
        
        // 设置分享菜单
        this.showShareMenu();
        
        // 设置分享回调
        this.setShareCallback();
    }

    /**
     * 检查是否在微信环境中
     * 
     * @return 是否在微信环境中
     */
    isWechatEnvironment(): boolean {
        return typeof wx !== 'undefined';
    }

    /**
     * 微信登录
     * 
     * @param callback 登录回调
     */
    login(callback: (success: boolean) => void): void {
        if (!this.isWechatEnvironment()) {
            console.log('不在微信环境中');
            callback(false);
            return;
        }
        
        this._oLoginCallback = callback;
        
        wx.login({
            success: (res: any) => {
                if (res.code) {
                    console.log('登录成功，code:', res.code);
                    
                    // 获取用户信息
                    this.getUserInfo();
                } else {
                    console.log('登录失败：', res.errMsg);
                    callback(false);
                }
            },
            fail: (err: any) => {
                console.log('登录失败：', err);
                callback(false);
            }
        });
    }

    /**
     * 获取用户信息
     */
    private getUserInfo(): void {
        wx.getUserInfo({
            success: (res: any) => {
                this._oUserInfo = {
                    openid: '', // 需要通过服务端获取
                    nickName: res.userInfo.nickName,
                    avatarUrl: res.userInfo.avatarUrl,
                    gender: res.userInfo.gender,
                    city: res.userInfo.city,
                    province: res.userInfo.province,
                    country: res.userInfo.country,
                };
                
                this._bIsLogin = true;
                
                if (this._oLoginCallback) {
                    this._oLoginCallback(true);
                }
            },
            fail: (err: any) => {
                console.log('获取用户信息失败：', err);
                
                if (this._oLoginCallback) {
                    this._oLoginCallback(false);
                }
            }
        });
    }

    /**
     * 显示分享菜单
     */
    private showShareMenu(): void {
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
    }

    /**
     * 设置分享回调
     */
    private setShareCallback(): void {
        wx.onShareAppMessage(() => {
            return {
                title: '福州麻将 - 经典麻将游戏',
                desc: '快来和我一起玩福州麻将吧！',
                imageUrl: '', // TODO: 设置分享图片
            };
        });
    }

    /**
     * 分享到朋友圈
     * 
     * @param config 分享配置
     * @param callback 分享回调
     */
    shareToTimeline(config: ShareConfig, callback: (success: boolean) => void): void {
        if (!this.isWechatEnvironment()) {
            console.log('不在微信环境中');
            callback(false);
            return;
        }
        
        this._oShareCallback = callback;
        
        wx.shareTimeline({
            title: config.title,
            imageUrl: config.imageUrl,
            query: '',
            success: () => {
                console.log('分享成功');
                callback(true);
            },
            fail: (err: any) => {
                console.log('分享失败：', err);
                callback(false);
            }
        });
    }

    /**
     * 分享给朋友
     * 
     * @param config 分享配置
     * @param callback 分享回调
     */
    shareToFriend(config: ShareConfig, callback: (success: boolean) => void): void {
        if (!this.isWechatEnvironment()) {
            console.log('不在微信环境中');
            callback(false);
            return;
        }
        
        this._oShareCallback = callback;
        
        wx.shareAppMessage({
            title: config.title,
            desc: config.desc,
            imageUrl: config.imageUrl,
            success: () => {
                console.log('分享成功');
                callback(true);
            },
            fail: (err: any) => {
                console.log('分享失败：', err);
                callback(false);
            }
        });
    }

    /**
     * 获取排行榜数据
     * 
     * @param callback 回调
     */
    getRankData(callback: (data: Array<RankData>) => void): void {
        if (!this.isWechatEnvironment()) {
            console.log('不在微信环境中');
            callback([]);
            return;
        }
        
        // TODO: 实现排行榜数据获取
        // 需要使用微信开放数据域
        console.log('获取排行榜数据');
        callback([]);
    }

    /**
     * 设置用户分数
     * 
     * @param score 分数
     * @param callback 回调
     */
    setUserScore(score: number, callback: (success: boolean) => void): void {
        if (!this.isWechatEnvironment()) {
            console.log('不在微信环境中');
            callback(false);
            return;
        }
        
        // TODO: 实现用户分数设置
        // 需要使用微信开放数据域
        console.log('设置用户分数：', score);
        callback(true);
    }

    /**
     * 显示排行榜
     */
    showRank(): void {
        if (!this.isWechatEnvironment()) {
            console.log('不在微信环境中');
            return;
        }
        
        // TODO: 实现排行榜显示
        // 需要使用微信开放数据域
        console.log('显示排行榜');
    }

    /**
     * 显示广告
     * 
     * @param callback 回调
     */
    showAd(callback: (success: boolean) => void): void {
        if (!this.isWechatEnvironment()) {
            console.log('不在微信环境中');
            callback(false);
            return;
        }
        
        // TODO: 实现广告显示
        console.log('显示广告');
        callback(true);
    }

    /**
     * 获取用户信息
     * 
     * @return 用户信息
     */
    getUserInfoSync(): WechatUserInfo {
        return this._oUserInfo;
    }

    /**
     * 是否已登录
     * 
     * @return 是否已登录
     */
    isLoggedIn(): boolean {
        return this._bIsLogin;
    }

    /**
     * 获取OpenID
     * 
     * @return OpenID
     */
    getOpenID(): string {
        return this._oUserInfo ? this._oUserInfo.openid : '';
    }
}
