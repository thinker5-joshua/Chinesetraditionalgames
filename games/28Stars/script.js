// 二十八星宿数据 - 调整位置使星星更分散，更符合中国古代天文学意象
const starsData = {
    // 东方青龙七宿
    east: [
        {
            id: '角',
            name: '角',
            pinyin: 'Jiǎo',
            description: '角宿位于东方青龙之首，象征龙的角。它由室女座的两颗亮星组成，是古代天文学中重要的标志星。',
            position: { x: 10, y: 35 }
        },
        {
            id: '亢',
            name: '亢',
            pinyin: 'Kàng',
            description: '亢宿是东方青龙的第二宿，代表龙的喉咙。包含室女座的四颗星，象征着权力与威严。',
            position: { x: 20, y: 30 }
        },
        {
            id: '氐',
            name: '氐',
            pinyin: 'Dī',
            description: '氐宿是东方青龙的第三宿，象征龙的前足。由天秤座的几颗星组成，代表着基础与支撑。',
            position: { x: 30, y: 25 }
        },
        {
            id: '房',
            name: '房',
            pinyin: 'Fáng',
            description: '房宿是东方青龙的第四宿，象征龙的胸房。包含天蝎座的几颗星，代表着中心与要害。',
            position: { x: 40, y: 25 }
        },
        {
            id: '心',
            name: '心',
            pinyin: 'Xīn',
            description: '心宿是东方青龙的第五宿，象征龙的心。主要由天蝎座的三颗星组成，其中心宿二是著名的红色亮星。',
            position: { x: 50, y: 20 }
        },
        {
            id: '尾',
            name: '尾',
            pinyin: 'Wěi',
            description: '尾宿是东方青龙的第六宿，象征龙的尾巴。由天蝎座的几颗星组成，形如龙尾摆动。',
            position: { x: 60, y: 30 }
        },
        {
            id: '箕',
            name: '箕',
            pinyin: 'Jī',
            description: '箕宿是东方青龙的第七宿，形如簸箕。由人马座的几颗星组成，象征着风信与簸扬。',
            position: { x: 70, y: 40 }
        }
    ],
    // 南方朱雀七宿
    south: [
        {
            id: '井',
            name: '井',
            pinyin: 'Jǐng',
            description: '井宿是南方朱雀的第一宿，形如水井。由双子座的几颗星组成，象征着水源与滋养。',
            position: { x: 80, y: 50 }
        },
        {
            id: '鬼',
            name: '鬼',
            pinyin: 'Guǐ',
            description: '鬼宿是南方朱雀的第二宿，象征着神秘与未知。由巨蟹座的几颗星组成，包含著名的蜂巢星团。',
            position: { x: 60, y: 70 }
        },
        {
            id: '柳',
            name: '柳',
            pinyin: 'Liǔ',
            description: '柳宿是南方朱雀的第三宿，形如柳树。由长蛇座的几颗星组成，象征着柔韧与生机。',
            position: { x: 55, y: 75 }
        },
        {
            id: '星',
            name: '星',
            pinyin: 'Xīng',
            description: '星宿是南方朱雀的第四宿，象征着星官与光明。由长蛇座的几颗亮星组成，是古代重要的导航星。',
            position: { x: 45, y: 80 }
        },
        {
            id: '张',
            name: '张',
            pinyin: 'Zhāng',
            description: '张宿是南方朱雀的第五宿，形如张开的弓。由长蛇座的几颗星组成，象征着扩张与伸展。',
            position: { x: 35, y: 75 }
        },
        {
            id: '翼',
            name: '翼',
            pinyin: 'Yì',
            description: '翼宿是南方朱雀的第六宿，象征着鸟的翅膀。由巨爵座和长蛇座的几颗星组成，代表着飞翔与自由。',
            position: { x: 25, y: 65 }
        },
        {
            id: '轸',
            name: '轸',
            pinyin: 'Zhěn',
            description: '轸宿是南方朱雀的第七宿，形如车轸。由乌鸦座的几颗星组成，象征着守护与引导。',
            position: { x: 15, y: 55 }
        }
    ],
    // 西方白虎七宿
    west: [
        {
            id: '奎',
            name: '奎',
            pinyin: 'Kuí',
            description: '奎宿是西方白虎的第一宿，形如跨立的人。由仙女座和双鱼座的几颗星组成，象征着强壮与力量。',
            position: { x: 15, y: 45 }
        },
        {
            id: '娄',
            name: '娄',
            pinyin: 'Lóu',
            description: '娄宿是西方白虎的第二宿，象征着聚集与收纳。由白羊座的几颗星组成，代表着丰收与积蓄。',
            position: { x: 25, y: 55 }
        },
        {
            id: '胃',
            name: '胃',
            pinyin: 'Wèi',
            description: '胃宿是西方白虎的第三宿，象征着消化与转化。由白羊座的几颗星组成，代表着吸收与成长。',
            position: { x: 35, y: 65 }
        },
        {
            id: '昴',
            name: '昴',
            pinyin: 'Mǎo',
            description: '昴宿是西方白虎的第四宿，著名的昴星团。由金牛座的七颗亮星组成，是天空中最著名的星团之一。',
            position: { x: 45, y: 70 }
        },
        {
            id: '毕',
            name: '毕',
            pinyin: 'Bì',
            description: '毕宿是西方白虎的第五宿，形如毕网。由金牛座的几颗星组成，象征着捕获与收获。',
            position: { x: 55, y: 75 }
        },
        {
            id: '觜',
            name: '觜',
            pinyin: 'Zī',
            description: '觜宿是西方白虎的第六宿，象征着虎的嘴。由猎户座的几颗星组成，代表着捕猎与吞噬。',
            position: { x: 65, y: 70 }
        },
        {
            id: '参',
            name: '参',
            pinyin: 'Shēn',
            description: '参宿是西方白虎的第七宿，著名的猎户座。包含参宿四、参宿七等亮星，是天空中最容易辨认的星座之一。',
            position: { x: 75, y: 60 }
        }
    ],
    // 北方玄武七宿
    north: [
        {
            id: '斗',
            name: '斗',
            pinyin: 'Dǒu',
            description: '斗宿是北方玄武的第一宿，形如斗勺。由人马座的几颗星组成，是古代重要的导航标志。',
            position: { x: 75, y: 15 }
        },
        {
            id: '牛',
            name: '牛',
            pinyin: 'Niú',
            description: '牛宿是北方玄武的第二宿，象征着牵牛星。由摩羯座的几颗星组成，与织女星隔银河相望。',
            position: { x: 65, y: 25 }
        },
        {
            id: '女',
            name: '女',
            pinyin: 'Nǚ',
            description: '女宿是北方玄武的第三宿，象征着织女星。由宝瓶座的几颗星组成，是中国传统七夕节的主角之一。',
            position: { x: 55, y: 15 }
        },
        {
            id: '虚',
            name: '虚',
            pinyin: 'Xū',
            description: '虚宿是北方玄武的第四宿，象征着空虚与神秘。由宝瓶座和小马座的几颗星组成，代表着无限与未知。',
            position: { x: 45, y: 10 }
        },
        {
            id: '危',
            name: '危',
            pinyin: 'Wēi',
            description: '危宿是北方玄武的第五宿，象征着危险与警示。由飞马座和宝瓶座的几颗星组成，代表着警惕与防护。',
            position: { x: 35, y: 15 }
        },
        {
            id: '室',
            name: '室',
            pinyin: 'Shì',
            description: '室宿是北方玄武的第六宿，象征着房屋与居所。由飞马座的几颗星组成，代表着安全与庇护。',
            position: { x: 25, y: 25 }
        },
        {
            id: '壁',
            name: '壁',
            pinyin: 'Bì',
            description: '壁宿是北方玄武的第七宿，象征着墙壁与边界。由飞马座和仙女座的几颗星组成，代表着守护与防御。',
            position: { x: 15, y: 35 }
        }
    ]
};

