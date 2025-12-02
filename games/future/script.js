// 成语消除游戏 - 核心逻辑

// 成语库 - 精选四字成语
const IDIOMS = [
    "一举两得", "一分为二", "三长两短", "四面八方", "五光十色",
    "六神无主", "七上八下", "八面玲珑", "九牛一毛", "十全十美",
    "百发百中", "千方百计", "万无一失", "天长地久", "日新月异",
    "山清水秀", "花红柳绿", "风平浪静", "天经地义", "明察秋毫",
    "融会贯通", "栩栩如生", "兴高采烈", "忐忑不安", "心安理得",
    "大公无私", "微不足道", "浓妆淡抹", "盘根错节", "绘声绘色",
    "游刃有余", "崇山峻岭", "一心一意", "三三两两", "半信半疑",
    "自由自在", "自言自语", "无影无踪", "走马观花", "活蹦乱跳",
    "吞吞吐吐", "隐隐约约", "郁郁葱葱", "浩浩荡荡", "勤勤恳恳",
    "战战兢兢", "轰轰烈烈", "家家户户", "断断续续", "偷偷摸摸",
    "慢条斯理", "面面相觑", "头头是道", "小心翼翼", "虎视眈眈",
    "逃之夭夭", "人才济济", "大腹便便", "威风凛凛", "忠心耿耿",
    "风尘仆仆", "信誓旦旦", "千里迢迢", "文质彬彬", "衣冠楚楚",
    "大名鼎鼎", "气喘吁吁", "想入非非", "白雪皑皑", "怒气冲冲",
    "可怜巴巴", "生机勃勃", "得意洋洋", "波光粼粼", "神采奕奕",
    "忧心忡忡", "气势汹汹", "野心勃勃", "三令五申", "四通八达",
    "五颜六色", "七嘴八舌", "八仙过海", "九死一生", "十面埋伏",
    "百依百顺", "千军万马", "万马奔腾", "天长日久", "日新月异",
    "山崩地裂", "花言巧语", "风吹雨打", "天翻地覆", "明明白白",
    "融会贯通", "栩栩如生", "兴风作浪", "忐忑不安", "心安理得",
    "大公无私", "微不足道", "浓妆淡抹", "盘根错节", "绘声绘色",
    "游刃有余", "崇山峻岭", "一心一意", "三三两两", "半信半疑",
    "自由自在", "自言自语", "无影无踪", "走马观花", "活蹦乱跳",
    "吞吞吐吐", "隐隐约约", "郁郁葱葱", "浩浩荡荡", "勤勤恳恳",
    "战战兢兢", "轰轰烈烈", "家家户户", "断断续续", "偷偷摸摸",
    "慢条斯理", "面面相觑", "头头是道", "小心翼翼", "虎视眈眈",
    "逃之夭夭", "人才济济", "大腹便便", "威风凛凛", "忠心耿耿",
    "风尘仆仆", "信誓旦旦", "千里迢迢", "文质彬彬", "衣冠楚楚",
    "大名鼎鼎", "气喘吁吁", "想入非非", "白雪皑皑", "怒气冲冲",
    "可怜巴巴", "生机勃勃", "得意洋洋", "波光粼粼", "神采奕奕",
    "忧心忡忡", "气势汹汹", "野心勃勃"
];

// 游戏状态
const gameState = {
    idioms: [],          // 当前游戏使用的成语
    wordBlocks: [],      // 两字一组的字块数组
    selectedBlocks: [],  // 当前选中的字块
    matchedCount: 0,     // 已匹配的成语数量
    totalIdioms: 5,      // 每局游戏的成语数量
    score: 0,            // 游戏得分
    timeLeft: 180,       // 剩余时间（秒）
    timerInterval: null  // 计时器
};

// DOM元素引用
const elements = {
    gameBoard: document.getElementById('game-board'),
    selectedWords: document.getElementById('selected-words'),
    progressBar: document.getElementById('progress-bar'),
    scoreDisplay: document.getElementById('score'),
    timeDisplay: document.getElementById('time-left'),
    restartButton: document.getElementById('restart-button'),
    stars: [
        document.getElementById('star1'),
        document.getElementById('star2'),
        document.getElementById('star3'),
        document.getElementById('star4'),
        document.getElementById('star5')
    ],
    matchToast: document.getElementById('match-toast'),
    mismatchToast: document.getElementById('mismatch-toast')
};

