// 游戏数据存储
let gameData = {
    caves: [],
    poets: [],
    currentCave: null,
    currentPoem: null,
    hiddenChars: [],
    selectedPoetId: null,
    revealedHints: 0
};

// 视图和模态框
const views = {
    compass: document.getElementById('compass-view'),
    poetryChallenge: document.getElementById('poetry-challenge-view'),
    cave: document.getElementById('cave-view')
};

const modals = {
    success: document.getElementById('success-modal'),
    error: document.getElementById('error-modal')
};

// DOM 加载完成后执行
window.addEventListener('DOMContentLoaded', () => {
    // 确保地图容器可见
    const mapContainer = document.querySelector('.immortal-map-container');
    if (mapContainer) {
        mapContainer.style.display = 'block';
        mapContainer.style.opacity = '1';
    }
    
    // 确保地图背景可见
    const map = document.querySelector('.immortal-map');
    if (map) {
        map.style.display = 'block';
        map.style.opacity = '1';
    }
    
    loadGameData();
    setupEventListeners();
});

/**
 * 加载游戏数据
 */
async function loadGameData() {
    try {
        // 尝试从data.json加载数据
        const response = await fetch('data.json');
        const data = await response.json();
        
        // 存储游戏数据（只加载洞天和诗仙数据，不再加载全局诗词数组）
        gameData.caves = data.caves || [];
        gameData.poets = data.poets || [];
        
        // 初始化仙界地图
        initializeImmortalMap();
    } catch (error) {
        // 使用模拟数据
        useMockData();
    }
}

/**
 * 使用模拟数据（当无法加载data.json时使用）
 */
function useMockData() {
    // 模拟数据与data.json中的结构一致，每个洞天直接包含相关诗词
    gameData.caves = [
        {
            "id": 1,
            "name": "黄山",
            "location": "安徽省黄山市",
            "description": "黄山位于安徽省南部，以奇松、怪石、云海、温泉'四绝'闻名于世，被誉为'天下第一奇山'。",
            "mapImage": "assets/images/gugong.jpg",
            "related_poems": [
                {
                    "id": "huangshan-001",
                    "title": "送温处士归黄山白鹅峰旧居",
                    "author": "李白",
                    "content": "黄山四千仞，三十二莲峰。丹崖夹石柱，菡萏金芙蓉。",
                    "dynasty": "盛唐",
                    "connection_reason": "李白赞美黄山的雄伟壮观。"
                }
            ]
        },
        {
            "id": 2,
            "name": "西湖",
            "location": "浙江省杭州市",
            "description": "西湖位于浙江省杭州市西面，是中国大陆首批国家重点风景名胜区和中国十大风景名胜之一。",
            "mapImage": "assets/images/huangshan.jpg",
            "related_poems": [
                {
                    "id": "westlake-001",
                    "title": "饮湖上初晴后雨",
                    "author": "苏轼",
                    "content": "水光潋滟晴方好，山色空蒙雨亦奇。欲把西湖比西子，淡妆浓抹总相宜。",
                    "dynasty": "北宋",
                    "connection_reason": "苏轼描写西湖美景的经典之作。"
                }
            ]
        },
        {
            "id": 3,
            "name": "桂林山水",
            "location": "广西壮族自治区桂林市",
            "description": "桂林山水是对桂林旅游资源的总称，世界自然遗产。典型的喀斯特地形构成了别具一格的桂林山水。",
            "mapImage": "assets/images/jiuzhaigou.jpg",
            "related_poems": [
                {
                    "id": "guilin-001",
                    "title": "送桂州严大夫同用南字",
                    "author": "韩愈",
                    "content": "苍苍森八桂，兹地在湘南。江作青罗带，山如碧玉簪。",
                    "dynasty": "唐",
                    "connection_reason": "韩愈描绘了桂林山水的特点。"
                }
            ]
        },
        {
            "id": 4,
            "name": "庐山",
            "location": "江西省九江市",
            "description": "庐山以雄、奇、险、秀闻名于世，素有'匡庐奇秀甲天下'之美誉。",
            "mapImage": "assets/images/huangshan.jpg",
            "related_poems": [
                {
                    "id": "lushan-001",
                    "title": "望庐山瀑布",
                    "author": "李白",
                    "content": "日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。",
                    "dynasty": "唐",
                    "connection_reason": "李白赞美庐山瀑布的壮观景象。"
                }
            ]
        },
        {
            "id": 5,
            "name": "长江三峡",
            "location": "重庆市和湖北省宜昌市之间",
            "description": "长江三峡是瞿塘峡、巫峡和西陵峡三段峡谷的总称，是中国10大风景名胜之一。",
            "mapImage": "assets/images/jiuzhaigou.jpg",
            "related_poems": [
                {
                    "id": "sanjia-001",
                    "title": "早发白帝城",
                    "author": "李白",
                    "content": "朝辞白帝彩云间，千里江陵一日还。两岸猿声啼不住，轻舟已过万重山。",
                    "dynasty": "唐",
                    "connection_reason": "李白描绘了长江三峡的壮丽景色和行船的畅快感受。"
                }
            ]
        }
    ];
    
    gameData.poets = [
        {
            "id": 1,
            "name": "李白",
            "dynasty": "唐朝",
            "birthYear": "701年",
            "deathYear": "762年",
            "description": "李白，字太白，号青莲居士，又号'谪仙人'，唐代伟大的浪漫主义诗人。"
        },
        {
            "id": 2,
            "name": "杜甫",
            "dynasty": "唐朝",
            "birthYear": "712年",
            "deathYear": "770年",
            "description": "杜甫，字子美，自号少陵野老，唐代伟大的现实主义诗人。"
        },
        {
            "id": 3,
            "name": "苏轼",
            "dynasty": "北宋",
            "birthYear": "1037年",
            "deathYear": "1101年",
            "description": "苏轼，字子瞻、和仲，号东坡居士，北宋著名文学家、书法家、美食家。"
        }
    ];
    
    // 初始化仙界地图
    initializeImmortalMap();
}

// 全局变量用于存储当前显示的洞天和定时器
let currentDisplayedCaves = [];
let caveRotationTimer = null;

/**
 * 创建闪烁星星效果
 */