// 游戏状态
const gameState = {
    selectedStar: null,
    hiddenStars: {}, // 每个方位隐藏的星星ID
    revealedStars: {}, // 每个方位已揭示的星星ID
    completedDirections: [], // 已完成的方位
    initialized: false
};

// DOM元素引用
let starsContainer, starInfoPanel, starNameElement, starDescriptionElement, closeInfoBtn;
let directionButtons, progressBars, progressTexts, starNameLists, directionCards;
let modal, modalTitle, modalMessage, modalButton, finalModal, closeFinalModalBtn, playAgainBtn;

// 初始化DOM元素引用
function initDOMReferences() {
    starsContainer = document.querySelector('.stars-container');
    starInfoPanel = document.getElementById('star-info');
    starNameElement = document.getElementById('star-name');
    starDescriptionElement = document.getElementById('star-description');
    closeInfoBtn = document.getElementById('close-info');
    directionButtons = document.querySelectorAll('.direction-btn');
    progressBars = {
        east: document.getElementById('east-bar'),
        south: document.getElementById('south-bar'),
        west: document.getElementById('west-bar'),
        north: document.getElementById('north-bar')
    };
    progressTexts = {
        east: document.querySelector('#east-progress .progress-text'),
        south: document.querySelector('#south-progress .progress-text'),
        west: document.querySelector('#west-progress .progress-text'),
        north: document.querySelector('#north-progress .progress-text')
    };
    starNameLists = {
        east: document.getElementById('east-names'),
        south: document.getElementById('south-names'),
        west: document.getElementById('west-names'),
        north: document.getElementById('north-names')
    };
    directionCards = {
        east: document.getElementById('east-progress'),
        south: document.getElementById('south-progress'),
        west: document.getElementById('west-progress'),
        north: document.getElementById('north-progress')
    };
    modal = document.getElementById('success-modal');
    modalTitle = document.getElementById('modal-title');
    modalMessage = document.getElementById('modal-message');
    modalButton = document.getElementById('modal-close');
    finalModal = document.getElementById('final-success');
    closeFinalModalBtn = document.getElementById('final-close');
    playAgainBtn = document.getElementById('final-close');
}

