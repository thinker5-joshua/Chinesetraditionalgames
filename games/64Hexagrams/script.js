

// 游戏状态
let gameState = {
    allHexagrams: [...hexagramsData],
    remainingHexagrams: [...hexagramsData],
    currentHexagrams: [],
    selectedHexagrams: [],
    matchedPairs: 0,
    totalPairs: 64
};

// DOM 元素
const gameBoard = document.getElementById('game-board');
const progressText = document.getElementById('progress-text');
const progressFill = document.getElementById('progress-fill');
const successCountText = document.getElementById('success-count-text');
const selectedDisplay = document.getElementById('selected-display');
const successModal = document.getElementById('success-modal');
const lastHexagramInfo = document.getElementById('last-hexagram-info');
const playAgainButton = document.getElementById('play-again');
const hexagramDetailModal = document.getElementById('hexagram-detail-modal');
const detailTitle = document.getElementById('detail-title');
const hexagramDetailContent = document.getElementById('hexagram-detail-content');
const closeDetailButton = document.getElementById('close-detail');

// 初始化游戏
function initGame() {
    // 每次游戏只使用随机选择的3组卦象
    const shuffledHexagrams = [...hexagramsData].sort(() => Math.random() - 0.5);
    const threeHexagrams = shuffledHexagrams.slice(0, 3);
    
    gameState = {
        allHexagrams: [...threeHexagrams],
        remainingHexagrams: [...threeHexagrams],
        currentHexagrams: [],
        selectedHexagrams: [],
        matchedPairs: 0,
        totalPairs: 3
    };
    updateProgress();
    renderGameBoard();
}

// 更新进度
function updateProgress() {
    const progressPercentage = (gameState.matchedPairs / gameState.totalPairs) * 100;
    progressText.textContent = `${gameState.matchedPairs}/${gameState.totalPairs}`;
    progressFill.style.width = `${progressPercentage}%`;
    successCountText.textContent = gameState.matchedPairs;
}

// 渲染游戏板
function renderGameBoard() {
    gameBoard.innerHTML = '';
    
    // 创建两列容器
    const boardContainer = document.createElement('div');
    boardContainer.className = 'game-board-container';
    
    const hexagramColumn = document.createElement('div');
    hexagramColumn.className = 'hexagram-column';
    
    const nameColumn = document.createElement('div');
    nameColumn.className = 'name-column';
    
    // 如果剩余卦象不足3个，使用剩余的数量
    const displayCount = Math.min(3, gameState.remainingHexagrams.length);
    
    // 随机选择卦象
    gameState.currentHexagrams = [];
    const shuffled = [...gameState.remainingHexagrams].sort(() => Math.random() - 0.5);
    
    for (let i = 0; i < displayCount; i++) {
        gameState.currentHexagrams.push(shuffled[i]);
    }
    
    // 复制卦象数组用于卦名列，然后打乱顺序
    const nameHexagrams = [...gameState.currentHexagrams].sort(() => Math.random() - 0.5);
    
    // 渲染卦象列
    gameState.currentHexagrams.forEach((hexagram, index) => {
        const block = document.createElement('div');
        block.className = 'hexagram-block';
        block.dataset.index = index;
        block.dataset.type = 'symbol';
        block.dataset.hexagramId = hexagram.id;
        
        block.innerHTML = `
            <div class="hexagram-symbol">${hexagram.symbol}</div>
        `;
        
        // 添加点击事件
        block.addEventListener('click', () => handleHexagramClick(block));
        
        hexagramColumn.appendChild(block);
    });
    
    // 渲染卦名列
    nameHexagrams.forEach((hexagram, index) => {
        const block = document.createElement('div');
        block.className = 'hexagram-block';
        block.dataset.index = index + displayCount; // 确保索引不重复
        block.dataset.type = 'name';
        block.dataset.hexagramId = hexagram.id;
        
        // 拼装上下卦，显示为"上乾下震"格式
        const trigrams = `上${hexagram.upperTrigram}下${hexagram.lowerTrigram}`;
        
        block.innerHTML = `
            <div class="hexagram-name-row">
                <span class="hexagram-name">${hexagram.name}</span>
                <span class="hexagram-pinyin">${hexagram.pinyin}</span>
            </div>
            <div class="hexagram-alias-row">
                ${hexagram.alias}(${trigrams})
            </div>
        `;
        
        // 添加点击事件
        block.addEventListener('click', () => handleHexagramClick(block));
        
        nameColumn.appendChild(block);
    });
    
    // 组装游戏板
    boardContainer.appendChild(hexagramColumn);
    boardContainer.appendChild(nameColumn);
    gameBoard.appendChild(boardContainer);
    
    // 添加动画效果
    setTimeout(() => {
        const blocks = gameBoard.querySelectorAll('.hexagram-block');
        blocks.forEach((block, index) => {
            setTimeout(() => {
                block.classList.add('fade-in');
            }, index * 100);
        });
    }, 10);
}

