/**
 * 福州麻将工具类
 * 提供通用工具方法
 */

/**
 * 福州麻将工具类
 */
export default class FuzhouUtils {
    /**
     * 私有化类默认构造器
     */
    private constructor() {
        throw new Error("该类不能实例化");
    }

    /**
     * 格式化数字
     * 
     * @param num 数字
     * @param decimals 小数位数
     * @return 格式化后的字符串
     */
    static formatNumber(num: number, decimals: number = 0): string {
        return num.toFixed(decimals);
    }

    /**
     * 格式化时间
     * 
     * @param timestamp 时间戳
     * @return 格式化后的时间字符串
     */
    static formatTime(timestamp: number): string {
        let date = new Date(timestamp);
        let year = date.getFullYear();
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let day = String(date.getDate()).padStart(2, '0');
        let hours = String(date.getHours()).padStart(2, '0');
        let minutes = String(date.getMinutes()).padStart(2, '0');
        let seconds = String(date.getSeconds()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    /**
     * 格式化时长
     * 
     * @param seconds 秒数
     * @return 格式化后的时长字符串
     */
    static formatDuration(seconds: number): string {
        let hours = Math.floor(seconds / 3600);
        let minutes = Math.floor((seconds % 3600) / 60);
        let secs = Math.floor(seconds % 60);
        
        if (hours > 0) {
            return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        } else {
            return `${minutes}:${String(secs).padStart(2, '0')}`;
        }
    }

    /**
     * 生成唯一ID
     * 
     * @return 唯一ID
     */
    static generateUniqueId(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = Math.random() * 16 | 0;
            let v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    /**
     * 深拷贝对象
     * 
     * @param obj 对象
     * @return 拷贝后的对象
     */
    static deepClone<T>(obj: T): T {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Date) {
            return new Date(obj.getTime()) as any;
        }
        
        if (obj instanceof Array) {
            return obj.map(item => FuzhouUtils.deepClone(item)) as any;
        }
        
        if (obj instanceof Object) {
            let copy: any = {};
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    copy[key] = FuzhouUtils.deepClone(obj[key]);
                }
            }
            return copy;
        }
        
        return obj;
    }

    /**
     * 防抖函数
     * 
     * @param func 函数
     * @param wait 等待时间
     * @return 防抖后的函数
     */
    static debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
        let timeout: any = null;
        
        return ((...args: any[]) => {
            if (timeout) {
                clearTimeout(timeout);
            }
            
            timeout = setTimeout(() => {
                func(...args);
            }, wait);
        }) as any;
    }

    /**
     * 节流函数
     * 
     * @param func 函数
     * @param limit 限制时间
     * @return 节流后的函数
     */
    static throttle<T extends (...args: any[]) => any>(func: T, limit: number): T {
        let inThrottle: boolean = false;
        
        return ((...args: any[]) => {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                
                setTimeout(() => {
                    inThrottle = false;
                }, limit);
            }
        }) as any;
    }

    /**
     * 随机整数
     * 
     * @param min 最小值
     * @param max 最大值
     * @return 随机整数
     */
    static randomInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * 随机浮点数
     * 
     * @param min 最小值
     * @param max 最大值
     * @return 随机浮点数
     */
    static randomFloat(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    /**
     * 数组洗牌
     * 
     * @param array 数组
     * @return 洗牌后的数组
     */
    static shuffleArray<T>(array: T[]): T[] {
        let result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    }

    /**
     * 数组去重
     * 
     * @param array 数组
     * @return 去重后的数组
     */
    static uniqueArray<T>(array: T[]): T[] {
        return [...new Set(array)];
    }

    /**
     * 数组分组
     * 
     * @param array 数组
     * @param size 每组大小
     * @return 分组后的数组
     */
    static chunkArray<T>(array: T[], size: number): T[][] {
        let result: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    }

    /**
     * 检查是否是移动设备
     * 
     * @return 是否是移动设备
     */
    static isMobile(): boolean {
        return cc.sys.isMobile;
    }

    /**
     * 检查是否是微信环境
     * 
     * @return 是否是微信环境
     */
    static isWechat(): boolean {
        return typeof wx !== 'undefined';
    }

    /**
     * 检查是否是本地环境
     * 
     * @return 是否是本地环境
     */
    static isLocal(): boolean {
        return cc.sys.platform === cc.sys.WECHAT_GAME || 
               cc.sys.platform === cc.sys.WECHAT_MINI_PROGRAM;
    }

    /**
     * 获取屏幕尺寸
     * 
     * @return 屏幕尺寸
     */
    static getScreenSize(): cc.Size {
        return cc.winSize;
    }

    /**
     * 获取屏幕宽度
     * 
     * @return 屏幕宽度
     */
    static getScreenWidth(): number {
        return cc.winSize.width;
    }

    /**
     * 获取屏幕高度
     * 
     * @return 屏幕高度
     */
    static getScreenHeight(): number {
        return cc.winSize.height;
    }

    /**
     * 是否是横屏
     * 
     * @return 是否是横屏
     */
    static isLandscape(): boolean {
        return cc.winSize.width > cc.winSize.height;
    }

    /**
     * 延迟执行
     * 
     * @param seconds 秒数
     * @return Promise
     */
    static delay(seconds: number): Promise<void> {
        return new Promise(resolve => {
            setTimeout(resolve, seconds * 1000);
        });
    }

    /**
     * 格式化文件大小
     * 
     * @param bytes 字节数
     * @return 格式化后的文件大小
     */
    static formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        
        let k = 1024;
        let sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        let i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    /**
     * 检查是否是有效的URL
     * 
     * @param url URL
     * @return 是否是有效的URL
     */
    static isValidUrl(url: string): boolean {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * 截取字符串
     * 
     * @param str 字符串
     * @param length 长度
     * @param suffix 后缀
     * @return 截取后的字符串
     */
    static truncateString(str: string, length: number, suffix: string = '...'): string {
        if (str.length <= length) {
            return str;
        }
        return str.substring(0, length) + suffix;
    }
}