// 初始化游戏
function initGame() {
    if (gameState.initialized) return;
    
    // 初始化DOM元素引用
    initDOMReferences();
    
    // 为每个方位随机选择一颗隐藏的星
    selectRandomHiddenStars();
    
    // 生成星象图
    generateStarChart();
    
    // 更新进度显示
    updateProgressDisplay();
    
    // 添加事件监听器
    addEventListeners();
    
    gameState.initialized = true;
}

// 为每个方位随机选择一颗隐藏的星
function selectRandomHiddenStars() {
    Object.keys(starsData).forEach(direction => {
        const stars = starsData[direction];
        const randomIndex = Math.floor(Math.random() * stars.length);
        gameState.hiddenStars[direction] = stars[randomIndex].id;
        gameState.revealedStars[direction] = stars
            .filter(star => star.id !== gameState.hiddenStars[direction])
            .map(star => star.id);
    });
}

// 生成星象图
function generateStarChart() {
    // 安全检查
    if (!starsContainer) {
        console.error('starsContainer 元素未找到');
        return;
    }
    
    // 清空星象图容器
    starsContainer.innerHTML = '<div class="starry-background"></div>';
    
    // 为每个方位的星星创建DOM元素
    Object.keys(starsData).forEach(direction => {
        const stars = starsData[direction];
        
        stars.forEach(star => {
            const isHidden = gameState.hiddenStars[direction] === star.id;
            const starHost = createStarElement(star, direction, isHidden);
            starsContainer.appendChild(starHost);
        });
    });
}

// 创建星星DOM元素
function createStarElement(star, direction, isHidden) {
    const starHost = document.createElement('div');
    // 为隐藏的星添加hidden类，用于闪烁效果
    starHost.className = `star-host ${direction} ${isHidden ? 'hidden' : ''}`;
    starHost.dataset.id = star.id;
    starHost.dataset.direction = direction;
    starHost.style.left = `${star.position.x}%`;
    starHost.style.top = `${star.position.y}%`;
    
    const starIcon = document.createElement('div');
    starIcon.className = 'star-icon';
    starIcon.style.setProperty('--star-color', getDirectionColor(direction));
    
    const starName = document.createElement('div');
    starName.className = 'star-name';
    starName.textContent = star.name;
    
    starHost.appendChild(starIcon);
    starHost.appendChild(starName);
    
    return starHost;
}

