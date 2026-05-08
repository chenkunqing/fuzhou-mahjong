/**
 * 福州麻将数据管理器
 * 处理游戏数据存储和读取
 */

/**
 * 存储键定义
 */
export enum StorageKey {
    // 用户数据
    USER_ID = 'user_id',
    USER_NAME = 'user_name',
    USER_AVATAR = 'user_avatar',
    USER_SCORE = 'user_score',
    
    // 游戏设置
    SOUND_ENABLE = 'sound_enable',
    BGM_ENABLE = 'bgm_enable',
    SOUND_VOLUME = 'sound_volume',
    BGM_VOLUME = 'bgm_volume',
    
    // 游戏记录
    GAME_HISTORY = 'game_history',
    WIN_COUNT = 'win_count',
    LOSE_COUNT = 'lose_count',
    TOTAL_SCORE = 'total_score',
    
    // 房间设置
    LAST_ROOM_ID = 'last_room_id',
    LAST_RULES = 'last_rules',
}

/**
 * 用户数据
 */
export interface UserData {
    /** 用户ID */
    userId: string;
    /** 用户名 */
    userName: string;
    /** 头像URL */
    avatar: string;
    /** 分数 */
    score: number;
    /** 胜场 */
    winCount: number;
    /** 负场 */
    loseCount: number;
    /** 总分 */
    totalScore: number;
}

/**
 * 游戏设置
 */
export interface GameSettings {
    /** 是否启用音效 */
    soundEnable: boolean;
    /** 是否启用背景音乐 */
    bgmEnable: boolean;
    /** 音效音量 */
    soundVolume: number;
    /** 背景音乐音量 */
    bgmVolume: number;
}

/**
 * 游戏记录
 */
export interface GameRecord {
    /** 游戏ID */
    gameId: string;
    /** 游戏时间 */
    gameTime: number;
    /** 游戏结果 */
    result: number;
    /** 得分 */
    score: number;
    /** 牌型 */
    pattern: string;
    /** 玩家列表 */
    players: Array<string>;
}

/**
 * 福州麻将数据管理器
 */
export default class FuzhouDataManager {
    /** 单例实例 */
    private static _oInstance: FuzhouDataManager = null;
    
    /** 用户数据 */
    private _oUserData: UserData = null;
    
    /** 游戏设置 */
    private _oGameSettings: GameSettings = null;
    
    /** 游戏记录 */
    private _oGameHistory: Array<GameRecord> = [];

    /**
     * 私有化类默认构造器
     */
    private constructor() {
        this.loadData();
    }

    /**
     * 获取单例实例
     * 
     * @return 单例实例
     */
    static getInstance(): FuzhouDataManager {
        if (!FuzhouDataManager._oInstance) {
            FuzhouDataManager._oInstance = new FuzhouDataManager();
        }
        return FuzhouDataManager._oInstance;
    }

    /**
     * 加载数据
     */
    private loadData(): void {
        // 加载用户数据
        this._oUserData = {
            userId: this.get(StorageKey.USER_ID, ''),
            userName: this.get(StorageKey.USER_NAME, '玩家'),
            avatar: this.get(StorageKey.USER_AVATAR, ''),
            score: this.get(StorageKey.USER_SCORE, 0),
            winCount: this.get(StorageKey.WIN_COUNT, 0),
            loseCount: this.get(StorageKey.LOSE_COUNT, 0),
            totalScore: this.get(StorageKey.TOTAL_SCORE, 0),
        };
        
        // 加载游戏设置
        this._oGameSettings = {
            soundEnable: this.get(StorageKey.SOUND_ENABLE, true),
            bgmEnable: this.get(StorageKey.BGM_ENABLE, true),
            soundVolume: this.get(StorageKey.SOUND_VOLUME, 1.0),
            bgmVolume: this.get(StorageKey.BGM_VOLUME, 0.5),
        };
        
        // 加载游戏记录
        let historyStr = this.get(StorageKey.GAME_HISTORY, '[]');
        try {
            this._oGameHistory = JSON.parse(historyStr);
        } catch (e) {
            this._oGameHistory = [];
        }
    }

    /**
     * 获取数据
     * 
     * @param key 键
     * @param defaultValue 默认值
     * @return 值
     */
    get(key: string, defaultValue: any = null): any {
        try {
            let value = cc.sys.localStorage.getItem(key);
            if (value === null || value === undefined) {
                return defaultValue;
            }
            return JSON.parse(value);
        } catch (e) {
            return defaultValue;
        }
    }