// 创建卦象方块
function createHexagramBlock(hexagram, index) {
    const block = document.createElement('div');
    block.className = 'hexagram-block';
    block.dataset.index = index;
    
    // 随机决定显示卦象还是卦名
    const isSymbol = Math.random() > 0.5;
    
    block.innerHTML = `
        <div class="hexagram-symbol">${isSymbol ? hexagram.symbol : ''}</div>
        <div class="hexagram-name">${!isSymbol ? hexagram.name : ''}</div>
        <div class="hexagram-pinyin">${!isSymbol ? hexagram.pinyin : ''}</div>
    `;
    
    block.dataset.type = isSymbol ? 'symbol' : 'name';
    block.dataset.hexagramId = hexagram.id;
    
    // 添加点击事件
    block.addEventListener('click', () => handleHexagramClick(block));
    
    return block;
}

// 处理卦象点击
function handleHexagramClick(block) {
    // 如果已经选中了两个，不允许再选
    if (gameState.selectedHexagrams.length >= 2) {
        return;
    }
    
    // 如果点击的是已经选中的，取消选中
    if (block.classList.contains('selected')) {
        block.classList.remove('selected');
        gameState.selectedHexagrams = gameState.selectedHexagrams.filter(item => item.index !== parseInt(block.dataset.index));
        updateSelectedDisplay();
        return;
    }
    
    // 如果已经选中了一个，检查类型是否不同
    if (gameState.selectedHexagrams.length === 1) {
        const selectedBlock = gameState.selectedHexagrams[0].block;
        if (selectedBlock.dataset.type === block.dataset.type) {
            // 类型相同，不能匹配
            showMessage('请选择一个卦象和一个卦名进行匹配');
            return;
        }
    }
    
    // 选中方块
    block.classList.add('selected');
    gameState.selectedHexagrams.push({
        index: parseInt(block.dataset.index),
        block: block,
        hexagramId: parseInt(block.dataset.hexagramId),
        type: block.dataset.type
    });
    
    updateSelectedDisplay();
    
    // 如果选中了两个，检查是否匹配
    if (gameState.selectedHexagrams.length === 2) {
        checkMatch();
    }
}

// 更新选中显示
function updateSelectedDisplay() {
    if (gameState.selectedHexagrams.length === 0) {
        selectedDisplay.textContent = '未选择';
    } else {
        const selectedTexts = gameState.selectedHexagrams.map(item => {
            const hexagram = gameState.allHexagrams.find(h => h.id === item.hexagramId);
            return item.type === 'symbol' ? '卦象' : hexagram.name;
        });
        selectedDisplay.textContent = selectedTexts.join('、');
    }
}