// 获取方位对应的颜色
function getDirectionColor(direction) {
    const colors = {
        east: '#ff6b6b',
        south: '#4ecdc4', 
        west: '#feca57',
        north: '#d299c2'
    };
    return colors[direction] || '#64ffda';
}

// 更新进度显示
function updateProgressDisplay() {
    // 安全检查
    if (!progressBars || !progressTexts || !starNameLists) {
        console.error('进度显示相关元素未找到');
        return;
    }
    
    Object.keys(starsData).forEach(direction => {
        const revealedCount = gameState.revealedStars[direction]?.length || 0;
        const totalCount = gameState.hiddenStars[direction] ? 7 : 0;
        const percentage = totalCount > 0 ? (revealedCount / totalCount) * 100 : 0;
        
        // 更新进度条
        if (progressBars[direction]) {
            progressBars[direction].style.width = `${percentage}%`;
        }
        
        // 更新进度文本
        if (progressTexts[direction]) {
            progressTexts[direction].textContent = `${revealedCount}/${totalCount}`;
        }
        
        // 更新星星名称列表
        updateStarNameList(direction);
        
        // 检查是否完成该方位
        if (revealedCount === totalCount && !gameState.completedDirections.includes(direction)) {
            gameState.completedDirections.push(direction);
            markDirectionCompleted(direction);
            showDirectionCompleteModal(direction);
        }
    });
    
    // 检查是否完成所有方位
    if (gameState.completedDirections.length === Object.keys(starsData).length) {
        showFinalSuccessModal();
    }
}

// 更新星星名称列表
function updateStarNameList(direction) {
    const starNamesList = starNameLists[direction];
    if (!starNamesList) {
        console.error(`星星名称列表元素未找到: ${direction}`);
        return;
    }
    
    starNamesList.innerHTML = '';
    
    // 只显示已找到的星星名称
    gameState.revealedStars[direction]?.forEach(starId => {
        const star = starsData[direction]?.find(s => s.id === starId);
        if (star) {
            const tag = document.createElement('span');
            tag.className = 'star-name-tag';
            tag.textContent = star.name;
            starNamesList.appendChild(tag);
        }
    });
}

// 标记方位完成
function markDirectionCompleted(direction) {
    if (!directionCards || !directionCards[direction]) {
        console.error(`方位卡片未找到: ${direction}`);
        return;
    }
    directionCards[direction].classList.add('completed');
}

// 显示方位完成模态框
function showDirectionCompleteModal(direction) {
    // 安全检查
    if (!modal || !modalTitle || !modalMessage) {
        console.error('模态框元素未找到');
        return;
    }
    
    const directionNames = {
        east: '东方青龙',
        south: '南方朱雀',
        west: '西方白虎', 
        north: '北方玄武'
    };
    
    modalTitle.textContent = `${directionNames[direction]}方位完备！`;
    modalMessage.textContent = `恭喜你成功找出${directionNames[direction]}方位的所有星宿，继续探索其他方位吧！`;
    modal.classList.add('show');
}

// 显示最终成功模态框
function showFinalSuccessModal() {
    if (!finalModal) {
        console.error('最终成功模态框未找到');
        return;
    }
    finalModal.classList.add('show');
}

// 验证方位选择
function verifyDirectionSelection(selectedDirection) {
    if (!gameState.selectedStar) return;
    
    const correctDirection = gameState.selectedStar.dataset.direction;
    const isHiddenStar = gameState.hiddenStars[correctDirection] === gameState.selectedStar.dataset.id;
    
    // 重置所有按钮样式
    directionButtons.forEach(btn => {
        btn.classList.remove('correct', 'wrong');
    });
    
    // 找到当前点击的按钮
    const clickedBtn = Array.from(directionButtons).find(btn => btn.dataset.direction === selectedDirection);
    
    if (selectedDirection === correctDirection && isHiddenStar) {
        // 选择正确
        clickedBtn.classList.add('correct');
        revealHiddenStar(gameState.selectedStar.dataset.id, correctDirection);
        hideStarInfoPanel();
    } else {
        // 选择错误
        clickedBtn.classList.add('wrong');
        setTimeout(() => {
            clickedBtn.classList.remove('wrong');
        }, 1000);
    }
}

