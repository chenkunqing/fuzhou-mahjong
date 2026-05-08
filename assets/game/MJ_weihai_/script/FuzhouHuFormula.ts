/**
 * 福州麻将胡牌算法
 * 支持金牌（百搭牌）替代逻辑
 */

import MahjongTileDef from "./MahjongTileDef";
import FuzhouGoldTileDef from "./FuzhouGoldTileDef";
import FuzhouHuaPaiDef from "./FuzhouHuaPaiDef";

/**
 * 福州麻将胡牌公式
 */
export default class FuzhouHuFormula {
    /**
     * 私有化类默认构造器
     */
    private constructor() {
    }

    /**
     * 获取可以胡牌的麻将集合
     * 
     * @param oMahjongInHand 手牌列表
     * @return 可以胡牌的麻将集合
     */
    static getCanHuMahjongArray(oMahjongInHand: Array<number>): Array<number> {
        if (null == oMahjongInHand ||
            oMahjongInHand.length <= 0) {
            return null;
        }

        if (1 != oMahjongInHand.length % 3) {
            // 手里的麻将牌的数量必须是 13、10、7、4、1,
            // 否则无法执行接下来的逻辑...
            return null;
        }

        if (1 == oMahjongInHand.length) {
            // 如果手里就剩下最后一张牌了,
            // 那么最后一张牌就是可以胡的牌 ( 因为只差凑出最后的对子了 )
            return [oMahjongInHand[0]];
        }

        // 可能胡牌的麻将牌集合
        let oMahjongCanHuArray = [];

        // 获取金牌数量
        let nGoldCount = FuzhouGoldTileDef.countGoldInHand(oMahjongInHand);

        for (let nCurrT of oMahjongInHand) {
            if (null == nCurrT) {
                continue;
            }

            // 跳过金牌
            if (FuzhouGoldTileDef.isGoldTile(nCurrT)) {
                continue;
            }

            if (!oMahjongCanHuArray.includes(nCurrT)) {
                // 添加到集合避免重复判断
                oMahjongCanHuArray.push(nCurrT);
            }

            if (MahjongTileDef.isWanTiaoBing(nCurrT)) {
                // 如果当前麻将牌是万、条、饼,
                // 那么就看看当前麻将牌两侧的牌是否可以胡牌,
                // 比方说当前麻将牌是二万,
                // 就看看一万和三万是不是可以胡牌...
                let nT0 = MahjongTileDef.getValidVal(nCurrT - 1);
                let nT1 = MahjongTileDef.getValidVal(nCurrT + 1);

                if (nT0 > 0 && 
                    !oMahjongCanHuArray.includes(nT0)) {
                     oMahjongCanHuArray.push(nT0);
                }

                if (nT1 > 0 && 
                    !oMahjongCanHuArray.includes(nT1)) {
                     oMahjongCanHuArray.push(nT1);
                }
            }
        }

        // 如果有金牌，金牌可以替代任何非花牌
        if (nGoldCount > 0) {
            for (let nTile of MahjongTileDef.VALUE_ARRAY) {
                if (!oMahjongCanHuArray.includes(nTile) &&
                    FuzhouGoldTileDef.canReplace(nTile)) {
                    oMahjongCanHuArray.push(nTile);
                }
            }
        }

        // 移除所有不能胡的牌
        for (let nI = oMahjongCanHuArray.length - 1; nI >= 0; nI--) {
            if (!FuzhouHuFormula.test(
                oMahjongInHand, oMahjongCanHuArray[nI])) {
                oMahjongCanHuArray.splice(nI, 1);
            }
        }

        return oMahjongCanHuArray;
    }