// 检查是否匹配
function checkMatch() {
    const [first, second] = gameState.selectedHexagrams;
    
    if (first.hexagramId === second.hexagramId) {
        // 匹配成功
        setTimeout(() => {
            first.block.classList.add('success-animation');
            second.block.classList.add('success-animation');
            
            // 从剩余卦象中移除
            gameState.remainingHexagrams = gameState.remainingHexagrams.filter(
                hexagram => hexagram.id !== first.hexagramId
            );
            
            // 增加匹配计数
            gameState.matchedPairs++;
            updateProgress();
            
            // 显示成功信息
            showMessage('匹配成功！');
            
            // 获取匹配成功的卦象数据
            const matchedHexagram = gameState.allHexagrams.find(
                hexagram => hexagram.id === first.hexagramId
            );
            
            // 延迟后显示卦象详情并继续游戏逻辑
            setTimeout(() => {
                // 清除选中状态
                gameState.selectedHexagrams.forEach(item => {
                    item.block.remove();
                });
                gameState.selectedHexagrams = [];
                updateSelectedDisplay();
                
                // 显示匹配成功的卦象详情
                if (matchedHexagram) {
                    showHexagramDetail(matchedHexagram);
                }
                
                // 游戏继续逻辑在关闭详情模态框后由用户手动触发
            }, 800);
        }, 300);
    } else {
        // 匹配失败
        setTimeout(() => {
            showMessage('匹配失败，请再试一次');
            first.block.classList.remove('selected');
            second.block.classList.remove('selected');
            gameState.selectedHexagrams = [];
            updateSelectedDisplay();
        }, 500);
    }
}

// 显示消息
function showMessage(message) {
    selectedDisplay.textContent = message;
    setTimeout(() => {
        updateSelectedDisplay();
    }, 2000);
}

// 游戏结束
function endGame() {
    const allHexagrams = gameState.allHexagrams;
    lastHexagramInfo.innerHTML = '';
    
    // 第一阶段：显示成功页面
    const successPage = document.createElement('div');
    successPage.className = 'success-page';
    successPage.innerHTML = `
        <div class="success-content">
            <div class="success-icon">🎉</div>
            <h2>恭喜您！</h2>
            <p>您已成功匹配所有三组卦象！</p>
            <p>本次游戏您学习了以下卦象：</p>
            <div class="hexagram-preview-list">
                ${allHexagrams.map(hexagram => `
                    <div class="hexagram-preview-item">
                        <div class="preview-symbol" style="font-size: 1.5rem;">${hexagram.symbol}</div>
                        <div class="preview-name">${hexagram.name}</div>
                    </div>
                `).join('')}
            </div>
            <button id="view-details-btn" class="primary-button">查看卦象详情</button>
        </div>
    `;
    
    lastHexagramInfo.appendChild(successPage);
    
    // 更新成功消息
    const successMessage = document.querySelector('.success-message');
    if (successMessage) {
        successMessage.textContent = '恭喜！您已成功匹配所有三组卦象！';
    }
    
    // 显示成功模态框
    successModal.style.display = 'flex';
    
    // 添加查看详情按钮事件
    const viewDetailsBtn = document.getElementById('view-details-btn');
    viewDetailsBtn.addEventListener('click', () => showHexagramDetails(allHexagrams));
}

// 显示卦象详情卡片
function showHexagramDetails(hexagrams) {
    // 清空当前内容
    lastHexagramInfo.innerHTML = '';
    
    // 创建卡片容器
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'hexagram-cards-container';
    
    // 创建卡片翻转控制
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'cards-controls';
    
    const prevButton = document.createElement('button');
    prevButton.className = 'card-nav-button';
    prevButton.textContent = '上一张';
    prevButton.id = 'prev-card';
    
    const nextButton = document.createElement('button');
    nextButton.className = 'card-nav-button';
    nextButton.textContent = '下一张';
    nextButton.id = 'next-card';
    
    const cardIndicator = document.createElement('span');
    cardIndicator.className = 'card-indicator';
    cardIndicator.textContent = '1/3';
    
    controlsContainer.appendChild(prevButton);
    controlsContainer.appendChild(cardIndicator);
    controlsContainer.appendChild(nextButton);
    
    // 创建卡片
    hexagrams.forEach((hexagram, index) => {
        const card = document.createElement('div');
        card.className = 'hexagram-card';
        card.dataset.index = index;
        
        // 创建六爻说明HTML
        let yaoTextsHtml = '';
        const yaoNames = ['初九', '九二', '九三', '九四', '六五', '上六'];
        hexagram.yaoTexts.forEach((yaoText, yaoIndex) => {
            const yaoName = yaoText.split('：')[0] || yaoNames[yaoIndex];
            const yaoContent = yaoText.split('：')[1] || yaoText;
            yaoTextsHtml += `
                <div class="yao-info">
                    <strong>${yaoName}：</strong>${yaoContent}
                </div>
            `;
        });
        
        card.innerHTML = `
            <div class="hexagram-card-inner">
                <div class="hexagram-symbol" style="font-size: 2.5rem;">${hexagram.symbol}</div>
                <h3 class="card-hexagram-name">${hexagram.name} (${hexagram.pinyin})</h3>
                <div class="card-hexagram-text">${hexagram.hexagramText}</div>
                <h4 class="card-yao-title">六爻详解：</h4>
                <div class="card-yao-texts">${yaoTextsHtml}</div>
            </div>
        `;
        
        // 第一张卡片可见，其余隐藏
        if (index !== 0) {
            card.style.display = 'none';
        }
        
        cardsContainer.appendChild(card);
    });
    
    lastHexagramInfo.appendChild(cardsContainer);
    lastHexagramInfo.appendChild(controlsContainer);
    
    // 添加翻页功能
    let currentCardIndex = 0;
    const totalCards = hexagrams.length;
    
    function updateCardDisplay() {
        const cards = cardsContainer.querySelectorAll('.hexagram-card');
        cards.forEach((card, index) => {
            card.style.display = index === currentCardIndex ? 'block' : 'none';
        });
        cardIndicator.textContent = `${currentCardIndex + 1}/${totalCards}`;
    }
    
    prevButton.addEventListener('click', () => {
        currentCardIndex = (currentCardIndex - 1 + totalCards) % totalCards;
        updateCardDisplay();
    });
    
    nextButton.addEventListener('click', () => {
        currentCardIndex = (currentCardIndex + 1) % totalCards;
        updateCardDisplay();
    });
}