// 调试日志函数
function debugLog(message, data = null) {
    if (typeof DEBUG !== 'undefined' && DEBUG) {
        console.log(`[成语消除] ${message}`, data);
    }
}

// 生成随机成语
function generateRandomIdioms(count) {
    // 使用Set确保不重复
    const selectedIdioms = new Set();
    
    while (selectedIdioms.size < count && selectedIdioms.size < IDIOMS.length) {
        const randomIndex = Math.floor(Math.random() * IDIOMS.length);
        selectedIdioms.add(IDIOMS[randomIndex]);
    }
    
    return Array.from(selectedIdioms);
}

// 创建两字一组的字块
function createWordBlock(twoCharacters, index, originalIdiom) {
    const block = document.createElement('div');
    block.classList.add('word-block'); // 使用word-block类名与CSS匹配
    block.dataset.index = index;
    block.dataset.originalIdiom = originalIdiom; // 存储原始成语用于匹配检查
    block.textContent = twoCharacters;
    
    // 添加点击事件
    block.addEventListener('click', () => handleBlockClick(block));
    
    return block;
}

// 渲染游戏板
function renderGameBoard() {
    // 清空游戏板
    elements.gameBoard.innerHTML = '';
    
    // 将所有字块打乱顺序
    const shuffledBlocks = [...gameState.wordBlocks].sort(() => Math.random() - 0.5);
    
    // 渲染字块（5列网格布局）
    shuffledBlocks.forEach((block) => {
        elements.gameBoard.appendChild(block);
    });
    
    debugLog('游戏板渲染完成', { totalBlocks: shuffledBlocks.length });
}

// 处理字块点击
function handleBlockClick(block) {
    // 如果字块已被选中，则取消选择
    if (block.classList.contains('selected')) {
        deselectBlock(block);
        return;
    }
    
    // 如果已经选中了2个字块，则不允许再选择
    if (gameState.selectedBlocks.length >= 2) {
        showMessage('最多只能选择2组字块', 'info');
        return;
    }
    
    // 选中字块
    selectBlock(block);
    
    // 如果选中了2个字块，检查是否匹配成语
    if (gameState.selectedBlocks.length === 2) {
        setTimeout(() => {
            checkMatch();
        }, 300);
    }
}

// 选中字块
function selectBlock(block) {
    block.classList.add('selected');
    gameState.selectedBlocks.push(block);
    
    // 更新选中显示
    updateSelectedDisplay();
    
    debugLog('选中字块', { text: block.textContent, index: block.dataset.index });
}

// 取消选中字块
function deselectBlock(block) {
    block.classList.remove('selected');
    const index = gameState.selectedBlocks.indexOf(block);
    if (index > -1) {
        gameState.selectedBlocks.splice(index, 1);
    }
    
    // 更新选中显示
    updateSelectedDisplay();
    
    debugLog('取消选中字块', { text: block.textContent, index: block.dataset.index });
}

// 更新选中显示
function updateSelectedDisplay() {
    if (elements.selectedWords) {
        elements.selectedWords.textContent = gameState.selectedBlocks.map(block => block.textContent).join(' + ');
    }
}

// 检查匹配 - 两字组合成四字成语
function checkMatch() {
    // 组合选中的两组两字
    const combinedIdiom = gameState.selectedBlocks.map(block => block.textContent).join('');
    
    debugLog('检查匹配', { combinedIdiom });
    
    // 检查是否匹配任何成语
    const matchedIndex = gameState.idioms.indexOf(combinedIdiom);
    
    if (matchedIndex !== -1) {
        // 匹配成功
        handleMatchSuccess(matchedIndex);
    } else {
        // 检查是否有其他可能的组合方式（顺序调换）
        const reversedCombined = gameState.selectedBlocks[1].textContent + gameState.selectedBlocks[0].textContent;
        const reversedIndex = gameState.idioms.indexOf(reversedCombined);
        
        if (reversedIndex !== -1) {
            // 调换顺序后匹配成功
            handleMatchSuccess(reversedIndex);
        } else {
            // 匹配失败
            handleMatchFailure();
        }
    }
}