    /**
     * 测试是否可以胡牌
     * 
     * @param oMahjongInHand 手中的麻将牌列表
     * @param nMahjongAtLast 最后一张麻将牌
     * @return true = 可以胡牌, false = 不能胡牌
     */
    static test(oMahjongInHand: Array<number>, nMahjongAtLast: number): boolean {
        if (null == oMahjongInHand ||
            oMahjongInHand.length <= 0 ||
            null == nMahjongAtLast || 
            nMahjongAtLast <= 0) {
            return false;
        }

        if (1 != oMahjongInHand.length % 3) {
            // 手里的麻将牌的数量必须是 13、10、7、4、1,
            // 否则无法执行接下来的逻辑...
            return false;
        }

        if (1 == oMahjongInHand.length) {
            // 如果手里就剩下最后一张牌了,
            // 那就看看能不能凑成对子
            return oMahjongInHand[0] == nMahjongAtLast;
        }

        // 获取金牌数量
        let nGoldCount = FuzhouGoldTileDef.countGoldInHand(oMahjongInHand);

        // 不可能的数量
        let nImpossibleCount = 0;

        for (let nCurrT of oMahjongInHand) {
            if (null != nCurrT &&
                nCurrT == nMahjongAtLast) {
                // 统计一下手里的麻将牌有多少张和最后的麻将牌是一样的
                ++nImpossibleCount;
            }
        }

        if (nImpossibleCount >= 4) {
            // 如果手里已有 4 张牌和最后的麻将牌一样,
            // 那么最后的这张牌不可能胡牌!
            // 例如手里有 4 张一饼,
            // 那么就不可能摸到第 5 张一饼胡牌...
            return false;
        }

        // 测试列表
        let oTTestList: Array<number> = [ ...oMahjongInHand, nMahjongAtLast, ].sort();

        // 看看是不是七小对...
        if (__isQiXiaoDui(oTTestList, nGoldCount)) {
            return true;
        }

        // 创建临时列表
        const oTTempList: Array<number> = [];
        // 已经测试的对子
        const oTestedDuiZi: Array<number> = [];

        for (let nI = 0; nI < oTTestList.length - 1; nI++) {
            // 首先找到对子出现的位置,
            if (oTTestList[nI] != oTTestList[nI + 1]) {
                continue;
            }

            // 要移除的对子
            let nRemovingDuiZi = oTTestList[nI];

            if (oTestedDuiZi.includes(nRemovingDuiZi)) {
                // 如果已经测试过这个对子,
                continue;
            }

            oTestedDuiZi.push(nRemovingDuiZi);

            for (let nJ = 0; nJ < oTTestList.length - 4; nJ++) {
                // 重新初始化临时列表
                oTTempList.splice(0, oTTempList.length);
                oTTempList.push(...oTTestList);

                // 删除对子
                oTTempList.splice(oTTempList.indexOf(nRemovingDuiZi), 2);

                // 剪切掉从指定位置开始所有的顺子
                __cutAllShunZi(oTTempList, nJ, nGoldCount);
                // 剪切掉所有的刻子
                __cutAllKeZi(oTTempList, nGoldCount);

                if (oTTempList.length > 2) {
                    // 如果出现这种情况,
                    // 则说明在当前位置 i 之前还存在顺子,
                    // 尝试剪切掉剩下的顺子...
                    __cutAllShunZi(oTTempList, 0, nGoldCount);
                }

                if (oTTempList.length <= 0) {
                    return true;
                }
            }
        }

        // 如果有金牌，尝试用金牌替代
        if (nGoldCount > 0) {
            return __testWithGoldReplace(oMahjongInHand, nMahjongAtLast, nGoldCount);
        }

        return false;
    }
}

///////////////////////////////////////////////////////////////////////

/**
 * 是否是七小对（支持金牌替代）
 * 
 * @param oTSortedArray 已排序的麻将牌列表
 * @param nGoldCount 金牌数量
 * @return true = 是七小对, false = 不是七小对
 */
