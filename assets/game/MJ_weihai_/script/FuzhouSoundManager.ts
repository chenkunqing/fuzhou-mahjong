/**
 * 福州麻将音效管理器
 * 处理游戏音效和背景音乐
 */

/**
 * 音效类型
 */
export enum SoundType {
    // 背景音乐
    BGM = 'bgm',
    
    // 游戏音效
    DEAL = 'deal',           // 发牌
    DRAW = 'draw',           // 摸牌
    DISCARD = 'discard',     // 出牌
    CHI = 'chi',             // 吃
    PENG = 'peng',           // 碰
    GANG = 'gang',           // 杠
    HU = 'hu',               // 胡
    BU_HUA = 'bu_hua',       // 补花
    FLIP_GOLD = 'flip_gold', // 翻金
    
    // 特殊音效
    TIAN_HU = 'tian_hu',     // 天胡
    JIN_QUE = 'jin_que',     // 金雀
    JIN_LONG = 'jin_long',   // 金龙
    
    // UI音效
    BUTTON = 'button',       // 按钮
    WIN = 'win',             // 胜利
    LOSE = 'lose',           // 失败
}

/**
 * 音效配置
 */
export interface SoundConfig {
    /** 音效文件路径 */
    path: string;
    /** 音量 */
    volume: number;
    /** 是否循环 */
    loop: boolean;
}

/**
 * 福州麻将音效管理器
 */
export default class FuzhouSoundManager {
    /** 单例实例 */
    private static _oInstance: FuzhouSoundManager = null;
    
    /** 音效配置 */
    private _oSoundConfigs: Map<SoundType, SoundConfig> = new Map();
    
    /** 是否启用音效 */
    private _bEnableSound: boolean = true;
    
    /** 是否启用背景音乐 */
    private _bEnableBGM: boolean = true;
    
    /** 音效音量 */
    private _nSoundVolume: number = 1.0;
    
    /** 背景音乐音量 */
    private _nBGMVolume: number = 0.5;
    
    /** 当前背景音乐ID */
    private _nBGMId: number = -1;

    /**
     * 私有化类默认构造器
     */
    private constructor() {
        this.initSoundConfigs();
    }

    /**
     * 获取单例实例
     * 
     * @return 单例实例
     */
    static getInstance(): FuzhouSoundManager {
        if (!FuzhouSoundManager._oInstance) {
            FuzhouSoundManager._oInstance = new FuzhouSoundManager();
        }
        return FuzhouSoundManager._oInstance;
    }

    /**
     * 初始化音效配置
     */
    private initSoundConfigs(): void {
        // 背景音乐
        this._oSoundConfigs.set(SoundType.BGM, {
            path: 'res/audio/bgm',
            volume: 0.5,
            loop: true,
        });
        
        // 游戏音效
        this._oSoundConfigs.set(SoundType.DEAL, {
            path: 'res/audio/deal',
            volume: 1.0,
            loop: false,
        });
        
        this._oSoundConfigs.set(SoundType.DRAW, {
            path: 'res/audio/draw',
            volume: 1.0,
            loop: false,
        });
        
        this._oSoundConfigs.set(SoundType.DISCARD, {
            path: 'res/audio/discard',
            volume: 1.0,
            loop: false,
        });
        
        this._oSoundConfigs.set(SoundType.CHI, {
            path: 'res/audio/chi',
            volume: 1.0,
            loop: false,
        });
        
        this._oSoundConfigs.set(SoundType.PENG, {
            path: 'res/audio/peng',
            volume: 1.0,
            loop: false,
        });
        
        this._oSoundConfigs.set(SoundType.GANG, {
            path: 'res/audio/gang',
            volume: 1.0,
            loop: false,
        });
        
        this._oSoundConfigs.set(SoundType.HU, {
            path: 'res/audio/hu',
            volume: 1.0,
            loop: false,
        });
        
        this._oSoundConfigs.set(SoundType.BU_HUA, {
            path: 'res/audio/bu_hua',
            volume: 1.0,
            loop: false,
        });
        
        this._oSoundConfigs.set(SoundType.FLIP_GOLD, {
            path: 'res/audio/flip_gold',
            volume: 1.0,
            loop: false,
        });
        
        // 特殊音效
        this._oSoundConfigs.set(SoundType.TIAN_HU, {
            path: 'res/audio/tian_hu',
            volume: 1.0,
            loop: false,
        });
        
        this._oSoundConfigs.set(SoundType.JIN_QUE, {
            path: 'res/audio/jin_que',
            volume: 1.0,
            loop: false,
        });
        
        this._oSoundConfigs.set(SoundType.JIN_LONG, {
            path: 'res/audio/jin_long',
            volume: 1.0,
            loop: false,
        });
        
        // UI音效
        this._oSoundConfigs.set(SoundType.BUTTON, {
            path: 'res/audio/button',
            volume: 1.0,
            loop: false,
        });
        
        this._oSoundConfigs.set(SoundType.WIN, {
            path: 'res/audio/win',
            volume: 1.0,
            loop: false,
        });
        
        this._oSoundConfigs.set(SoundType.LOSE, {
            path: 'res/audio/lose',
            volume: 1.0,
            loop: false,
        });
    }