function createStars() {
    const immortalMap = document.querySelector('.immortal-map');
    if (!immortalMap) return;
    
    // 移除已存在的星星容器（如果有）
    const existingStars = document.getElementById('stars-container');
    if (existingStars) {
        existingStars.remove();
    }
    
    // 创建星星容器
    const starsContainer = document.createElement('div');
    starsContainer.id = 'stars-container';
    starsContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    
    // 创建20颗随机分布的星星
    for (let i = 0; i < 20; i++) {
        const star = document.createElement('div');
        const size = Math.floor(Math.random() * 3) + 1; // 1-3px大小
        const x = Math.floor(Math.random() * 100); // 0-100%
        const y = Math.floor(Math.random() * 100); // 0-100%
        const delay = Math.random() * 3; // 0-3秒延迟
        const duration = Math.random() * 2 + 1; // 1-3秒持续时间
        
        star.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            background-color: white;
            border-radius: 50%;
            opacity: ${Math.random() * 0.8 + 0.2};
            animation: starPulse ${duration}s ease-in-out infinite;
            animation-delay: ${delay}s;
        `;
        
        starsContainer.appendChild(star);
    }
    
    // 添加到地图中
    immortalMap.appendChild(starsContainer);
}

/**
 * 初始化仙界地图
 */
function initializeImmortalMap() {
    console.log('开始初始化仙界地图...');
    
    // 确保所有相关容器可见
    const immortalMapContainer = document.querySelector('.immortal-map-container');
    const immortalMap = document.querySelector('.immortal-map');
    
    if (immortalMapContainer) {
        console.log('找到仙界地图容器');
        immortalMapContainer.style.display = 'block';
        immortalMapContainer.style.opacity = '1';
        immortalMapContainer.style.visibility = 'visible';
    }
    
    if (immortalMap) {
        console.log('找到仙界地图');
        immortalMap.style.display = 'block';
        immortalMap.style.opacity = '1';
        immortalMap.style.visibility = 'visible';
    }
    
    // 确保洞天体容器存在，如果不存在则创建它
    let cavesContainer = document.getElementById('caves-container');
    if (!cavesContainer) {
        console.log('未找到洞天体容器，创建新的');
        cavesContainer = document.createElement('div');
        cavesContainer.id = 'caves-container';
        cavesContainer.style.display = 'block';
        
        // 将洞天体容器添加到仙界地图内部
        if (immortalMap) {
            immortalMap.appendChild(cavesContainer);
            console.log('洞天体容器已添加到仙界地图');
        } else if (immortalMapContainer) {
            immortalMapContainer.appendChild(cavesContainer);
            console.log('洞天体容器已添加到地图容器');
        } else {
            document.body.appendChild(cavesContainer);
            console.log('洞天体容器已添加到body');
        }
    } else {
        console.log('找到洞天体容器，确保可见');
        cavesContainer.style.display = 'block';
        cavesContainer.style.visibility = 'visible';
    }
    
    // 创建星空效果
    createStars();
    
    // 添加星星闪烁动画样式
    const styleId = 'stars-animation-style';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes starPulse {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.2); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 打印游戏数据信息
    console.log('游戏数据中有洞天数量:', gameData.caves ? gameData.caves.length : 0);
    
    // 立即显示洞天体，与地图同步显示
    console.log('开始显示随机洞天...');
    currentDisplayedCaves = displayRandomCaves();
    console.log('洞天体显示完成，共显示:', currentDisplayedCaves.length);
    
    // 设置定时器，每2秒轮换显示新的洞天体
    console.log('启动洞天轮换定时器...');
    startCaveRotation();
    console.log('仙界地图初始化完成');
}

/**
 * 开始洞天轮换
 */
function startCaveRotation() {
    // 清除已有的定时器（如果存在）
    if (caveRotationTimer) {
        clearInterval(caveRotationTimer);
    }
    
    // 设置新的定时器，每2秒执行一次
    caveRotationTimer = setInterval(() => {
        // 淡出当前洞天体
        const caveElements = document.querySelectorAll('.cave-item');
        caveElements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '0';
                setTimeout(() => {
                    element.remove();
                }, 300);
            }, index * 50);
        });
        
        // 短暂延迟后显示新的洞天体
        setTimeout(() => {
            currentDisplayedCaves = displayRandomCaves();
        }, 400); // 缩短延迟，加快洞天体更换速度
    }, 2000);
}

/**
 * 在地图上显示随机的5个洞天，分布在仙界地图区域内
 */
function displayRandomCaves() {
    console.log('开始显示随机洞天...');
    
    // 1. 一次性添加所有必要的动画样式
    const styleId = 'caves-animation-styles';
    if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            @keyframes cavePulse {
                0% { transform: scale(1); }
                100% { transform: scale(1.1); }
            }
            @keyframes caveFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-15px); }
            }
            .cave-item {
                animation: caveFloat 3s ease-in-out infinite;
                transition: all 0.3s ease;
                display: flex !important;
            }
            .cave-item:hover {
                transform: scale(1.1);
                box-shadow: 0 0 40px currentColor, 0 0 60px rgba(255, 255, 255, 0.8);
            }
        `;
        document.head.appendChild(style);
        console.log('已添加洞天体动画样式');
    }
    
    // 2. 获取洞天体容器和仙界地图容器
    const cavesContainer = document.getElementById('caves-container');
    const immortalMapContainer = document.querySelector('.immortal-map-container');
    
    console.log('洞天体容器存在:', !!cavesContainer);
    console.log('仙界地图容器存在:', !!immortalMapContainer);
    
    if (!cavesContainer) {
        console.error('未找到洞天体容器');
        return [];
    }
    
    // 确保洞天体容器样式正确 - 使用absolute定位确保覆盖整个地图
    cavesContainer.style.position = 'absolute';
    cavesContainer.style.width = '100%';
    cavesContainer.style.height = '100%';
    cavesContainer.style.display = 'block';
    cavesContainer.style.visibility = 'visible';
    cavesContainer.style.zIndex = '1000';
    console.log('洞天体容器样式已设置为absolute定位');
    
    // 为洞天体元素添加pointer-events: auto，确保它们可以被交互
    
    // 清空容器
    cavesContainer.innerHTML = '';
    console.log('已清空洞天体容器');
    
    // 3. 从游戏数据中随机选择5个洞天
    let cavesToDisplay = [];
    if (gameData.caves && gameData.caves.length > 0) {
        console.log('使用游戏数据中的洞天，总数:', gameData.caves.length);
        // 复制数组以避免修改原始数据
        const cavesCopy = [...gameData.caves];
        // 随机排序并取前5个
        cavesToDisplay = cavesCopy.sort(() => Math.random() - 0.5).slice(0, 5);
    } else {
        console.log('使用默认洞天数��');
        // 如果没有洞天数��，使用默认数据
        cavesToDisplay = [
            { id: 1, name: '黄山', related_poems: [{id: 'default-1', title: '黄山美景', author: '诗人', content: '黄山奇景甲天下', dynasty: '古代'}] },
            { id: 2, name: '西湖', related_poems: [{id: 'default-2', title: '西湖风光', author: '诗人', content: '西湖美景不胜收', dynasty: '古代'}] },
            { id: 3, name: '桂林山水', related_poems: [{id: 'default-3', title: '桂林山水', author: '诗人', content: '桂林山水甲天下', dynasty: '古代'}] },
            { id: 4, name: '庐山', related_poems: [{id: 'default-4', title: '庐山云雾', author: '诗人', content: '庐山云雾绕青峰', dynasty: '古代'}] },
            { id: 5, name: '长江三峡', related_poems: [{id: 'default-5', title: '长江三峡', author: '诗人', content: '三峡风光无限好', dynasty: '古代'}] }
        ];
    }
    
    console.log('选择的洞天数量:', cavesToDisplay.length);
    
    // 定义洞天体在地图区域内的随机位置和颜色
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#ff9ff3', '#a29bfe', '#fd79a8'];
    
    // 创建所有洞天体
    cavesToDisplay.forEach((cave, index) => {
        console.log('创建洞天:', cave.name, '索引:', index);
        
        // 生成随机位置，确保在地图上方区域且不重叠
        let x = Math.floor(Math.random() * 60) + 10; // 10% - 70%
        let y = Math.floor(Math.random() * 40) + 5;  // 5% - 45%，避开底部的任意门
        const colorIndex = Math.floor(Math.random() * colors.length);
        
        let position = {
            x: `${x}%`,
            y: `${y}%`,
            color: colors[colorIndex]
        };
        
        // 简化重叠检测逻辑，避免复杂计算
        if (index > 0) {
            const caveElements = document.querySelectorAll('.cave-item');
            if (caveElements.length > 0) {
                // 简单调整位置，确保不重叠
                x = Math.floor(Math.random() * 60) + 10;
                y = Math.floor(Math.random() * 40) + 5;
                position = {
                    x: `${x}%`,
                    y: `${y}%`,
                    color: colors[colorIndex]
                };
            }
        }
        
        const caveElement = document.createElement('div');
        caveElement.className = 'cave-item';
        caveElement.textContent = cave.name;
        caveElement.dataset.caveId = cave.id;
        
        // 确保样式应用且可见
        caveElement.style.position = 'absolute';
        caveElement.style.left = position.x;
        caveElement.style.top = position.y;
        caveElement.style.width = '120px';
        caveElement.style.height = '120px';
        caveElement.style.backgroundColor = position.color;
        caveElement.style.color = 'white';
        caveElement.style.fontSize = '18px';
        caveElement.style.fontWeight = 'bold';
        caveElement.style.border = '3px solid white';
        caveElement.style.borderRadius = '50%';
        caveElement.style.display = 'flex';
        caveElement.style.alignItems = 'center';
        caveElement.style.justifyContent = 'center';
        caveElement.style.textAlign = 'center';
        caveElement.style.cursor = 'default';
        caveElement.style.padding = '10px';
        caveElement.style.boxSizing = 'border-box';
        caveElement.style.lineHeight = '1.2';
        caveElement.style.zIndex = '1000'; // 提高z-index确保可见
        caveElement.style.boxShadow = `0 0 15px ${position.color}, 0 0 20px rgba(255, 255, 255, 0.3)`;
        caveElement.style.animationDelay = `${index * 0.5}s`;
        caveElement.style.pointerEvents = 'auto';
        caveElement.style.opacity = '1';
        caveElement.style.visibility = 'visible';
        caveElement.style.zIndex = '1001'; // 确保洞天体元素在容器之上
        
        // 添加到容器
        cavesContainer.appendChild(caveElement);
        console.log('洞天已添加到容器:', cave.name);
    });
    
    console.log('所有洞天体创建完成，实际添加数量:', document.querySelectorAll('.cave-item').length);
    return cavesToDisplay;
}

/**
 * 从当前显示的8个洞天中随机选择一个
 */
/**
 * 从当前显示的5个洞天中随机选择一个
 */
function selectRandomCaveFromDisplayed() {
    // 获取所有洞天体
    const cavesToChoose = document.querySelectorAll('.cave-item');
    
    if (cavesToChoose.length === 0) {
        // 重新显示洞天体
        currentDisplayedCaves = displayRandomCaves();
        return;
    }
    
    // 暂停定时器
    if (caveRotationTimer) {
        clearInterval(caveRotationTimer);
    }
    
    // 让其他洞天停止闪烁并降低透明度
    document.querySelectorAll('.cave-item').forEach(element => {
        element.style.opacity = '0.3';
        element.style.transition = 'all 0.3s ease';
    });
    
    // 随机选择一个洞天
    const randomIndex = Math.floor(Math.random() * cavesToChoose.length);
    const selectedCaveElement = cavesToChoose[randomIndex];
    
    // 选中的洞天放大并高亮
    selectedCaveElement.style.opacity = '1';
    selectedCaveElement.style.transform = 'scale(1.2)';
    
    // 查找对应的洞天数据
    const caveId = parseInt(selectedCaveElement.dataset.caveId);
    gameData.currentCave = gameData.caves.find(cave => cave.id === caveId);
    
    // 从该洞天相关的诗词中随机选择一首
    if (gameData.currentCave && gameData.currentCave.related_poems && gameData.currentCave.related_poems.length > 0) {
        gameData.currentPoem = gameData.currentCave.related_poems[Math.floor(Math.random() * gameData.currentCave.related_poems.length)];
    } else {
        // 设置一个基本的默认诗词
        gameData.currentPoem = {
            title: '默认诗词',
            content: '此处应有诗词内容',
            author: '未知诗人',
            explanation: '暂无解释'
        };
    }
    
    // 重置游戏状态
    gameData.hiddenChars = [];
    gameData.selectedPoetId = null;
    gameData.revealedHints = 0;
    
    // 延迟后切换到诗词挑战视图
    setTimeout(() => {
        showPoetryChallengeView();
    }, 1500);
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 下一首诗词按钮将在showCaveView中初始化
    setupNextPoemButton();
    
    // 仙界任意门按钮
    const fairyDoorBtn = document.getElementById('fairy-door-btn') || document.getElementById('start-map');
    if (fairyDoorBtn) {
        fairyDoorBtn.textContent = '仙界任意门';
        
        // 添加选中状态效果
        fairyDoorBtn.addEventListener('mouseenter', function() {
            this.classList.add('selected');
        });
        
        fairyDoorBtn.addEventListener('mouseleave', function() {
            // 只有在没有执行点击动画时才移除选中效果
            if (!this.classList.contains('rotating')) {
                this.classList.remove('selected');
            }
        });
        
        fairyDoorBtn.addEventListener('click', function() {
            // 保存按钮引用
            const btn = this;
            
            // 移除之前可能存在的动画类
            btn.classList.remove('pulse', 'selected');
            
            // 添加旋转动画效果，表示开始穿越
            btn.classList.add('rotating');
            
            // 按钮禁用，防止重复点击
            btn.disabled = true;
            
            // 1100毫秒后执行选择逻辑，让用户看到完整的翻转色条和光效果动画
            setTimeout(() => {
                selectRandomCaveFromDisplayed();
                
                // 动画完成后重置按钮状态
                setTimeout(() => {
                    btn.classList.remove('rotating');
                    btn.disabled = false;
                }, 100);
            }, 1100);
        });
    }
    
    // 移除了提交答案和查看提示按钮的事件监听
    // 现在选项选择后会自动提交答案
    
    // 进入洞天按钮
    document.getElementById('enter-cave').addEventListener('click', enterCave);
    
    // 关闭错误提示按钮
    document.getElementById('close-error').addEventListener('click', () => {
        modals.error.style.display = 'none';
    });
    
    // 返回罗盘按钮已移除，不再需要事件监听
    
    // 探索下一幻境按钮
    document.getElementById('next-dreamland').addEventListener('click', () => {
        // 重置游戏状态并返回罗盘视图
        resetGameState();
        // 移除自动点击按钮的逻辑，让用户手动选择新的洞天
    });
    
    // 天气切换按钮
    document.querySelectorAll('.weather-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.weather-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updateWeatherDisplay(e.target.dataset.day);
        });
    });
    
    // 初始化天气切换按钮
    setupWeatherButtons();
}