// 显示卦象详情
function showHexagramDetail(hexagram) {
    detailTitle.textContent = `${hexagram.name} (${hexagram.pinyin})`;
    
    // 获取相关卦象
    const mutualHexagram = hexagramsData.find(h => h.id === hexagram.mutualHexagram);
    const reverseHexagram = hexagramsData.find(h => h.id === hexagram.reverseHexagram);
    const oppositeHexagram = hexagramsData.find(h => h.id === hexagram.oppositeHexagram);
    
    let content = `
        <div class="hexagram-symbol">${hexagram.symbol}</div>
        <h3>${hexagram.fullName} <span class="hexagram-structure" style="font-size: 0.8em; color: #666; margin-left: 10px;">（上${hexagram.upperTrigram}下${hexagram.lowerTrigram}）</span></h3>
        <div class="hexagram-basic-info">
            <!-- 去掉卦级显示 -->
        </div>
        <h3>象曰</h3>
        <p class="xiang-yue">${hexagram.xiangYue}</p>
        <h3>卦辞</h3>
        <p>${hexagram.hexagramText}</p>
        <h3>爻辞</h3>
    `;
    
    hexagram.yaoTexts.forEach(yaoText => {
        content += `<div class="yao-info"><strong>${yaoText.split('：')[0]}：</strong>${yaoText.split('：')[1] || ''}</div>`;
    });
    
    // 添加相关卦象信息
    content += `
        <h3>相关卦象</h3>
        <div class="related-hexagrams">
    `;
    
    // 互卦
    if (mutualHexagram) {
        content += `
            <div class="related-hexagram-item">
                <h4>互卦</h4>
                <div class="related-hexagram-content">
                    <span class="related-hexagram-symbol">${mutualHexagram.symbol}</span>
                    <span class="related-hexagram-name">${mutualHexagram.name}</span>
                    <span class="related-hexagram-alias">(${mutualHexagram.alias})</span>
                </div>
            </div>
        `;
    }
    
    // 综卦
    if (reverseHexagram) {
        content += `
            <div class="related-hexagram-item">
                <h4>综卦</h4>
                <div class="related-hexagram-content">
                    <span class="related-hexagram-symbol">${reverseHexagram.symbol}</span>
                    <span class="related-hexagram-name">${reverseHexagram.name}</span>
                    <span class="related-hexagram-alias">(${reverseHexagram.alias})</span>
                </div>
            </div>
        `;
    }
    
    // 错卦
    if (oppositeHexagram) {
        content += `
            <div class="related-hexagram-item">
                <h4>错卦</h4>
                <div class="related-hexagram-content">
                    <span class="related-hexagram-symbol">${oppositeHexagram.symbol}</span>
                    <span class="related-hexagram-name">${oppositeHexagram.name}</span>
                    <span class="related-hexagram-alias">(${oppositeHexagram.alias})</span>
                </div>
            </div>
        `;
    }
    
    // 在卦意说明之前显示特性
    content += `
        </div>
        <h3>特性</h3>
        <p class="characteristics">${hexagram.characteristics}</p>
        <h3>卦意说明</h3>
        <p class="description">${hexagram.description}</p>
    `;
    
    hexagramDetailContent.innerHTML = content;
    hexagramDetailModal.style.display = 'flex';
}