    /**
     * 设置数据
     * 
     * @param key 键
     * @param value 值
     */
    set(key: string, value: any): void {
        try {
            cc.sys.localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('保存数据失败:', e);
        }
    }

    /**
     * 删除数据
     * 
     * @param key 键
     */
    remove(key: string): void {
        cc.sys.localStorage.removeItem(key);
    }

    /**
     * 清空所有数据
     */
    clear(): void {
        cc.sys.localStorage.clear();
    }

    /**
     * 获取用户数据
     * 
     * @return 用户数据
     */
    getUserData(): UserData {
        return this._oUserData;
    }

    /**
     * 设置用户数据
     * 
     * @param data 用户数据
     */
    setUserData(data: Partial<UserData>): void {
        this._oUserData = { ...this._oUserData, ...data };
        
        // 保存到本地
        this.set(StorageKey.USER_ID, this._oUserData.userId);
        this.set(StorageKey.USER_NAME, this._oUserData.userName);
        this.set(StorageKey.USER_AVATAR, this._oUserData.avatar);
        this.set(StorageKey.USER_SCORE, this._oUserData.score);
        this.set(StorageKey.WIN_COUNT, this._oUserData.winCount);
        this.set(StorageKey.LOSE_COUNT, this._oUserData.loseCount);
        this.set(StorageKey.TOTAL_SCORE, this._oUserData.totalScore);
    }

    /**
     * 获取游戏设置
     * 
     * @return 游戏设置
     */
    getGameSettings(): GameSettings {
        return this._oGameSettings;
    }

    /**
     * 设置游戏设置
     * 
     * @param settings 游戏设置
     */
    setGameSettings(settings: Partial<GameSettings>): void {
        this._oGameSettings = { ...this._oGameSettings, ...settings };
        
        // 保存到本地
        this.set(StorageKey.SOUND_ENABLE, this._oGameSettings.soundEnable);
        this.set(StorageKey.BGM_ENABLE, this._oGameSettings.bgmEnable);
        this.set(StorageKey.SOUND_VOLUME, this._oGameSettings.soundVolume);
        this.set(StorageKey.BGM_VOLUME, this._oGameSettings.bgmVolume);
    }

    /**
     * 获取游戏记录
     * 
     * @return 游戏记录
     */
    getGameHistory(): Array<GameRecord> {
        return this._oGameHistory;
    }

    /**
     * 添加游戏记录
     * 
     * @param record 游戏记录
     */
    addGameRecord(record: GameRecord): void {
        this._oGameHistory.unshift(record);
        
        // 限制记录数量
        if (this._oGameHistory.length > 100) {
            this._oGameHistory = this._oGameHistory.slice(0, 100);
        }
        
        // 保存到本地
        this.set(StorageKey.GAME_HISTORY, JSON.stringify(this._oGameHistory));
    }

    /**
     * 更新游戏统计
     * 
     * @param isWin 是否胜利
     * @param score 得分
     */
    updateGameStats(isWin: boolean, score: number): void {
        if (isWin) {
            this._oUserData.winCount++;
        } else {
            this._oUserData.loseCount++;
        }
        
        this._oUserData.totalScore += score;
        this._oUserData.score += score;
        
        this.setUserData(this._oUserData);
    }

    /**
     * 获取胜率
     * 
     * @return 胜率（0-1）
     */
    getWinRate(): number {
        let total = this._oUserData.winCount + this._oUserData.loseCount;
        if (total === 0) {
            return 0;
        }
        return this._oUserData.winCount / total;
    }

    /**
     * 获取最近房间ID
     * 
     * @return 房间ID
     */
    getLastRoomId(): string {
        return this.get(StorageKey.LAST_ROOM_ID, '');
    }

    /**
     * 设置最近房间ID
     * 
     * @param roomId 房间ID
     */
    setLastRoomId(roomId: string): void {
        this.set(StorageKey.LAST_ROOM_ID, roomId);
    }

    /**
     * 获取最近规则
     * 
     * @return 规则
     */
    getLastRules(): any {
        let rulesStr = this.get(StorageKey.LAST_RULES, '{}');
        try {
            return JSON.parse(rulesStr);
        } catch (e) {
            return {};
        }
    }

    /**
     * 设置最近规则
     * 
     * @param rules 规则
     */
    setLastRules(rules: any): void {
        this.set(StorageKey.LAST_RULES, JSON.stringify(rules));
    }
}