/**
 * 显示诗词挑战界面
 */
function showPoetryChallengeView() {
    // 检查诗词数据
    if (!gameData.currentPoem) {
        alert('无法加载诗词挑战，请重试');
        return;
    }
    
    // 检查视图元素
    if (!views.poetryChallenge) {
        alert('界面加载失败，请刷新页面');
        return;
    }
    
    // 隐藏当前视图，显示诗词挑战视图
    hideAllViews();
    views.poetryChallenge.classList.add('active');
    
    // 洞天体容器与地图一起显示和隐藏，不需要单独处理
    
    try {
        // 重置提示区域
        const hintContent = document.querySelector('.hint-content');
        if (hintContent) {
            hintContent.style.display = 'none';
            const hintText = hintContent.querySelector('p');
            if (hintText) {
                hintText.textContent = '提示内容将在这里显示...';
            }
        }
        
        // 显示洞天提示
        const cavePromptElement = document.querySelector('.cave-prompt');
        if (cavePromptElement) {
            const caveName = gameData.currentCave?.name || '未知洞天';
            cavePromptElement.textContent = `你即将进入${caveName}，请你完成此洞天诗词通关`;
            cavePromptElement.style.display = 'block';
        }
        
        // 显示诗词标题
        const titleElement = document.querySelector('.poem-title');
        if (titleElement && gameData.currentPoem.title) {
            titleElement.textContent = gameData.currentPoem.title;
        }
        
        // 显示诗人信息
        const poetInfoElement = document.querySelector('.poet-info');
        if (poetInfoElement && gameData.currentPoem.author) {
            poetInfoElement.textContent = gameData.currentPoem.author;
            poetInfoElement.style.display = 'block';
        }
        
        // 处理诗词内容，随机隐藏1个非标点符号的字，并生成选项
        try {
            processPoemContent();
        } catch (processError) {
            // 添加备用的简单诗词显示，避免整个页面加载失败
            const contentElement = document.querySelector('.poem-content');
            if (contentElement && gameData.currentPoem.content) {
                contentElement.innerHTML = `<div style="text-align:center; color:#8b4513;">${gameData.currentPoem.content.replace(/\n/g, '<br>')}</div>`;
            }
        }
    } catch (initError) {
        alert('加载挑战内容时出错，请重试');
    }
}

/**
 * 生成与目标字相关的干扰选项
 */