// 揭示隐藏的星
function revealHiddenStar(starId, direction) {
    // 将星星添加到已揭示列表
    gameState.revealedStars[direction].push(starId);
    
    // 更新星星样式
    const starElement = document.querySelector(`.star-host[data-id="${starId}"][data-direction="${direction}"]`);
    if (starElement) {
        starElement.classList.remove('hidden');
        starElement.classList.add('correct');
        
        // 移除correct类以避免动画持续
        setTimeout(() => {
            starElement.classList.remove('correct');
        }, 2000);
    }
    
    // 更新进度显示
    updateProgressDisplay();
}

// 显示星星详情面板
function showStarInfoPanel(starElement) {
    if (!starElement || !starNameElement || !starDescriptionElement || !starInfoPanel || !directionButtons) return;
    
    const starId = starElement.dataset.id;
    const direction = starElement.dataset.direction;
    const starData = starsData[direction]?.find(star => star.id === starId);
    
    if (starData) {
        // 显示星宿名称和拼音
        starNameElement.innerHTML = `${starData.name} <span class="star-pinyin">${starData.pinyin}</span>`;
        starDescriptionElement.textContent = starData.description;
        
        // 记录选中的星星
        gameState.selectedStar = starElement;
        
        // 高亮选中的星星
        document.querySelectorAll('.star-host').forEach(host => {
            host.classList.remove('selected');
        });
        starElement.classList.add('selected');
        
        // 显示面板
        starInfoPanel.classList.add('show');
        
        // 重置方位按钮样式
        directionButtons.forEach(btn => {
            btn.classList.remove('correct', 'wrong');
        });
    }
}

// 隐藏星星详情面板
function hideStarInfoPanel() {
    if (starInfoPanel) {
        starInfoPanel.classList.remove('show');
    }
    
    // 移除星星选中状态
    if (gameState.selectedStar) {
        gameState.selectedStar.classList.remove('selected');
        gameState.selectedStar = null;
    }
}

// 重置游戏
function resetGame() {
    // 重置游戏状态
    gameState.selectedStar = null;
    gameState.hiddenStars = {};
    gameState.revealedStars = {};
    gameState.completedDirections = [];
    gameState.initialized = false;
    
    // 隐藏模态框
    modal.classList.remove('show');
    finalModal.classList.remove('show');
    
    // 移除完成标记
    Object.values(directionCards).forEach(card => {
        card.classList.remove('completed');
    });
    
    // 重新初始化游戏
    initGame();
}

// 添加事件监听器
function addEventListeners() {
    // 星星点击事件委托
    if (starsContainer) {
        starsContainer.addEventListener('click', (event) => {
            const starHost = event.target.closest('.star-host');
            if (starHost) {
                showStarInfoPanel(starHost);
            }
        });
    }
    
    // 关闭按钮事件
    if (closeInfoBtn) {
        closeInfoBtn.addEventListener('click', hideStarInfoPanel);
    }
    
    // 方位按钮点击事件
    if (directionButtons && directionButtons.length > 0) {
        directionButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const direction = btn.dataset.direction;
                verifyDirectionSelection(direction);
            });
        });
    }
    
    // 成功模态框按钮事件
    if (modalButton && modal) {
        modalButton.addEventListener('click', () => {
            modal.classList.remove('show');
        });
    }
    
    // 最终成功模态框按钮事件
    if (closeFinalModalBtn && finalModal) {
        closeFinalModalBtn.addEventListener('click', () => {
            finalModal.classList.remove('show');
        });
    }
    
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', resetGame);
    }
    
    // 点击面板外部关闭面板
    document.addEventListener('click', (event) => {
        if (starInfoPanel && starInfoPanel.classList.contains('show') &&
            !starInfoPanel.contains(event.target) &&
            !event.target.closest('.star-host')) {
            hideStarInfoPanel();
        }
    });
}

// 当页面加载完成后初始化游戏
window.addEventListener('DOMContentLoaded', initGame);