// 事件监听器
playAgainButton.addEventListener('click', () => {
    successModal.style.display = 'none';
    initGame();
});

// 关闭详情模态框后继续游戏
function closeDetailAndContinueGame() {
    hexagramDetailModal.style.display = 'none';
    
    // 如果还有剩余卦象，重新渲染游戏板
    if (gameState.remainingHexagrams.length > 0) {
        renderGameBoard();
    } else {
        // 游戏结束
        endGame();
    }
}

closeDetailButton.addEventListener('click', closeDetailAndContinueGame);

// 点击模态框外部关闭
window.addEventListener('click', (event) => {
    if (event.target === hexagramDetailModal) {
        closeDetailAndContinueGame();
    }
});

// 初始化游戏
window.addEventListener('load', initGame);

// 添加键盘快捷键
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && hexagramDetailModal.style.display === 'flex') {
        closeDetailAndContinueGame();
    }
});

// 八宫卦分组数据
const eightHouseGroups = [
    { name: "乾宫", hexagrams: [1, 33, 27, 24, 19, 16, 13, 9] },
    { name: "兑宫", hexagrams: [58, 41, 62, 59, 10, 38, 60, 56] },
    { name: "离宫", hexagrams: [30, 13, 22, 37, 55, 35, 63, 20] },
    { name: "震宫", hexagrams: [51, 24, 20, 53, 62, 3, 11, 17] },
    { name: "巽宫", hexagrams: [57, 44, 28, 50, 31, 32, 14, 6] },
    { name: "坎宫", hexagrams: [29, 64, 40, 47, 5, 48, 27, 4] },
    { name: "艮宫", hexagrams: [52, 26, 21, 39, 56, 36, 61, 15] },
    { name: "坤宫", hexagrams: [2, 16, 8, 23, 7, 12, 18, 25] }
];

// 学习页面相关变量
let currentGroupType = 'order'; // 'order' 或 'eight-house'
let currentGroupIndex = 0;
let currentViewMode = 'random'; // 'group' 或 'random'，默认随机翻阅
let currentRandomHexagram = null;
let shuffledHexagrams = []; // 乱序后的卦象数组
let currentRandomIndex = 0;

// DOM元素 - 学习页面
const goLearnButton = document.getElementById('go-learn');
const learnPage = document.getElementById('learn-page');
const backToGameButton = document.getElementById('back-to-game');

// 模式切换按钮
const groupModeButton = document.getElementById('group-mode');
const randomModeButton = document.getElementById('random-mode');

// 分组选择
const groupSelectorContainer = document.getElementById('group-selector-container');
const orderGroupButton = document.getElementById('order-group');
const eightHouseGroupButton = document.getElementById('eight-house-group');

// 视图容器
const groupView = document.getElementById('group-view');
const randomView = document.getElementById('random-view');
const groupPagination = document.getElementById('group-pagination');

// 卦列表
const hexagramList = document.getElementById('hexagram-list');
const groupInfo = document.getElementById('group-info');
const prevGroupButton = document.getElementById('prev-group');
const nextGroupButton = document.getElementById('next-group');

// 随机翻阅元素
const randomHexagramSymbol = document.getElementById('random-hexagram-symbol');
const randomHexagramName = document.getElementById('random-hexagram-name');
const randomHexagramPinyin = document.getElementById('random-hexagram-pinyin');
const randomHexagramAlias = document.getElementById('random-hexagram-alias');
const randomHexagramId = document.getElementById('random-hexagram-id');
const randomHexagramIdSmall = document.getElementById('random-hexagram-id-small');
const randomHexagramText = document.getElementById('random-hexagram-text');
const prevRandomButton = document.getElementById('prev-random');
const nextRandomButton = document.getElementById('next-random');