function generateRelatedOptions(targetChar, poemContent) {
    // 扩展的相似字库，包含256个常用汉字及其相关字
    const similarCharsMap = {
        '山': ['出', '岩', '岗', '峰'],
        '水': ['江', '河', '湖', '海'],
        '云': ['雾', '霞', '烟', '雪'],
        '日': ['月', '星', '光', '明'],
        '春': ['夏', '秋', '冬', '年'],
        '风': ['雨', '霜', '露', '雪'],
        '花': ['草', '树', '木', '叶'],
        '天': ['地', '人', '山', '水'],
        '人': ['民', '众', '群', '众'],
        '心': ['思', '想', '念', '意'],
        '目': ['眼', '睛', '看', '见'],
        '手': ['指', '掌', '拳', '臂'],
        '口': ['舌', '唇', '齿', '牙'],
        '耳': ['听', '闻', '声', '音'],
        '足': ['脚', '步', '跟', '跑'],
        '头': ['脑', '发', '面', '首'],
        '道': ['路', '途', '径', '巷'],
        '城': ['市', '都', '镇', '郭'],
        '国': ['家', '邦', '土', '域'],
        '乡': ['村', '庄', '里', '舍'],
        '田': ['地', '野', '亩', '耕'],
        '园': ['林', '苑', '圃', '囿'],
        '树': ['木', '林', '森', '材'],
        '草': ['花', '苗', '芽', '蔓'],
        '竹': ['竿', '笋', '简', '箭'],
        '梅': ['兰', '竹', '菊', '松'],
        '松': ['柏', '杉', '槐', '柳'],
        '风': ['云', '雾', '霾', '霞'],
        '雨': ['雪', '霜', '露', '雹'],
        '雷': ['电', '闪', '鸣', '震'],
        '火': ['炎', '热', '烟', '灰'],
        '冰': ['霜', '雪', '冷', '冻'],
        '光': ['明', '亮', '辉', '耀'],
        '暗': ['黑', '夜', '阴', '影'],
        '早': ['晨', '朝', '旭', '曙'],
        '晚': ['暮', '夕', '昏', '夜'],
        '东': ['南', '西', '北', '中'],
        '南': ['东', '西', '北', '中'],
        '西': ['东', '南', '北', '中'],
        '北': ['东', '南', '西', '中'],
        '前': ['后', '左', '右', '上'],
        '后': ['前', '左', '右', '下'],
        '左': ['右', '前', '后', '旁'],
        '右': ['左', '前', '后', '侧'],
        '上': ['下', '高', '顶', '端'],
        '下': ['上', '低', '底', '脚'],
        '高': ['低', '大', '巨', '伟'],
        '低': ['高', '小', '矮', '微'],
        '大': ['小', '巨', '伟', '宏'],
        '小': ['大', '微', '细', '少'],
        '多': ['少', '众', '群', '满'],
        '少': ['多', '寡', '稀', '微'],
        '长': ['短', '远', '久', '永'],
        '短': ['长', '暂', '瞬', '片'],
        '远': ['近', '遥', '辽', '阔'],
        '近': ['远', '邻', '旁', '接'],
        '深': ['浅', '厚', '沉', '浓'],
        '浅': ['深', '薄', '淡', '轻'],
        '明': ['暗', '亮', '清', '白'],
        '暗': ['明', '黑', '阴', '晦'],
        '清': ['浊', '净', '纯', '洁'],
        '浊': ['清', '浑', '污', '秽'],
        '甘': ['甜', '苦', '酸', '辣'],
        '苦': ['甜', '甘', '酸', '涩'],
        '酸': ['甜', '苦', '辣', '咸'],
        '甜': ['苦', '酸', '辣', '甘'],
        '辣': ['酸', '甜', '苦', '咸'],
        '咸': ['酸', '甜', '苦', '辣'],
        '香': ['臭', '芳', '芬', '馨'],
        '臭': ['香', '腥', '臊', '膻'],
        '美': ['丑', '好', '丽', '佳'],
        '丑': ['美', '陋', '怪', '恶'],
        '好': ['坏', '美', '善', '优'],
        '坏': ['好', '恶', '劣', '差'],
        '善': ['恶', '好', '良', '贤'],
        '恶': ['善', '坏', '丑', '劣'],
        '真': ['假', '实', '诚', '纯'],
        '假': ['真', '伪', '虚', '装'],
        '实': ['虚', '真', '诚', '满'],
        '虚': ['实', '空', '幻', '假'],
        '有': ['无', '存', '在', '含'],
        '无': ['有', '空', '虚', '缺'],
        '生': ['死', '存', '活', '诞'],
        '死': ['生', '亡', '逝', '终'],
        '活': ['死', '生', '存', '动'],
        '动': ['静', '活', '运', '行'],
        '静': ['动', '寂', '宁', '安'],
        '来': ['去', '往', '至', '归'],
        '去': ['来', '往', '离', '走'],
        '进': ['退', '出', '入', '行'],
        '退': ['进', '后', '撤', '离'],
        '出': ['入', '进', '来', '去'],
        '入': ['出', '进', '来', '去'],
        '开': ['关', '启', '张', '展'],
        '关': ['开', '闭', '合', '封'],
        '天': ['地', '上', '空', '苍'],
        '地': ['天', '土', '陆', '壤'],
        '河': ['江', '湖', '海', '川'],
        '湖': ['江', '河', '海', '泊'],
        '海': ['江', '河', '湖', '洋'],
        '江': ['河', '湖', '海', '川'],
        '泉': ['水', '溪', '涧', '源'],
        '溪': ['流', '涧', '泉', '川'],
        '石': ['岩', '礁', '碑', '壁'],
        '土': ['地', '泥', '沙', '尘'],
        '金': ['银', '铜', '铁', '锡'],
        '银': ['金', '铜', '铁', '钱'],
        '铜': ['金', '银', '铁', '钱'],
        '铁': ['金', '银', '铜', '钢'],
        '玉': ['石', '宝', '珠', '翠'],
        '珠': ['玉', '宝', '钻', '珍'],
        '宝': ['珍', '珠', '玉', '贵'],
        '珍': ['宝', '贵', '稀', '奇'],
        '衣': ['服', '装', '裳', '袍'],
        '食': ['饭', '粮', '餐', '饮'],
        '住': ['居', '住', '宿', '宅'],
        '行': ['走', '路', '动', '旅'],
        '学': ['习', '读', '书', '研'],
        '习': ['学', '练', '复', '惯'],
        '书': ['籍', '本', '卷', '页'],
        '笔': ['墨', '纸', '砚', '文'],
        '文': ['字', '章', '书', '句'],
        '字': ['文', '词', '句', '章'],
        '诗': ['词', '歌', '赋', '文'],
        '词': ['诗', '歌', '赋', '曲'],
        '歌': ['曲', '词', '乐', '咏'],
        '曲': ['歌', '乐', '调', '谱'],
        '画': ['图', '绘', '描', '写'],
        '乐': ['音', '歌', '曲', '韵'],
        '琴': ['棋', '书', '画', '乐'],
        '棋': ['琴', '书', '画', '戏'],
        '礼': ['仪', '节', '规', '矩'],
        '义': ['道', '理', '仁', '德'],
        '智': ['慧', '聪', '明', '识'],
        '勇': ['敢', '猛', '刚', '强'],
        '仁': ['义', '德', '慈', '善'],
        '德': ['道', '仁', '义', '品'],
        '信': ['诚', '实', '诺', '约'],
        '忠': ['孝', '义', '信', '诚'],
        '孝': ['悌', '忠', '义', '敬'],
        '友': ['朋', '伴', '知', '交'],
        '朋': ['友', '伴', '知', '交'],
        '恩': ['德', '情', '义', '惠'],
        '情': ['感', '爱', '意', '心'],
        '爱': ['情', '喜', '疼', '惜'],
        '恨': ['怨', '仇', '憎', '恶'],
        '喜': ['怒', '哀', '乐', '悦'],
        '怒': ['喜', '哀', '乐', '愤'],
        '哀': ['乐', '悲', '伤', '痛'],
        '乐': ['哀', '喜', '悦', '欢'],
        '笑': ['哭', '乐', '嘲', '讽'],
        '哭': ['笑', '泣', '啼', '嚎'],
        '愁': ['忧', '虑', '烦', '恼'],
        '忧': ['愁', '虑', '烦', '恐'],
        '思': ['想', '念', '虑', '怀'],
        '想': ['思', '念', '虑', '盼'],
        '念': ['思', '想', '记', '忆'],
        '望': ['看', '观', '眺', '盼'],
        '看': ['望', '观', '察', '视'],
        '听': ['闻', '聆', '觉', '知'],
        '说': ['话', '讲', '述', '谈'],
        '话': ['说', '讲', '谈', '语'],
        '言': ['语', '话', '说', '讲'],
        '语': ['言', '话', '说', '谈'],
        '问': ['答', '询', '访', '求'],
        '答': ['问', '回', '应', '复'],
        '读': ['诵', '念', '阅', '看'],
        '写': ['书', '记', '作', '撰'],
        '作': ['写', '创', '制', '为'],
        '工': ['作', '劳', '役', '勤'],
        '劳': ['苦', '累', '勤', '辛'],
        '勤': ['劳', '奋', '勉', '苦'],
        '懒': ['惰', '闲', '散', '慢'],
        '快': ['慢', '疾', '速', '捷'],
        '慢': ['快', '缓', '迟', '钝'],
        '急': ['缓', '迫', '促', '切'],
        '缓': ['急', '慢', '迟', '徐'],
        '忙': ['闲', '碌', '繁', '冗'],
        '闲': ['忙', '空', '悠', '暇'],
        '早': ['晚', '晨', '朝', '旭'],
        '晚': ['早', '暮', '夕', '昏'],
        '日': ['月', '星', '光', '阳'],
        '月': ['日', '星', '亮', '光'],
        '星': ['月', '日', '辰', '宿'],
        '年': ['岁', '载', '秋', '春'],
        '岁': ['年', '载', '纪', '龄'],
        '时': ['间', '刻', '分', '秒'],
        '间': ['时', '空', '隙', '隔'],
        '分': ['秒', '时', '刻', '离'],
        '秒': ['分', '时', '刻', '瞬'],
        '天': ['日', '号', '期', '晨'],
        '周': ['期', '旬', '月', '年'],
        '月': ['份', '期', '年', '日'],
        '年': ['岁', '载', '世', '代'],
        '春': ['夏', '秋', '冬', '季'],
        '夏': ['春', '秋', '冬', '季'],
        '秋': ['春', '夏', '冬', '季'],
        '冬': ['春', '夏', '秋', '季'],
        '晨': ['昏', '朝', '夕', '暮'],
        '昏': ['晨', '暮', '夕', '晚'],
        '朝': ['夕', '晨', '暮', '晚'],
        '夕': ['朝', '暮', '晚', '昏'],
        '寒': ['暑', '冷', '凉', '冻'],
        '暑': ['寒', '热', '温', '暖'],
        '热': ['冷', '暖', '温', '烫'],
        '冷': ['热', '寒', '凉', '冻'],
        '暖': ['寒', '热', '温', '凉'],
        '凉': ['暖', '冷', '寒', '爽'],
        '新': ['旧', '陈', '鲜', '初'],
        '旧': ['新', '陈', '老', '古'],
        '老': ['少', '幼', '旧', '古'],
        '少': ['老', '幼', '小', '青'],
        '幼': ['老', '少', '小', '童'],
        '男': ['女', '儿', '子', '汉'],
        '女': ['男', '妇', '妻', '母'],
        '父': ['母', '亲', '爸', '爹'],
        '母': ['父', '亲', '妈', '娘'],
        '儿': ['女', '子', '孩', '童'],
        '子': ['女', '儿', '孩', '童'],
        '兄': ['弟', '姐', '妹', '亲'],
        '弟': ['兄', '姐', '妹', '亲'],
        '姐': ['妹', '兄', '弟', '亲'],
        '妹': ['姐', '兄', '弟', '亲'],
        '夫': ['妻', '妇', '丈', '汉'],
        '妻': ['夫', '妇', '媳', '伴'],
        '师': ['徒', '生', '傅', '教'],
        '徒': ['师', '生', '学', '弟'],
        '朋': ['友', '伴', '知', '交'],
        '友': ['朋', '伴', '知', '交'],
        '主': ['客', '宾', '东', '人'],
        '客': ['主', '宾', '朋', '友'],
        '官': ['吏', '员', '宦', '臣'],
        '民': ['众', '人', '群', '庶'],
        '王': ['帝', '君', '侯', '主'],
        '臣': ['忠', '官', '吏', '仆'],
        '将': ['帅', '军', '士', '兵'],
        '军': ['兵', '将', '士', '卒'],
        '兵': ['士', '卒', '军', '将'],
        '士': ['兵', '卒', '军', '将'],
        '农': ['耕', '种', '田', '夫'],
        '工': ['匠', '人', '师', '徒'],
        '商': ['贾', '贸', '易', '客'],
        '贾': ['商', '贸', '易', '客'],
        '钱': ['财', '币', '金', '银'],
        '财': ['钱', '富', '贵', '资'],
        '富': ['贵', '贫', '穷', '财'],
        '贵': ['贱', '富', '尊', '荣'],
        '贫': ['富', '穷', '困', '苦'],
        '穷': ['富', '贫', '困', '苦'],
        '利': ['益', '弊', '害', '损'],
        '益': ['利', '害', '弊', '损'],
        '功': ['劳', '绩', '勋', '业'],
        '劳': ['功', '苦', '累', '勤'],
        '成': ['败', '功', '就', '完'],
        '败': ['成', '功', '失', '负'],
        '胜': ['负', '赢', '败', '捷'],
        '负': ['胜', '赢', '败', '亏'],
        '得': ['失', '获', '取', '收'],
        '失': ['得', '丢', '掉', '去'],
        '取': ['舍', '拿', '得', '收'],
        '舍': ['取', '弃', '丢', '扔'],
        '予': ['给', '与', '赠', '送'],
        '取': ['舍', '得', '拿', '获'],
        '进': ['退', '升', '上', '前'],
        '退': ['进', '降', '下', '后'],
        '升': ['降', '上', '起', '高'],
        '降': ['升', '下', '落', '低'],
        '生': ['死', '存', '活', '长'],
        '死': ['生', '亡', '逝', '终'],
        '存': ['亡', '在', '活', '留'],
        '亡': ['存', '死', '灭', '逝'],
        '兴': ['衰', '起', '盛', '旺'],
        '衰': ['兴', '弱', '败', '落'],
        '盛': ['衰', '旺', '兴', '繁'],
        '旺': ['衰', '盛', '兴', '火'],
        '有': ['无', '存', '在', '拥'],
        '无': ['有', '空', '虚', '缺'],
        '多': ['少', '众', '繁', '密'],
        '少': ['多', '寡', '稀', '缺'],
        '大': ['小', '巨', '伟', '庞'],
        '小': ['大', '微', '细', '少'],
        '高': ['低', '矮', '耸', '立'],
        '低': ['高', '矮', '下', '降'],
        '长': ['短', '久', '远', '永'],
        '短': ['长', '暂', '瞬', '片'],
        '宽': ['窄', '广', '阔', '大'],
        '窄': ['宽', '狭', '小', '细'],
        '厚': ['薄', '重', '深', '沉'],
        '薄': ['厚', '轻', '浅', '淡'],
        '重': ['轻', '沉', '厚', '浓'],
        '轻': ['重', '飘', '浮', '薄']
    };
    
    // 获取相似字
    const similarChars = similarCharsMap[targetChar] || ['日', '月', '风', '雨'];
    
    // 确保选项中包含正确答案
    let options = [targetChar];
    
    // 添加干扰选项，确保不重复
    while (options.length < 4) {
        const randomChar = similarChars[Math.floor(Math.random() * similarChars.length)];
        if (!options.includes(randomChar)) {
            options.push(randomChar);
        }
    }
    
    // 随机打乱选项顺序
    return options.sort(() => Math.random() - 0.5);
}