    /**
     * 播放音效
     * 
     * @param type 音效类型
     */
    playSound(type: SoundType): void {
        if (!this._bEnableSound) {
            return;
        }
        
        let config = this._oSoundConfigs.get(type);
        if (!config) {
            console.warn('未找到音效配置:', type);
            return;
        }
        
        // 加载并播放音效
        cc.loader.loadRes(config.path, cc.AudioClip, (err, clip) => {
            if (err) {
                console.error('加载音效失败:', err);
                return;
            }
            
            let audioId = cc.audioEngine.playEffect(clip, config.loop);
            cc.audioEngine.setVolume(audioId, config.volume * this._nSoundVolume);
        });
    }

    /**
     * 播放背景音乐
     * 
     * @param type 音效类型
     */
    playBGM(type: SoundType = SoundType.BGM): void {
        if (!this._bEnableBGM) {
            return;
        }
        
        // 停止当前背景音乐
        this.stopBGM();
        
        let config = this._oSoundConfigs.get(type);
        if (!config) {
            console.warn('未找到背景音乐配置:', type);
            return;
        }
        
        // 加载并播放背景音乐
        cc.loader.loadRes(config.path, cc.AudioClip, (err, clip) => {
            if (err) {
                console.error('加载背景音乐失败:', err);
                return;
            }
            
            this._nBGMId = cc.audioEngine.playMusic(clip, config.loop);
            cc.audioEngine.setVolume(this._nBGMId, config.volume * this._nBGMVolume);
        });
    }

    /**
     * 停止背景音乐
     */
    stopBGM(): void {
        if (this._nBGMId >= 0) {
            cc.audioEngine.stopMusic();
            this._nBGMId = -1;
        }
    }

    /**
     * 暂停背景音乐
     */
    pauseBGM(): void {
        if (this._nBGMId >= 0) {
            cc.audioEngine.pauseMusic();
        }
    }

    /**
     * 恢复背景音乐
     */
    resumeBGM(): void {
        if (this._nBGMId >= 0) {
            cc.audioEngine.resumeMusic();
        }
    }

    /**
     * 设置音效开关
     * 
     * @param enable 是否启用
     */
    setSoundEnable(enable: boolean): void {
        this._bEnableSound = enable;
        
        if (!enable) {
            // 停止所有音效
            cc.audioEngine.stopAllEffects();
        }
    }

    /**
     * 设置背景音乐开关
     * 
     * @param enable 是否启用
     */
    setBGMEnable(enable: boolean): void {
        this._bEnableBGM = enable;
        
        if (enable) {
            this.playBGM();
        } else {
            this.stopBGM();
        }
    }

    /**
     * 设置音效音量
     * 
     * @param volume 音量（0-1）
     */
    setSoundVolume(volume: number): void {
        this._nSoundVolume = Math.max(0, Math.min(1, volume));
    }

    /**
     * 设置背景音乐音量
     * 
     * @param volume 音量（0-1）
     */
    setBGMVolume(volume: number): void {
        this._nBGMVolume = Math.max(0, Math.min(1, volume));
        
        if (this._nBGMId >= 0) {
            cc.audioEngine.setVolume(this._nBGMId, this._nBGMVolume);
        }
    }

    /**
     * 获取音效开关状态
     * 
     * @return 是否启用
     */
    isSoundEnabled(): boolean {
        return this._bEnableSound;
    }

    /**
     * 获取背景音乐开关状态
     * 
     * @return 是否启用
     */
    isBGMEnabled(): boolean {
        return this._bEnableBGM;
    }

    /**
     * 获取音效音量
     * 
     * @return 音量
     */
    getSoundVolume(): number {
        return this._nSoundVolume;
    }

    /**
     * 获取背景音乐音量
     * 
     * @return 音量
     */
    getBGMVolume(): number {
        return this._nBGMVolume;
    }

    /**
     * 停止所有音效
     */
    stopAll(): void {
        cc.audioEngine.stopAll();
        this._nBGMId = -1;
    }

    /**
     * 暂停所有音效
     */
    pauseAll(): void {
        cc.audioEngine.pauseAll();
    }

    /**
     * 恢复所有音效
     */
    resumeAll(): void {
        cc.audioEngine.resumeAll();
    }
}
