/**
 * 性能优化管理器
 * 处理微信小游戏性能优化
 */

/**
 * 性能配置
 */
export interface PerformanceConfig {
    /** 目标帧率 */
    targetFPS: number;
    /** 是否启用动态合图 */
    enableDynamicAtlas: boolean;
    /** 是否启用资源缓存 */
    enableResourceCache: boolean;
    /** 最大缓存资源数 */
    maxCacheResources: number;
    /** 是否启用垃圾回收 */
    enableGC: boolean;
    /** GC间隔（秒） */
    gcInterval: number;
}

/**
 * 性能优化管理器
 */
export default class PerformanceManager {
    /** 单例实例 */
    private static _oInstance: PerformanceManager = null;
    
    /** 性能配置 */
    private _oConfig: PerformanceConfig;
    
    /** 上次GC时间 */
    private _nLastGCTime: number = 0;
    
    /** 资源缓存 */
    private _oResourceCache: Map<string, any> = new Map();
    
    /** 帧率统计 */
    private _nFrameCount: number = 0;
    private _nLastFPSTime: number = 0;
    private _nCurrentFPS: number = 0;

    /**
     * 私有化类默认构造器
     */
    private constructor() {
        this._oConfig = {
            targetFPS: 60,
            enableDynamicAtlas: true,
            enableResourceCache: true,
            maxCacheResources: 100,
            enableGC: true,
            gcInterval: 30,
        };
    }

    /**
     * 获取单例实例
     * 
     * @return 单例实例
     */
    static getInstance(): PerformanceManager {
        if (!PerformanceManager._oInstance) {
            PerformanceManager._oInstance = new PerformanceManager();
        }
        return PerformanceManager._oInstance;
    }

    /**
     * 初始化性能优化
     */
    init(): void {
        // 设置目标帧率
        this.setTargetFPS(this._oConfig.targetFPS);
        
        // 启用动态合图
        if (this._oConfig.enableDynamicAtlas) {
            this.enableDynamicAtlas();
        }
        
        // 启用资源缓存
        if (this._oConfig.enableResourceCache) {
            this.enableResourceCache();
        }
        
        // 启用垃圾回收
        if (this._oConfig.enableGC) {
            this.enableGC();
        }
        
        console.log('性能优化初始化完成');
    }

    /**
     * 设置目标帧率
     * 
     * @param fps 帧率
     */
    private setTargetFPS(fps: number): void {
        cc.game.setFrameRate(fps);
        console.log('设置目标帧率：', fps);
    }

    /**
     * 启用动态合图
     */
    private enableDynamicAtlas(): void {
        // 启用动态合图
        cc.dynamicAtlasManager.enabled = true;
        console.log('启用动态合图');
    }

    /**
     * 启用资源缓存
     */
    private enableResourceCache(): void {
        // 设置资源缓存
        cc.assetManager.cacheManager = {
            getCache: (uuid: string) => {
                return this._oResourceCache.get(uuid);
            },
            setCache: (uuid: string, asset: any) => {
                if (this._oResourceCache.size >= this._oConfig.maxCacheResources) {
                    // 移除最旧的缓存
                    const firstKey = this._oResourceCache.keys().next().value;
                    this._oResourceCache.delete(firstKey);
                }
                this._oResourceCache.set(uuid, asset);
            },
            removeCache: (uuid: string) => {
                this._oResourceCache.delete(uuid);
            },
            clearCache: () => {
                this._oResourceCache.clear();
            }
        };
        console.log('启用资源缓存');
    }

    /**
     * 启用垃圾回收
     */
    private enableGC(): void {
        // 注册更新回调
        cc.director.on(cc.Director.EVENT_AFTER_UPDATE, () => {
            this.update();
        });
        console.log('启用垃圾回收');
    }

    /**
     * 更新
     */
    private update(): void {
        let nNow = Date.now();
        
        // 更新帧率统计
        this._nFrameCount++;
        if (nNow - this._nLastFPSTime >= 1000) {
            this._nCurrentFPS = this._nFrameCount;
            this._nFrameCount = 0;
            this._nLastFPSTime = nNow;
        }
        
        // 检查是否需要GC
        if (this._oConfig.enableGC && 
            nNow - this._nLastGCTime >= this._oConfig.gcInterval * 1000) {
            this.doGC();
            this._nLastGCTime = nNow;
        }
    }

    /**
     * 执行垃圾回收
     */
    private doGC(): void {
        // 清理未使用的资源
        cc.assetManager.releaseUnusedAssets();
        
        // 清理缓存
        if (this._oResourceCache.size > this._oConfig.maxCacheResources * 0.8) {
            // 清理80%的缓存
            const nClearCount = Math.floor(this._oResourceCache.size * 0.8);
            let nCleared = 0;
            for (const key of this._oResourceCache.keys()) {
                if (nCleared >= nClearCount) break;
                this._oResourceCache.delete(key);
                nCleared++;
            }
        }
        
        console.log('执行垃圾回收');
    }

    /**
     * 获取当前帧率
     * 
     * @return 当前帧率
     */
    getCurrentFPS(): number {
        return this._nCurrentFPS;
    }

    /**
     * 获取缓存资源数
     * 
     * @return 缓存资源数
     */
    getCacheResourceCount(): number {
        return this._oResourceCache.size;
    }

    /**
     * 清理资源缓存
     */
    clearResourceCache(): void {
        this._oResourceCache.clear();
        console.log('清理资源缓存');
    }

    /**
     * 设置性能配置
     * 
     * @param config 性能配置
     */
    setConfig(config: Partial<PerformanceConfig>): void {
        this._oConfig = { ...this._oConfig, ...config };
        console.log('更新性能配置：', this._oConfig);
    }

    /**
     * 获取性能配置
     * 
     * @return 性能配置
     */
    getConfig(): PerformanceConfig {
        return this._oConfig;
    }

    /**
     * 获取性能统计
     * 
     * @return 性能统计
     */
    getStats(): any {
        return {
            fps: this._nCurrentFPS,
            cacheCount: this._oResourceCache.size,
            memoryUsage: this.getMemoryUsage(),
        };
    }

    /**
     * 获取内存使用情况
     * 
     * @return 内存使用情况
     */
    private getMemoryUsage(): any {
        if (typeof performance !== 'undefined' && performance.memory) {
            return {
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
            };
        }
        return null;
    }

    /**
     * 优化渲染
     */
    optimizeRendering(): void {
        // 启用批处理
        cc.renderer.enableBatch = true;
        
        // 设置渲染顺序
        cc.renderer.renderOrder = 0;
        
        console.log('优化渲染');
    }

    /**
     * 优化内存
     */
    optimizeMemory(): void {
        // 清理纹理缓存
        cc.textureCache.removeAllTextures();
        
        // 清理精灵帧缓存
        cc.spriteFrameCache.clear();
        
        console.log('优化内存');
    }
}