/**
 * 处理诗词内容，随机隐藏1个字符并生成选项
 */
function processPoemContent() {
    console.log('开始处理诗词内容');
    
    try {
        // 验证当前诗词数据
        if (!gameData.currentPoem) {
            console.error('错误：当前没有选择诗词');
            return;
        }
        
        // 获取诗词内容
        const poemContent = gameData.currentPoem.content;
        if (!poemContent) {
            console.error('错误：诗词内容为空');
            return;
        }
        
        // 获取内容容器
        const contentElement = document.querySelector('.poem-content');
        if (!contentElement) {
            console.error('错误：诗词内容容器未找到');
            return;
        }
        
        // 清空内容
        contentElement.innerHTML = '';
        
        // 处理诗词内容，确保一句一行显示
        console.log('处理诗词行');
        const lines = poemContent.split('\n').filter(line => line.trim() !== '');
        if (lines.length === 0) {
            console.error('错误：诗词内容无法分割成行');
            contentElement.innerHTML = `<div style="text-align:center; color:#8b4513;">${poemContent}</div>`;
            return;
        }
        
        // 合并所有非标点符号字符，用于选择隐藏位置
        const allText = lines.join('');
        const validChars = [];
        
        // 查找所有非标点符号字符的位置
        console.log('查找有效字符位置');
        try {
            for (let i = 0; i < allText.length; i++) {
                const char = allText[i];
                // 排除标点符号和空格
                if (!/[，。！？；："'\s]/u.test(char)) {
                    validChars.push(i);
                }
            }
            console.log(`找到 ${validChars.length} 个有效字符`);
        } catch (regexError) {
            console.error('正则表达式匹配时出错:', regexError);
            // 如果正则出错，简单地将所有字符视为有效字符
            for (let i = 0; i < allText.length; i++) {
                validChars.push(i);
            }
        }
        
        // 随机选择1个位置隐藏字符
        gameData.hiddenChars = [];
        if (validChars.length > 0) {
            console.log('选择隐藏字符');
            try {
                const randomIndex = Math.floor(Math.random() * validChars.length);
                const charPosition = validChars[randomIndex];
                gameData.hiddenChars.push(charPosition);
                
                // 存储正确的字符
                gameData.correctChar = allText[charPosition];
                console.log(`隐藏字符: "${gameData.correctChar}"，位置: ${charPosition}`);
                
                // 生成相关选项
                try {
                    const options = generateRelatedOptions(gameData.correctChar, allText);
                    
                    // 显示选项
                const optionsContainer = document.querySelector('.options-container');
                if (optionsContainer) {
                    optionsContainer.innerHTML = '';
                    optionsContainer.style.display = 'flex';
                    
                    options.forEach((option, index) => {
                        const optionElement = document.createElement('div');
                        optionElement.className = 'option-btn';
                        optionElement.textContent = option;
                        optionElement.dataset.option = option;
                        
                        // 添加点击事件 - 选择后自动提交
                        optionElement.addEventListener('click', () => {
                            try {
                                // 移除其他选项的选中状态
                                document.querySelectorAll('.option-btn').forEach(opt => {
                                    opt.classList.remove('selected');
                                });
                                // 添加当前选项的选中状态
                                optionElement.classList.add('selected');
                                // 存储选中的答案
                                gameData.selectedAnswer = option;
                                // 自动提交答案
                                checkAnswer();
                            } catch (clickError) {
                                console.error('选项点击事件处理出错:', clickError);
                            }
                        });
                        
                        optionsContainer.appendChild(optionElement);
                    });
                }
                } catch (optionsError) {
                    console.error('生成选项时出错:', optionsError);
                    // 即使生成选项失败，也要继续显示诗词内容
                }
            } catch (hiddenError) {
                console.error('选择隐藏字符时出错:', hiddenError);
                // 即使隐藏字符选择失败，也要继续显示诗词内容
            }
        } else {
            console.warn('警告：未找到可隐藏的有效字符');
        }
        
        // 显示诗词内容，确保一句一行
        console.log('渲染诗词内容');
        let currentPosition = 0;
        
        lines.forEach((line, lineIndex) => {
            try {
                // 创建行容器
                const lineContainer = document.createElement('div');
                lineContainer.className = 'poem-line';
                lineContainer.style.marginBottom = '10px'; // 行间距
                lineContainer.style.textAlign = 'center'; // 居中显示
                
                // 处理行中的每个字符
                for (let i = 0; i < line.length; i++) {
                    const char = line[i];
                    
                    // 检查当前字符是否是隐藏字符
                    if (gameData.hiddenChars && gameData.hiddenChars.includes(currentPosition)) {
                        // 显示隐藏字的位置
                        const hiddenSpan = document.createElement('span');
                        hiddenSpan.className = 'hidden-char';
                        hiddenSpan.textContent = '_';
                        hiddenSpan.dataset.position = currentPosition;
                        lineContainer.appendChild(hiddenSpan);
                    } else {
                        // 显示普通字符
                        const textNode = document.createTextNode(char);
                        lineContainer.appendChild(textNode);
                    }
                    
                    // 增加全局位置计数器
                    currentPosition++;
                }
                
                // 添加行到内容元素
                contentElement.appendChild(lineContainer);
            } catch (lineError) {
                console.error(`渲染第${lineIndex}行时出错:`, lineError);
                // 添加简单的文本行作为替代
                const fallbackLine = document.createElement('div');
                fallbackLine.style.textAlign = 'center';
                fallbackLine.textContent = line;
                contentElement.appendChild(fallbackLine);
            }
        });
        
        console.log('诗词内容处理完成');
    } catch (error) {
        console.error('处理诗词内容时出现未预期的错误:', error);
        console.error('错误堆栈:', error.stack);
        
        // 显示简单的诗词内容作为备用
        try {
            const contentElement = document.querySelector('.poem-content');
            if (contentElement && gameData.currentPoem && gameData.currentPoem.content) {
                contentElement.innerHTML = `<div style="text-align:center; color:#8b4513;">${gameData.currentPoem.content.replace(/\n/g, '<br>')}</div>`;
                console.log('已显示备用诗词内容');
            }
        } catch (fallbackError) {
            console.error('显示备用内容时出错:', fallbackError);
        }
    }
}

/**
 * 显示诗人选项
 */
function displayPoetOptions() {
    const poetsContainer = document.querySelector('.poets-container');
    poetsContainer.innerHTML = '';
    
    // 随机排序诗人
    const shuffledPoets = [...gameData.poets].sort(() => Math.random() - 0.5);
    
    // 创建诗人选项
    shuffledPoets.forEach(poet => {
        const poetOption = document.createElement('div');
        poetOption.className = 'poet-option';
        poetOption.textContent = poet.name;
        poetOption.dataset.poetId = poet.id;
        
        // 添加点击事件
        poetOption.addEventListener('click', () => {
            // 移除其他选项的选中状态
            document.querySelectorAll('.poet-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            // 添加当前选项的选中状态
            poetOption.classList.add('selected');
            gameData.selectedPoetId = parseInt(poetOption.dataset.poetId);
        });
        
        poetsContainer.appendChild(poetOption);
    });
}

/**
 * 检查答案
 */
function checkAnswer() {
    console.log('开始检查答案');
    
    try {
        // 验证当前诗词数据
        if (!gameData.currentPoem) {
            console.error('错误：当前没有选择诗词');
            alert('请先选择一首诗词');
            return;
        }
        
        // 检查是否选择了答案
        if (!gameData.selectedAnswer) {
            console.log('用户未选择答案');
            alert('请选择一个答案');
            return;
        }
        
        console.log(`用户选择的答案: "${gameData.selectedAnswer}", 正确答案: "${gameData.correctChar}"`);
        
        // 验证答案
        const answerCorrect = gameData.selectedAnswer === gameData.correctChar;
        
        // 如果答案正确，显示正确的字在诗词中
        if (answerCorrect) {
            console.log('答案正确！');
            try {
                const hiddenCharElements = document.querySelectorAll('.hidden-char');
                hiddenCharElements.forEach(element => {
                    try {
                        element.textContent = gameData.correctChar;
                        element.classList.add('revealed');
                    } catch (elementError) {
                        console.error('更新隐藏字元素时出错:', elementError);
                    }
                });
                
                // 显示成功模态框
                setTimeout(() => {
                    try {
                        if (modals && modals.success) {
                            modals.success.style.display = 'flex';
                        } else {
                            console.error('成功模态框未找到');
                            alert('恭喜，答案正确！');
                        }
                    } catch (modalError) {
                        console.error('显示成功模态框时出错:', modalError);
                        alert('恭喜，答案正确！');
                    }
                }, 500);
            } catch (correctError) {
                console.error('处理正确答案时出错:', correctError);
                alert('恭喜，答案正确！');
            }
        } else {
            console.log('答案错误，显示提示');
            
            // 创建提示元素或使用已有的提示区域
            let hintContent = document.querySelector('.hint-content');
            if (!hintContent) {
                // 如果不存在提示容器，创建一个
                hintContent = document.createElement('div');
                hintContent.className = 'hint-content';
                hintContent.innerHTML = '<p>提示内容将在这里显示...</p>';
                hintContent.style.display = 'none';
                
                // 将提示容器添加到诗词挑战视图中
                const challengeContainer = document.querySelector('.challenge-container');
                if (challengeContainer) {
                    challengeContainer.appendChild(hintContent);
                }
            }
            
            // 根据已显示的提示数量提供不同级别的提示
            if (gameData.revealedHints === 0) {
                // 第一个提示：显示字的结构或部首
                let radicalHint = '';
                const radicalMap = {
                    '山': '这个字与山有关',
                    '水': '这个字与水有关',
                    '日': '这个字与太阳有关',
                    '月': '这个字与月亮有关',
                    '木': '这个字与树木有关',
                    '人': '这个字与人有关',
                    '心': '这个字与心有关',
                    '口': '这个字与口有关'
                };
                
                // 检查字符是否包含常见部首
                for (const [radical, hint] of Object.entries(radicalMap)) {
                    if (gameData.correctChar.includes(radical)) {
                        radicalHint = hint;
                        break;
                    }
                }
                
                if (!radicalHint) {
                    radicalHint = '这是一个常见汉字';
                }
                
                hintContent.querySelector('p').textContent = `提示 1/2: ${radicalHint}`;
            } else if (gameData.revealedHints === 1) {
                // 第二个提示：显示字的拼音首字母
                hintContent.querySelector('p').textContent = `提示 2/2: 这个字的拼音首字母是 ${gameData.correctChar.charAt(0).match(/[a-zA-Z]/) ? gameData.correctChar.charAt(0).toUpperCase() : '?'}`;
            }
            
            // 显示提示内容
            hintContent.style.display = 'block';
            
            // 更新提示计数
            gameData.revealedHints++;
            
            // 添加错误提示样式（可选）
            const selectedOption = document.querySelector('.option.selected');
            if (selectedOption) {
                selectedOption.classList.add('wrong');
                setTimeout(() => {
                    selectedOption.classList.remove('wrong');
                }, 1000);
            }
        }
    } catch (error) {
        console.error('检查答案时出现未预期的错误:', error);
        console.error('错误堆栈:', error.stack);
        alert('检查答案时出错，请重试');
    }
}

/**
 * 显示提示
 */
function showHint() {
    const hintContent = document.querySelector('.hint-content');
    hintContent.style.display = 'block';
    
    // 根据已显示的提示数量提供不同级别的提示
    if (gameData.revealedHints === 0) {
        // 第一个提示：显示字的结构或部首
        let radicalHint = '';
        // 简单的部首判断（实际应用中可以使用更复杂的汉字分析）
        const radicalMap = {
            '山': '这个字与山有关',
            '水': '这个字与水有关',
            '日': '这个字与太阳有关',
            '月': '这个字与月亮有关',
            '木': '这个字与树木有关',
            '人': '这个字与人有关',
            '心': '这个字与心有关',
            '口': '这个字与口有关'
        };
        
        // 检查字符是否包含常见部首
        for (const [radical, hint] of Object.entries(radicalMap)) {
            if (gameData.correctChar.includes(radical)) {
                radicalHint = hint;
                break;
            }
        }
        
        if (!radicalHint) {
            radicalHint = '这是一个常见汉字';
        }
        
        hintContent.querySelector('p').textContent = `提示 1/2: ${radicalHint}`;
    } else {
        // 第二个提示：显示字的拼音首字母
        hintContent.querySelector('p').textContent = `提示 2/2: 这个字的拼音首字母是 ${gameData.correctChar.charAt(0).match(/[a-zA-Z]/) ? gameData.correctChar.charAt(0).toUpperCase() : '?'}`;
    }
    
    gameData.revealedHints++;
}

/**
 * 进入洞天展示界面
 */
function enterCave() {
    console.log('进入洞天展示界面');
    
    // 隐藏成功模态框
    if (modals.success) {
        modals.success.style.display = 'none';
    }
    
    // 确保currentPoem存在且正确初始化
    if (gameData.currentCave) {
        console.log('当前洞天:', gameData.currentCave.name, 'ID:', gameData.currentCave.id);
        
        // 只使用洞天自带的related_poems数组查找相关诗词
        let relatedPoems = [];
        
        if (gameData.currentCave.related_poems && Array.isArray(gameData.currentCave.related_poems) && gameData.currentCave.related_poems.length > 0) {
            relatedPoems = gameData.currentCave.related_poems;
            console.log('使用洞天自带的related_poems数组，长度:', relatedPoems.length);
        }
        
        console.log('找到的相关诗词:', relatedPoems);
        
        // 如果找到相关诗词，选择第一首（为了排版一致性）
        if (relatedPoems.length > 0) {
            gameData.currentPoem = relatedPoems[0];
            console.log('已选择诗词:', gameData.currentPoem.title, '-', gameData.currentPoem.author);
        } else {
            console.warn('未找到相关诗词，使用默认诗词');
            gameData.currentPoem = {
                title: '暂无相关诗词',
                author: '未知',
                content: '该洞天暂未关联诗词。',
                connection_reason: '暂无关联说明'
            };
        }
    } else {
        console.error('当前没有选择洞天');
    }
    
    // 隐藏当前视图，显示洞天视图
    hideAllViews();
    if (views.cave) {
        views.cave.classList.add('active');
        console.log('洞天视图已激活');
    } else {
        console.error('未找到洞天视图元素');
    }
    
    // 更新洞天信息
    updateCaveDisplay();
    
    console.log('进入洞天界面完成');
}

/**
 * 更新洞天展示内容
 */
function updateCaveDisplay() {
    console.log('=== 洞天内容更新开始 ===');
    
    // 隐藏仙界地图和洞天体容器
    const immortalMapContainer = document.querySelector('.immortal-map-container');
    const cavesContainer = document.getElementById('caves-container');
    if (immortalMapContainer) {
        immortalMapContainer.style.display = 'none';
    }
    if (cavesContainer) {
        cavesContainer.style.display = 'none';
    }
    
    // 确保数据存在
    if (!gameData.currentCave) {
        console.error('错误：当前没有选择洞天');
        return;
    }
    
    // 确保诗词数据存在
    if (!gameData.currentPoem && gameData.currentCave.related_poems && gameData.currentCave.related_poems.length > 0) {
        gameData.currentPoem = gameData.currentCave.related_poems[0];
        console.log('设置默认诗词:', gameData.currentPoem.title);
    }
    
    // 如果仍然没有诗词，使用默认诗词
    if (!gameData.currentPoem) {
        console.warn('使用默认诗词');
        gameData.currentPoem = {
            title: '山居秋暝',
            author: '王维',
            content: '空山新雨后，天气晚来秋。明月松间照，清泉石上流。竹喧归浣女，莲动下渔舟。随意春芳歇，王孙自可留。',
            connection_reason: '这首诗描绘了山水之美，与当前洞天意境相符。'
        };
    }
    
    // 更新标题区域
    const caveNameEl = document.querySelector('.cave-name');
    const caveLocationEl = document.querySelector('.cave-location');
    if (caveNameEl) caveNameEl.textContent = gameData.currentCave.name || '未知洞天';
    if (caveLocationEl) caveLocationEl.textContent = gameData.currentCave.location || '未知位置';
    
    // 更新洞天简介
    const caveDescriptionEl = document.querySelector('.cave-description');
    if (caveDescriptionEl) caveDescriptionEl.textContent = gameData.currentCave.description || '暂无描述';
    
    // 更新诗词内容
    const poemTitleEl = document.getElementById('poem-title');
    const poemAuthorEl = document.getElementById('poem-author');
    const poemContentEl = document.getElementById('poem-content');
    const poemExplanationEl = document.getElementById('poem-explanation');
    
    if (poemTitleEl) poemTitleEl.textContent = gameData.currentPoem.title || '未知标题';
    if (poemAuthorEl) poemAuthorEl.textContent = `—— ${gameData.currentPoem.author || '未知作者'}`;
    if (poemContentEl) poemContentEl.innerHTML = formatPoemContent(gameData.currentPoem.content || '暂无内容');
    if (poemExplanationEl) poemExplanationEl.textContent = gameData.currentPoem.connection_reason || gameData.currentPoem.explanation || '暂无关联说明';
    
    // 初始化高德地图
    initCaveMap();
    
    // 绑定下一首按钮事件
    const nextPoemButton = document.getElementById('next-poem');
    if (nextPoemButton) {
        // 移除可能存在的旧事件监听器
        nextPoemButton.onclick = null;
        // 添加新的事件监听器
        nextPoemButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('下一首按钮被点击');
            switchToNextPoem();
        });
    }
    
    console.log('=== 洞天内容更新完成 ===');
}