// 处理匹配成功
function handleMatchSuccess(idiomIndex) {
    const matchedIdiom = gameState.idioms[idiomIndex];
    
    // 标记成语为已匹配
    gameState.idioms[idiomIndex] = null; // 使用null标记已匹配
    gameState.matchedCount++;
    
    // 加分
    gameState.score += 100 + Math.floor(gameState.timeLeft / 10) * 10; // 时间奖励
    
    // 将选中的字块变为空白块，保持位置不变
    gameState.selectedBlocks.forEach(block => {
        block.classList.add('matched', 'blank-block'); // 添加matched和blank-block类
        block.textContent = ''; // 清空内容变为空白
        block.disabled = true; // 禁用点击
        
        // 移除点击事件监听器，确保不能再被选中
        const newBlock = block.cloneNode(true);
        block.parentNode.replaceChild(newBlock, block);
    });
    
    // 清空选中
    gameState.selectedBlocks = [];
    updateSelectedDisplay();
    
    // 更新进度
    updateProgress();
    updateStars();
    updateScore();
    
    // 显示成功消息
    showMessage(`恭喜！匹配成功：${matchedIdiom}`, 'success');
    
    // 检查游戏是否完成
    checkGameCompletion();
    
    debugLog('匹配成功', { idiom: matchedIdiom, score: gameState.score });
}

// 处理匹配失败
function handleMatchFailure() {
    // 显示错误动画
    gameState.selectedBlocks.forEach(block => {
        block.classList.add('error');
        setTimeout(() => {
            block.classList.remove('error', 'selected');
        }, 500);
    });
    
    // 扣分
    gameState.score = Math.max(0, gameState.score - 10);
    
    // 清空选中
    gameState.selectedBlocks = [];
    updateSelectedDisplay();
    updateScore();
    
    // 显示失败消息
    showMessage('这两个词块不能组成成语，请再试一次', 'error');
    
    debugLog('匹配失败', { score: gameState.score });
}

// 更新进度
function updateProgress() {
    const progress = (gameState.matchedCount / gameState.totalIdioms) * 100;
    
    // 更新进度条
    if (elements.progressBar) {
        elements.progressBar.style.width = `${progress}%`;
    }
    
    // 更新进度文本 - 修复ID引用错误
    const progressElement = document.getElementById('progress-count');
    if (progressElement) {
        progressElement.textContent = gameState.matchedCount;
    }
    
    debugLog('更新进度', { matched: gameState.matchedCount, total: gameState.totalIdioms, progress: `${progress}%` });
}

// 更新星星评级
function updateStars() {
    const starsCount = Math.min(5, Math.max(1, Math.floor((gameState.matchedCount / gameState.totalIdioms) * 5)));
    
    elements.stars.forEach((star, index) => {
        if (star) {
            star.classList.toggle('active', index < starsCount);
        }
    });
    
    debugLog('更新星星评级', { stars: starsCount });
}

// 更新分数
function updateScore() {
    if (elements.scoreDisplay) {
        elements.scoreDisplay.textContent = gameState.score;
    }
}

// 更新时间显示
function updateTimeDisplay() {
    if (elements.timeDisplay) {
        elements.timeDisplay.textContent = gameState.timeLeft;
    }
}

// 显示消息
function showMessage(text, type = 'info') {
    // 使用toast元素代替不存在的messageBox
    if (type === 'success' && elements.matchToast) {
        elements.matchToast.querySelector('span:last-child').textContent = text;
        elements.matchToast.classList.add('show');
        
        setTimeout(() => {
            elements.matchToast.classList.remove('show');
        }, 2000);
    } else if (type === 'error' && elements.mismatchToast) {
        elements.mismatchToast.querySelector('span:last-child').textContent = text;
        elements.mismatchToast.classList.add('show');
        
        setTimeout(() => {
            elements.mismatchToast.classList.remove('show');
        }, 2000);
    }
    
    // 同时在控制台输出消息以便调试
    console.log('游戏消息:', text, { type });
}

// 检查游戏完成
function checkGameCompletion() {
    if (gameState.matchedCount >= gameState.totalIdioms) {
        // 游戏完成
        endGame(true);
    }
}