// 打乱数组顺序的函数
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 初始化学习页面功能
function initLearnPage() {
    // 初始化乱序卦象数组
    shuffledHexagrams = shuffleArray(hexagramsData);
    currentRandomIndex = 0;
    
    renderHexagramList();
    setupGroupButtons();
    setupPagination();
    setupModeButtons();
    setupRandomNavigation();
    setupRandomHexagramClick();
    
    // 默认显示随机模式
    currentViewMode = 'random';
    updateModeButtons();
    switchView();
    showRandomHexagram();
}

// 设置模式切换按钮
function setupModeButtons() {
    // 分组查看模式
    groupModeButton.addEventListener('click', () => {
        currentViewMode = 'group';
        updateModeButtons();
        switchView();
    });
    
    // 随机翻阅模式
    randomModeButton.addEventListener('click', () => {
        currentViewMode = 'random';
        // 重新打乱数组
        shuffledHexagrams = shuffleArray(hexagramsData);
        currentRandomIndex = 0;
        updateModeButtons();
        switchView();
        showRandomHexagram();
    });
}

// 更新模式按钮状态
function updateModeButtons() {
    groupModeButton.classList.toggle('active', currentViewMode === 'group');
    randomModeButton.classList.toggle('active', currentViewMode === 'random');
}

// 切换视图
function switchView() {
    if (currentViewMode === 'group') {
        // 显示分组视图
        // 显示分组方式选择
        const combinedSelector = document.querySelector('.combined-selector');
        const groupButtons = combinedSelector.querySelectorAll('.group-button:nth-child(5), .group-button:nth-child(6)');
        const groupLabel = combinedSelector.querySelector('label:nth-child(4)');
        
        groupLabel.style.display = 'inline-block';
        groupButtons.forEach(button => {
            button.style.display = 'inline-block';
        });
        
        randomView.style.display = 'none';
        groupView.style.display = 'block';
        groupPagination.style.display = 'flex';
    } else {
        // 显示随机翻阅视图
        // 隐藏分组方式选择
        const combinedSelector = document.querySelector('.combined-selector');
        const groupButtons = combinedSelector.querySelectorAll('.group-button:nth-child(5), .group-button:nth-child(6)');
        const groupLabel = combinedSelector.querySelector('label:nth-child(4)');
        
        groupLabel.style.display = 'none';
        groupButtons.forEach(button => {
            button.style.display = 'none';
        });
        
        groupView.style.display = 'none';
        groupPagination.style.display = 'none';
        randomView.style.display = 'flex';
    }
}

// 显示随机卦象
function showRandomHexagram() {
    currentRandomHexagram = shuffledHexagrams[currentRandomIndex];
    
    // 更新显示内容
    randomHexagramSymbol.textContent = currentRandomHexagram.symbol;
    
    // 卦名和拼音显示在一行
    randomHexagramName.textContent = currentRandomHexagram.name;
    randomHexagramPinyin.textContent = currentRandomHexagram.pinyin;
    
    // 别名和上下卦显示在一行
    const trigrams = `上${currentRandomHexagram.upperTrigram}下${currentRandomHexagram.lowerTrigram}`;
    randomHexagramAlias.textContent = `${currentRandomHexagram.alias}(${trigrams})`;
    
    // 显示卦辞
    randomHexagramText.innerHTML = `${currentRandomHexagram.hexagramText}`;
    
    // 显示小字卦序号在右下角
    randomHexagramIdSmall.textContent = `第${currentRandomHexagram.id}卦`;
}

// 设置随机翻阅导航
function setupRandomNavigation() {
    // 上一个卦象
    prevRandomButton.addEventListener('click', () => {
        currentRandomIndex = (currentRandomIndex - 1 + shuffledHexagrams.length) % shuffledHexagrams.length;
        showRandomHexagram();
    });
    
    // 下一个卦象
    nextRandomButton.addEventListener('click', () => {
        currentRandomIndex = (currentRandomIndex + 1) % shuffledHexagrams.length;
        showRandomHexagram();
    });
}