/**
 * 初始化洞天地图（使用高德地图）
 */
function initCaveMap() {
    const mapContainer = document.getElementById('cave-map-container');
    if (!mapContainer || !gameData.currentCave) return;
    
    // 清空地图容器
    mapContainer.innerHTML = '';
    
    const location = gameData.currentCave.location || gameData.currentCave.name || '仙境';
    console.log(`正在为地点: ${location} 加载高德地图`);
    
    // 创建地图iframe，使用高德地图URL
    const mapIframe = document.createElement('iframe');
    const baseMapUrl = 'https://uri.amap.com/marker';
    const encodedLocation = encodeURIComponent(location);
    
    // 优先使用经纬度坐标（如果有）
    let mapUrl = '';
    if (gameData.currentCave.latitude && gameData.currentCave.longitude) {
        const position = `${gameData.currentCave.longitude},${gameData.currentCave.latitude}`;
        mapUrl = `${baseMapUrl}?position=${position}&name=${encodedLocation}&coordinate=gcj02&zoom=13`;
        console.log('使用经纬度坐标加载地图:', position);
    } else {
        mapUrl = `${baseMapUrl}?position=&name=${encodedLocation}&coordinate=gcj02&zoom=13`;
        console.log('使用地点名称加载地图');
    }
    
    mapIframe.src = mapUrl;
    mapIframe.style.width = '100%';
    mapIframe.style.height = '100%';
    mapIframe.style.border = 'none';
    mapIframe.setAttribute('loading', 'lazy');
    
    mapContainer.appendChild(mapIframe);
}