function __isQiXiaoDui(oTSortedArray: Array<number>, nGoldCount: number): boolean {
    if (null == oTSortedArray ||
        14 != oTSortedArray.length) {
        return false;
    }

    // 统计需要多少对子
    let nNeedPairs = 7;
    let nUsedGold = 0;

    for (let nIndex = 0; nIndex < oTSortedArray.length; nIndex += 2) {
        const nT0 = oTSortedArray[nIndex];
        const nT1 = oTSortedArray[nIndex + 1];

        if (null == nT0) {
            continue;
        }

        if (nT0 == nT1) {
            // 是对子
            nNeedPairs--;
        } else if (nT0 == FuzhouGoldTileDef.getGoldTile() ||
                   nT1 == FuzhouGoldTileDef.getGoldTile()) {
            // 金牌可以替代
            if (nUsedGold < nGoldCount) {
                nNeedPairs--;
                nUsedGold++;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    return nNeedPairs <= 0;
}

/**
 * 从麻将牌列表中剪掉顺子牌（支持金牌替代）
 * 
 * @param oTSortedList 已排序的麻将牌列表
 * @param nStartIndex  起始索引
 * @param nGoldCount 金牌数量
 */
function __cutAllShunZi(oTSortedList: Array<number>, nStartIndex: number, nGoldCount: number): void {
    if (null == oTSortedList ||
        nStartIndex > oTSortedList.length - 3) {
        return;
    }

    let nUsedGold = 0;

    for (let nI = nStartIndex; nI <= oTSortedList.length - 3; ) {
        // 获取第一张牌
        let nT0 = oTSortedList[nI];

        if (null == nT0) {
            ++nI;
            continue;
        }

        // 跳过金牌
        if (FuzhouGoldTileDef.isGoldTile(nT0)) {
            ++nI;
            continue;
        }

        if (!MahjongTileDef.isWanTiaoBing(nT0)) {
            // 非万、条、饼花色的麻将牌不会有顺子
            ++nI;
            continue;
        }

        let nT1 = MahjongTileDef.getValidVal(nT0 + 1);
        let nT2 = MahjongTileDef.getValidVal(nT0 + 2);

        if (nT1 <= 0 || nT2 <= 0) {
            ++nI;
            continue;
        }

        // 检查是否能组成顺子
        let bCanFormShunZi = false;
        let nNeedGold = 0;

        if (oTSortedList.indexOf(nT0) >= 0 &&
            oTSortedList.indexOf(nT1) >= 0 &&
            oTSortedList.indexOf(nT2) >= 0) {
            // 直接组成顺子
            bCanFormShunZi = true;
        } else if (nUsedGold < nGoldCount) {
            // 尝试用金牌替代
            let nMissing = 0;
            
            if (oTSortedList.indexOf(nT0) < 0) nMissing++;
            if (oTSortedList.indexOf(nT1) < 0) nMissing++;
            if (oTSortedList.indexOf(nT2) < 0) nMissing++;
            
            if (nMissing <= (nGoldCount - nUsedGold)) {
                bCanFormShunZi = true;
                nNeedGold = nMissing;
            }
        }

        if (bCanFormShunZi) {
            // 移除顺子
            for (let nTX of [nT0, nT1, nT2]) {
                let nIndex = oTSortedList.indexOf(nTX);
                if (nIndex >= 0) {
                    oTSortedList.splice(nIndex, 1);
                }
            }
            nUsedGold += nNeedGold;
        } else {
            ++nI;
        }
    }
}

/**
 * 剪切所有的刻子（支持金牌替代）
 * 
 * @param oTSortedList 已排序的麻将牌列表
 * @param nGoldCount 金牌数量
 */
function __cutAllKeZi(oTSortedList: Array<number>, nGoldCount: number): void {
    if (null == oTSortedList) {
        return;
    }

    let nUsedGold = 0;

    for (let nI = 0; nI <= oTSortedList.length - 3; ) {
        // 获取连续的三张牌
        let nT0 = oTSortedList[nI];
        let nT1 = oTSortedList[nI + 1];
        let nT2 = oTSortedList[nI + 2];

        if (null == nT0) {
            ++nI;
            continue;
        }

        // 跳过金牌
        if (FuzhouGoldTileDef.isGoldTile(nT0)) {
            ++nI;
            continue;
        }

        if (nT0 == nT1 && nT0 == nT2) {
            // 三张牌相同 ( 刻子 ),
            oTSortedList.splice(nI, 3);
        } else if (nUsedGold < nGoldCount) {
            // 尝试用金牌替代
            let nMissing = 0;
            
            if (nT0 != nT1) nMissing++;
            if (nT0 != nT2) nMissing++;
            
            if (nMissing <= (nGoldCount - nUsedGold)) {
                oTSortedList.splice(nI, 3);
                nUsedGold += nMissing;
            } else {
                ++nI;
            }
        } else {
            ++nI;
        }
    }
}

/**
 * 测试用金牌替代是否可以胡牌
 * 
 * @param oMahjongInHand 手牌列表
 * @param nMahjongAtLast 最后一张牌
 * @param nGoldCount 金牌数量
 * @return true = 可以胡牌, false = 不能胡牌
 */
function __testWithGoldReplace(oMahjongInHand: Array<number>, nMahjongAtLast: number, nGoldCount: number): boolean {
    // 尝试用金牌替代每一种牌
    for (let nTile of MahjongTileDef.VALUE_ARRAY) {
        if (FuzhouGoldTileDef.canReplace(nTile)) {
            // 创建新的手牌列表，用金牌替代指定牌
            let oNewHand = [...oMahjongInHand];
            let nReplaced = 0;
            
            for (let i = 0; i < oNewHand.length && nReplaced < nGoldCount; i++) {
                if (FuzhouGoldTileDef.isGoldTile(oNewHand[i])) {
                    oNewHand[i] = nTile;
                    nReplaced++;
                }
            }
            
            // 测试是否可以胡牌
            if (__testWithoutGold(oNewHand, nMahjongAtLast)) {
                return true;
            }
        }
    }
    
    return false;
}

/**
 * 测试是否可以胡牌（不考虑金牌替代）
 * 
 * @param oMahjongInHand 手牌列表
 * @param nMahjongAtLast 最后一张牌
 * @return true = 可以胡牌, false = 不能胡牌
 */
function __testWithoutGold(oMahjongInHand: Array<number>, nMahjongAtLast: number): boolean {
    // 测试列表
    let oTTestList: Array<number> = [ ...oMahjongInHand, nMahjongAtLast, ].sort();

    // 看看是不是七小对...
    if (__isQiXiaoDui(oTTestList, 0)) {
        return true;
    }

    // 创建临时列表
    const oTTempList: Array<number> = [];
    // 已经测试的对子
    const oTestedDuiZi: Array<number> = [];

    for (let nI = 0; nI < oTTestList.length - 1; nI++) {
        // 首先找到对子出现的位置,
        if (oTTestList[nI] != oTTestList[nI + 1]) {
            continue;
        }

        // 要移除的对子
        let nRemovingDuiZi = oTTestList[nI];

        if (oTestedDuiZi.includes(nRemovingDuiZi)) {
            // 如果已经测试过这个对子,
            continue;
        }

        oTestedDuiZi.push(nRemovingDuiZi);

        for (let nJ = 0; nJ < oTTestList.length - 4; nJ++) {
            // 重新初始化临时列表
            oTTempList.splice(0, oTTempList.length);
            oTTempList.push(...oTTestList);

            // 删除对子
            oTTempList.splice(oTTempList.indexOf(nRemovingDuiZi), 2);

            // 剪切掉从指定位置开始所有的顺子
            __cutAllShunZi(oTTempList, nJ, 0);
            // 剪切掉所有的刻子
            __cutAllKeZi(oTTempList, 0);

            if (oTTempList.length > 2) {
                // 如果出现这种情况,
                // 则说明在当前位置 i 之前还存在顺子,
                // 尝试剪切掉剩下的顺子...
                __cutAllShunZi(oTTempList, 0, 0);
            }

            if (oTTempList.length <= 0) {
                return true;
            }
        }
    }

    return false;
}