// 设置随机卦象框的点击事件
function setupRandomHexagramClick() {
    const randomHexagramCard = document.querySelector('.random-hexagram-card');
    if (randomHexagramCard) {
        randomHexagramCard.addEventListener('click', () => {
            if (currentRandomHexagram) {
                showHexagramDetail(currentRandomHexagram);
            }
        });
    }
}

// 渲染卦列表
function renderHexagramList() {
    const hexagramList = document.getElementById('hexagram-list');
    const groupInfo = document.getElementById('group-info');
    
    // 根据分组类型获取当前组的卦
    let currentGroupHexagrams;
    if (currentGroupType === 'order') {
        // 顺序分组
        const startIndex = currentGroupIndex * 8;
        currentGroupHexagrams = hexagramsData.slice(startIndex, startIndex + 8);
    } else {
        // 八宫分组
        const group = eightHouseGroups[currentGroupIndex];
        currentGroupHexagrams = group.hexagrams.map(id => 
            hexagramsData.find(h => h.id === id)
        ).filter(Boolean);
    }
    
    // 渲染卦列表
    hexagramList.innerHTML = currentGroupHexagrams.map(hexagram => `
        <div class="hexagram-item" data-id="${hexagram.id}">
            <div class="hexagram-item-symbol">${hexagram.symbol}</div>
            <div class="hexagram-item-name">${hexagram.name}</div>
            <div class="hexagram-item-pinyin">${hexagram.pinyin}</div>
        </div>
    `).join('');
    
    // 更新组信息
    groupInfo.textContent = `第${currentGroupIndex + 1}组 / 共8组`;
    
    // 添加卦项点击事件
    hexagramList.querySelectorAll('.hexagram-item').forEach(item => {
        item.addEventListener('click', () => {
            const hexagramId = parseInt(item.dataset.id);
            const hexagram = hexagramsData.find(h => h.id === hexagramId);
            showHexagramDetail(hexagram);
        });
    });
}

// 设置分组按钮事件
function setupGroupButtons() {
    // 顺序分组按钮
    orderGroupButton.addEventListener('click', () => {
        currentGroupType = 'order';
        currentGroupIndex = 0;
        updateGroupButtons();
        renderHexagramList();
    });
    
    // 八宫分组按钮
    eightHouseGroupButton.addEventListener('click', () => {
        currentGroupType = 'eight-house';
        currentGroupIndex = 0;
        updateGroupButtons();
        renderHexagramList();
    });
}

// 更新分组按钮状态
function updateGroupButtons() {
    // 更新分组按钮的active状态
    orderGroupButton.classList.remove('active');
    eightHouseGroupButton.classList.remove('active');
    if (currentGroupType === 'order') {
        orderGroupButton.classList.add('active');
    } else {
        eightHouseGroupButton.classList.add('active');
    }
}

// 设置分页按钮事件
function setupPagination() {
    // 上一组按钮
    prevGroupButton.addEventListener('click', () => {
        if (currentGroupIndex > 0) {
            currentGroupIndex--;
            renderHexagramList();
        }
    });
    
    // 下一组按钮
    nextGroupButton.addEventListener('click', () => {
        if (currentGroupIndex < 7) {
            currentGroupIndex++;
            renderHexagramList();
        }
    });
}

// 页面切换事件
if (goLearnButton) {
    goLearnButton.addEventListener('click', () => {
        document.querySelector('.game-container').style.display = 'none';
        learnPage.style.display = 'block';
        initLearnPage();
    });
}

if (backToGameButton) {
    backToGameButton.addEventListener('click', () => {
        learnPage.style.display = 'none';
        document.querySelector('.game-container').style.display = 'block';
    });
}

// 修改关闭详情模态框逻辑，适应学习页面
const originalCloseDetail = closeDetailAndContinueGame;
closeDetailAndContinueGame = function() {
    hexagramDetailModal.style.display = 'none';
    
    // 如果当前显示的是学习页面，不重新渲染游戏板
    if (learnPage.style.display === 'none') {
        // 如果还有剩余卦象，重新渲染游戏板
        if (gameState.remainingHexagrams.length > 0) {
            renderGameBoard();
        } else {
            // 游戏结束
            endGame();
        }
    }
};