// 结束游戏
function endGame(isSuccess) {
    // 停止计时器
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    
    // 显示结果
    const finalStars = Math.min(5, Math.max(1, Math.floor((gameState.matchedCount / gameState.totalIdioms) * 5)));
    
    if (isSuccess) {
        console.log('游戏成功完成！', { matchedCount: gameState.matchedCount, totalIdioms: gameState.totalIdioms });
        
        // 游戏成功，显示成功模态框
        const successModal = document.getElementById('success-modal');
        const finalStarsDisplay = document.getElementById('final-stars-display');
        const playAgainBtn = document.getElementById('play-again-btn');
        
        // 设置最终星级显示
        if (finalStarsDisplay) {
            finalStarsDisplay.textContent = '★'.repeat(finalStars);
            console.log('设置星级显示:', finalStars);
        }
        
        // 显示模态框 - 使用CSS类而不仅是修改样式
        if (successModal) {
            successModal.style.display = 'flex';
            successModal.classList.add('active');
            successModal.style.zIndex = '9999';
            console.log('模态框样式:', getComputedStyle(successModal));
        }
        
        // 为再玩一次按钮添加事件监听
        if (playAgainBtn) {
            playAgainBtn.onclick = function() {
                if (successModal) {
                    successModal.style.display = 'none';
                    successModal.classList.remove('active');
                }
                initializeGame();
            };
        }
        
        // 额外的调试信息
        console.log('显示成功模态框', { successModal, finalStarsDisplay, playAgainBtn });
    } else {
        // 游戏失败，显示消息
        const message = `游戏结束！得分：${gameState.score}\n已匹配 ${gameState.matchedCount}/${gameState.totalIdioms} 个成语`;
        showMessage(message, 'error');
        
        // 显示重新开始按钮
        if (elements.restartButton) {
            elements.restartButton.style.display = 'block';
        }
    }
    
    debugLog('游戏结束', { success: isSuccess, score: gameState.score, matched: gameState.matchedCount });
}

// 开始计时器
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateTimeDisplay();
        
        if (gameState.timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

// 重置游戏状态
function resetGameState() {
    gameState.idioms = [];
    gameState.wordBlocks = [];
    gameState.selectedBlocks = [];
    gameState.matchedCount = 0;
    gameState.score = 0;
    gameState.timeLeft = 120;
    
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    
    // 重置DOM
    updateSelectedDisplay();
    updateProgress();
    updateStars();
    updateScore();
    updateTimeDisplay();
    
    if (elements.restartButton) {
        elements.restartButton.style.display = 'none';
    }
}

// 初始化游戏
function initializeGame() {
    resetGameState();
    
    // 生成随机成语
    gameState.idioms = generateRandomIdioms(gameState.totalIdioms);
    
    // 创建两字一组的字块
    gameState.wordBlocks = [];
    gameState.idioms.forEach((idiom, idiomIndex) => {
        // 将四字成语拆分为两组两字
        const firstTwoChars = idiom.substring(0, 2);
        const lastTwoChars = idiom.substring(2, 4);
        
        // 创建第一个两字字块
        const firstBlock = createWordBlock(firstTwoChars, idiomIndex * 2, idiom);
        gameState.wordBlocks.push(firstBlock);
        
        // 创建第二个两字字块
        const secondBlock = createWordBlock(lastTwoChars, idiomIndex * 2 + 1, idiom);
        gameState.wordBlocks.push(secondBlock);
    });
    
    // 渲染游戏板
    renderGameBoard();
    
    // 开始计时
    startTimer();
    
    debugLog('游戏初始化完成', { idioms: gameState.idioms, totalBlocks: gameState.wordBlocks.length });
}

// 设置事件监听
function setupEventListeners() {
    // 重新开始按钮
    if (elements.restartButton) {
        elements.restartButton.addEventListener('click', initializeGame);
    }
    
    // 键盘事件 - 支持Backspace取消选择
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && gameState.selectedBlocks.length > 0) {
            const lastBlock = gameState.selectedBlocks[gameState.selectedBlocks.length - 1];
            deselectBlock(lastBlock);
        }
    });
    
    // 点击游戏板外的区域取消所有选择
    document.addEventListener('click', (e) => {
        if (!elements.gameBoard.contains(e.target) && !e.target.classList.contains('word-block')) {
            gameState.selectedBlocks.forEach(block => {
                block.classList.remove('selected');
            });
            gameState.selectedBlocks = [];
            updateSelectedDisplay();
        }
    });
}

// 游戏启动函数
function startGame() {
    setupEventListeners();
    initializeGame();
    
    debugLog('游戏启动');
}

// 当页面加载完成后启动游戏
document.addEventListener('DOMContentLoaded', startGame);