/**
 * 切换到下一首相关诗词
 */
function switchToNextPoem() {
    if (!gameData.currentCave || !gameData.currentCave.related_poems || gameData.currentCave.related_poems.length <= 1) {
        console.log('没有更多相关诗词');
        return;
    }
    
    // 找到当前诗词在数组中的索引
    let currentIndex = -1;
    for (let i = 0; i < gameData.currentCave.related_poems.length; i++) {
        if (gameData.currentCave.related_poems[i].id === gameData.currentPoem.id) {
            currentIndex = i;
            break;
        }
    }
    
    // 计算下一首诗词的索引
    const nextIndex = (currentIndex + 1) % gameData.currentCave.related_poems.length;
    gameData.currentPoem = gameData.currentCave.related_poems[nextIndex];
    
    console.log('切换到下一首诗词:', gameData.currentPoem.title);
    
    // 更新诗词显示
    updatePoemDisplay();
}

/**
 * 更新诗词显示
 */
function updatePoemDisplay() {
    const poemTitleEl = document.getElementById('poem-title');
    const poemAuthorEl = document.getElementById('poem-author');
    const poemContentEl = document.getElementById('poem-content');
    const poemExplanationEl = document.getElementById('poem-explanation');
    
    if (poemTitleEl) poemTitleEl.textContent = gameData.currentPoem.title || '未知标题';
    if (poemAuthorEl) poemAuthorEl.textContent = `—— ${gameData.currentPoem.author || '未知作者'}`;
    if (poemContentEl) poemContentEl.innerHTML = formatPoemContent(gameData.currentPoem.content || '暂无内容');
    if (poemExplanationEl) poemExplanationEl.textContent = gameData.currentPoem.connection_reason || gameData.currentPoem.explanation || '暂无关联说明';
    
    // 添加淡入动画效果
    [poemTitleEl, poemAuthorEl, poemContentEl, poemExplanationEl].forEach(el => {
        if (el) {
            el.style.opacity = '0';
            setTimeout(() => {
                el.style.transition = 'opacity 0.5s ease';
                el.style.opacity = '1';
            }, 10);
        }
    });
}

/**
 * 格式化诗词内容，优化排版显示
 * @param {string} content - 诗词内容
 * @returns {string} 格式化后的HTML字符串
 */
function formatPoemContent(content) {
    if (!content) return '暂无内容';
    
    // 先按行分割
    let lines = content.split('\n').filter(line => line.trim().length > 0);
    
    // 如果没有换行，尝试按标点符号分割（针对古诗排版）
    if (lines.length === 1) {
        const result = [];
        let currentLine = '';
        let charCount = 0;
        
        // 遍历每个字符，智能换行
        for (let i = 0; i < content.length; i++) {
            const char = content[i];
            
            // 跳过连续的空白字符
            if (char === ' ' && content[i-1] === ' ') continue;
            
            currentLine += char;
            charCount++;
            
            // 在标点符号处换行
            if (['，', '。', '！', '？', '；', '：'].includes(char)) {
                result.push(currentLine);
                currentLine = '';
                charCount = 0;
            } 
            // 对于长句，每10个字符换行
            else if (charCount >= 10 && !['，', '。', '！', '？', '；', '：'].includes(content[i+1])) {
                result.push(currentLine + '\n');
                currentLine = '';
                charCount = 0;
            }
        }
        
        // 处理剩余内容
        if (currentLine.trim()) {
            result.push(currentLine);
        }
        
        lines = result;
    }
    
    // 为每一行添加样式，创建优美的排版
    return lines.map(line => {
        // 为诗句添加渐入动画效果
        return `<p style="margin: 8px 0; opacity: 0; animation: fadeInUp 0.8s ease-out forwards; animation-delay: ${Math.random() * 0.5}s;">${line}</p>`;
    }).join('');
}

/**
 * 切换到下一首相关诗词
 */
/**
 * 格式化诗词内容，优化排版显示
 * @param {string} content - 诗词内容
 * @returns {string} 格式化后的HTML字符串
 */
function formatPoemContent(content) {
    if (!content) return '暂无内容';
    
    // 先按行分割
    let lines = content.split('\n').filter(line => line.trim().length > 0);
    
    // 如果没有换行，则尝试按标点符号分割
    if (lines.length <= 1) {
        // 对于五言或七言绝句等格式，尝试智能分行
        let result = [];
        let currentLine = '';
        let charCount = 0;
        
        // 遍历每个字符
        for (let i = 0; i < content.length; i++) {
            const char = content[i];
            currentLine += char;
            charCount++;
            
            // 中文标点符号作为分句符
            if (['，', '。', '！', '？', '；', '：'].includes(char)) {
                result.push(currentLine);
                currentLine = '';
                charCount = 0;
            } 
            // 对于长句，每10个字符换行
            else if (charCount >= 10 && !['，', '。', '！', '？', '；', '：'].includes(content[i+1])) {
                result.push(currentLine + '\n');
                currentLine = '';
                charCount = 0;
            }
        }
        
        // 处理剩余内容
        if (currentLine.trim()) {
            result.push(currentLine);
        }
        
        lines = result;
    }
    
    // 为每一行添加样式，创建优美的排版
    return lines.map(line => {
        // 为诗句添加渐入动画效果
        return `<p style="margin: 8px 0; opacity: 0; animation: fadeInUp 0.8s ease-out forwards; animation-delay: ${Math.random() * 0.5}s;">${line}</p>`;
    }).join('');
}

function switchToNextPoem() {
    console.log('=== 开始切换到下一首相关诗词 ===');
    
    // 添加淡出动画
    const poemContainer = document.getElementById('poem-container') || document.querySelector('.related-poem');
    if (poemContainer) {
        poemContainer.style.opacity = '0';
        poemContainer.style.transition = 'opacity 0.5s ease-out';
        
        // 添加加载指示器
        const loadingIndicator = document.createElement('div');
        loadingIndicator.id = 'poem-loading';
        loadingIndicator.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #64ffda;
            font-size: 1.2rem;
            z-index: 1000;
        `;
        loadingIndicator.innerHTML = `
            <div style="
                width: 24px;
                height: 24px;
                border: 3px solid rgba(100, 255, 218, 0.3);
                border-radius: 50%;
                border-top-color: #64ffda;
                animation: spin 1s ease-in-out infinite;
                margin-right: 10px;
            "></div>
            寻找诗词中...
        `;
        
        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
        
        // 设置容器为相对定位
        poemContainer.style.position = 'relative';
        poemContainer.appendChild(loadingIndicator);
    }
    
    // 验证当前洞天
    if (!gameData.currentCave) {
        console.error('错误：当前没有选择洞天');
        alert('当前没有选择洞天，无法切换诗词');
        return;
    }
    
    // 获取当前洞天的所有相关诗词
    let relatedPoems = [];
    
    // 从洞天对象中获取related_poems数组
    if (gameData.currentCave.related_poems && Array.isArray(gameData.currentCave.related_poems)) {
        relatedPoems = gameData.currentCave.related_poems.filter(poem => poem); // 过滤掉null/undefined项
        console.log('从洞天获取相关诗词数量:', relatedPoems.length);
    }
    
    // 如果洞天没有相关诗词，尝试从所有诗词中查找与当前洞天相关的
    if (relatedPoems.length === 0 && gameData.poems && Array.isArray(gameData.poems)) {
        relatedPoems = gameData.poems.filter(poem => 
            poem && poem.cave_id === gameData.currentCave.id || 
            poem && poem.cave_name === gameData.currentCave.name
        );
        console.log('从所有诗词中过滤相关诗词数量:', relatedPoems.length);
    }
    
    // 添加默认诗词作为备选
    const defaultPoems = [
        {title: '登鹳雀楼', author: '王之涣', content: '白日依山尽，黄河入海流。欲穷千里目，更上一层楼。', connection_reason: '这首诗意境开阔，与仙境氛围相符。'},
        {title: '望庐山瀑布', author: '李白', content: '日照香炉生紫烟，遥看瀑布挂前川。飞流直下三千尺，疑是银河落九天。', connection_reason: '这首诗描绘了壮观的自然景象，令人联想到仙境。'},
        {title: '饮湖上初晴后雨', author: '苏轼', content: '水光潋滟晴方好，山色空蒙雨亦奇。欲把西湖比西子，淡妆浓抹总相宜。', connection_reason: '这首诗展现了湖光山色之美，与洞天意境相通。'}
    ];
    
    // 如果相关诗词较少，补充默认诗词
    if (relatedPoems.length < 2) {
        relatedPoems = [...relatedPoems, ...defaultPoems];
        console.log('补充默认诗词后数量:', relatedPoems.length);
    }
    
    console.log('最终找到的相关诗词:', relatedPoems.length, '首');
    
    // 获取当前诗词在相关诗词数组中的索引
    let currentPoemIndex = -1;
    if (gameData.currentPoem) {
        currentPoemIndex = relatedPoems.findIndex(poem => 
            (poem.title === gameData.currentPoem.title && poem.author === gameData.currentPoem.author) ||
            poem.id === gameData.currentPoem.id
        );
    }
    
    console.log('当前诗词索引:', currentPoemIndex);
    
    // 随机选择一首不同的诗词
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * relatedPoems.length);
    } while (relatedPoems.length > 1 && newIndex === currentPoemIndex);
    
    // 设置新诗词
    gameData.currentPoem = relatedPoems[newIndex];
    console.log('成功选择新诗词:', gameData.currentPoem.title);
    
    // 延迟更新显示，等淡出动画完成
    setTimeout(() => {
        // 移除加载指示器
        const loadingIndicator = document.getElementById('poem-loading');
        if (loadingIndicator && loadingIndicator.parentNode) {
            loadingIndicator.parentNode.removeChild(loadingIndicator);
        }
        
        // 更新显示
        updateCaveDisplay();
        
        // 添加淡入动画
        setTimeout(() => {
            const poemContainer = document.getElementById('poem-container') || document.querySelector('.related-poem');
            if (poemContainer) {
                poemContainer.style.opacity = '1';
                poemContainer.style.transition = 'opacity 0.5s ease-in';
            }
        }, 50); // 短暂延迟确保DOM已更新
        
        console.log('=== 诗词切换完成 ===');
    }, 500); // 等待淡出动画完成
    
    return true; // 返回成功
}

/**
 * 初始化下一首按钮事件
 */
function setupNextPoemButton() {
    // 尝试多种选择器查找下一首按钮
    let nextPoemButton = document.getElementById('next-poem');
    if (!nextPoemButton) nextPoemButton = document.querySelector('.next-poem-button');
    if (!nextPoemButton) nextPoemButton = document.querySelector('[data-action="next-poem"]');
    
    if (nextPoemButton) {
        // 移除旧的事件监听器，避免重复绑定
        nextPoemButton.removeEventListener('click', switchToNextPoem);
        nextPoemButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('下一首按钮被点击');
            switchToNextPoem();
        });
        console.log('下一首按钮事件已绑定');
    } else {
        console.warn('未找到下一首按钮，将在洞天详情页面创建');
    }
}

/**
 * 初始化天气切换按钮
 */
function setupWeatherButtons() {
    // 创建天气切换按钮容器
    const weatherSection = document.querySelector('.weather-section');
    if (weatherSection) {
        // 检查是否已有按钮容器
        let buttonsContainer = weatherSection.querySelector('.weather-buttons');
        if (!buttonsContainer) {
            buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'weather-buttons';
            buttonsContainer.style.display = 'flex';
            buttonsContainer.style.justifyContent = 'center';
            buttonsContainer.style.marginTop = '15px';
            
            // 创建三天的按钮
            const days = ['today', 'tomorrow', 'dayafter'];
            const dayLabels = ['今天', '明天', '后天'];
            
            days.forEach((day, index) => {
                const button = document.createElement('button');
                button.className = 'weather-button';
                button.setAttribute('data-day', day);
                button.textContent = dayLabels[index];
                button.style.padding = '8px 16px';
                button.style.margin = '0 5px';
                button.style.border = 'none';
                button.style.borderRadius = '4px';
                button.style.backgroundColor = day === 'today' ? '#64ffda' : 'rgba(100, 255, 218, 0.3)';
                button.style.color = day === 'today' ? '#0a192f' : '#64ffda';
                button.style.cursor = 'pointer';
                button.style.transition = 'all 0.3s ease';
                
                // 添加点击事件
                button.addEventListener('click', function() {
                    // 更新所有按钮样式
                    document.querySelectorAll('.weather-button').forEach(btn => {
                        btn.style.backgroundColor = 'rgba(100, 255, 218, 0.3)';
                        btn.style.color = '#64ffda';
                    });
                    
                    // 更新当前按钮样式
                    this.style.backgroundColor = '#64ffda';
                    this.style.color = '#0a192f';
                    
                    // 更新天气显示
                    updateWeatherDisplay(day);
                });
                
                buttonsContainer.appendChild(button);
            });
            
            weatherSection.appendChild(buttonsContainer);
        }
    }
}

/**
 * 加载天气数据
 */
async function loadWeatherData(location) {
    console.log(`加载${location}的天气数据`);
    
    try {
        // 使用和风天气API（示例，需要替换为实际可用的API）
        // 由于跨域限制，这里先使用模拟数据
        // 实际项目中可以使用后端代理或支持跨域的天气API
        
        // 模拟获取位置的经纬度（实际应用中可以通过地理编码API获取）
        const weatherData = {
            today: {
                icon: '☀️',
                description: '晴',
                temperature: Math.floor(Math.random() * 15) + 15 + '°C'
            },
            tomorrow: {
                icon: ['☀️', '🌤️', '☁️', '🌦️'][Math.floor(Math.random() * 4)],
                description: ['晴', '多云', '阴', '小雨'][Math.floor(Math.random() * 4)],
                temperature: Math.floor(Math.random() * 15) + 15 + '°C'
            },
            dayafter: {
                icon: ['☀️', '🌤️', '☁️', '🌦️', '🌧️'][Math.floor(Math.random() * 5)],
                description: ['晴', '多云', '阴', '小雨', '中雨'][Math.floor(Math.random() * 5)],
                temperature: Math.floor(Math.random() * 15) + 15 + '°C'
            }
        };
        
        // 存储天气数据到gameData中
        gameData.weatherData = weatherData;
        
        // 更新今天的天气显示
        updateWeatherDisplay('today');
        
        console.log('天气数据加载完成');
    } catch (error) {
        console.error('加载天气数据失败:', error);
        // 使用默认天气数据
        updateWeatherDisplay('today');
    }
}

/**
 * 更新天气显示
 */
function updateWeatherDisplay(day) {
    console.log(`更新${day}的天气显示`);
    
    // 从gameData获取天气数据，如果没有则使用默认数据
    const weatherData = gameData.weatherData || {
        today: {
            icon: '☀️',
            description: '晴',
            temperature: '22°C'
        },
        tomorrow: {
            icon: '🌤️',
            description: '多云',
            temperature: '20°C'
        },
        dayafter: {
            icon: '🌦️',
            description: '小雨',
            temperature: '18°C'
        }
    };
    
    const weather = weatherData[day] || weatherData.today;
    
    // 查找或创建天气信息容器
    let weatherSection = document.querySelector('.weather-section');
    const mapContainer = document.querySelector('.cave-map-container');
    
    // 如果没有找到天气容器，创建一个
    if (!weatherSection && mapContainer) {
        weatherSection = document.createElement('div');
        weatherSection.className = 'weather-section';
        weatherSection.style.display = 'block';
        weatherSection.style.textAlign = 'center';
        weatherSection.style.marginTop = '15px';
        weatherSection.style.padding = '15px';
        weatherSection.style.background = 'rgba(100, 255, 218, 0.1)';
        weatherSection.style.borderRadius = '8px';
        
        // 在地图容器后插入天气信息
        mapContainer.parentNode.insertBefore(weatherSection, mapContainer.nextSibling);
        console.log('已创建天气信息容器');
    }
    
    // 确保天气信息容器存在
    if (weatherSection) {
        // 创建或更新天气内容
        let weatherContent = document.querySelector('.weather-content');
        if (!weatherContent) {
            weatherContent = document.createElement('div');
            weatherContent.className = 'weather-content';
            weatherContent.style.display = 'flex';
            weatherContent.style.justifyContent = 'center';
            weatherContent.style.alignItems = 'center';
            weatherContent.style.gap = '20px';
            weatherContent.style.marginBottom = '10px';
            weatherSection.appendChild(weatherContent);
        }
        
        // 更新天气内容
        weatherContent.innerHTML = `
            <div class="weather-icon" style="font-size: 3rem;">${weather.icon}</div>
            <div class="weather-info">
                <div class="weather-temp" style="font-size: 1.8rem; font-weight: bold; color: #64ffda;">${weather.temperature}</div>
                <div class="weather-desc" style="font-size: 1.2rem; color: #c5c6c7;">${weather.description}</div>
            </div>
        `;
        
        // 确保天气切换按钮存在
        setupWeatherButtons();
        
        // 高亮当前选中的日期按钮
        const weatherButtons = document.querySelectorAll('.weather-button');
        weatherButtons.forEach(button => {
            if (button.getAttribute('data-day') === day) {
                button.style.backgroundColor = '#64ffda';
                button.style.color = '#0a192f';
            } else {
                button.style.backgroundColor = 'rgba(100, 255, 218, 0.3)';
                button.style.color = '#64ffda';
            }
        });
    }
    
    console.log('天气显示更新完成');
}

/**
 * 显示罗盘视图
 */
function showCompassView() {
    hideAllViews();
    // 注意：在views对象中，compass属性实际上指向的是compass-view元素
    if (views.compass) {
        views.compass.classList.add('active');
        console.log('已激活compass-view视图');
    }
}

/**
 * 隐藏所有视图
 */
function hideAllViews() {
    Object.values(views).forEach(view => {
        view.classList.remove('active');
    });
}

// 重置游戏状态
function resetGameState() {
    console.log('开始重置游戏状态...');
    
    // 完全重置游戏数据
    gameData.currentCave = null;
    gameData.currentPoem = null;
    currentDisplayedCaves = [];
    
    // 清除定时器
    if (caveRotationTimer) {
        clearInterval(caveRotationTimer);
        caveRotationTimer = null;
    }
    
    // 隐藏所有视图，然后显示罗盘视图
    hideAllViews();
    showCompassView();
    
    // 简单清理洞天体内容，而不是移除整个容器
    const cavesContainer = document.getElementById('caves-container');
    if (cavesContainer) {
        cavesContainer.innerHTML = '';
        console.log('已清理洞天体内容');
    }
    
    // 确保仙界任意门按钮可用
    const fairyDoorBtn = document.getElementById('start-map');
    if (fairyDoorBtn) {
        fairyDoorBtn.disabled = false;
        fairyDoorBtn.textContent = '仙界任意门';
        console.log('已重置仙界任意门按钮状态');
    }
    
    // 立即重新初始化地图，不需要延迟
    console.log('重新初始化仙界地图...');
    initializeImmortalMap();
    
    // 重新设置事件监听器
    console.log('重新设置事件监听器...');
    setupEventListeners();
}

// 清理函数 - 清理定时器等资源
function cleanup() {
    // 清理定时器
    if (caveRotationTimer) {
        clearInterval(caveRotationTimer);
        caveRotationTimer = null;
    }
}
