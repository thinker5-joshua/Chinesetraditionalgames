// 中国传统文化益智游戏群落 - 交互脚本

// DOM 元素加载完成后执行
 document.addEventListener('DOMContentLoaded', function() {
    // 为游戏卡片添加点击效果和端口跳转功能
    const gameCards = document.querySelectorAll('.game-card:not(.coming-soon)');
    
    gameCards.forEach((card, index) => {
        // 移除HTML中的onclick属性，通过JavaScript统一管理
        card.removeAttribute('onclick');
        
        card.addEventListener('click', function() {
            // 添加点击动画效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // 根据游戏卡片索引跳转到对应的游戏页面
            if (index === 0) {
                // 第一个卡片：易经六十四卦学习游戏
                window.location.href = 'games/64Hexagrams/index.html';
            } else if (index === 1) {
                // 第二个卡片：成语消除游戏
                window.location.href = 'games/future/index.html';
            } else if (index === 2) {
                // 第三个卡片：二十八星宿探秘
                window.location.href = 'games/28Stars/index.html';
            } else if (index === 3) {
                // 第四个卡片：七十二洞天诗意旅行
                window.location.href = 'games/72DreamlandPoetryTravel/index.html';
            } else if (index === 4) {
                // 第五个卡片：家庭称呼学习游戏
                window.location.href = 'games/family/index.html';
            }
        });
    });
    
    // 为按钮添加独立的点击事件，防止冒泡
    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach((button, index) => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // 按钮点击也触发对应的游戏页面跳转
            if (index === 0) {
                window.location.href = 'games/64Hexagrams/index.html';
            } else if (index === 1) {
                window.location.href = 'games/future/index.html';
            } else if (index === 2) {
                window.location.href = 'games/28Stars/index.html';
            } else if (index === 3) {
                window.location.href = 'games/72DreamlandPoetryTravel/index.html';
            } else if (index === 4) {
                window.location.href = 'games/family/index.html';
            }
        });
    });
    
    // 添加页面加载动画
    const container = document.querySelector('.container');
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    container.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 100);
    
    // 响应式处理 - 可根据需要扩展
    function handleResize() {
        const windowWidth = window.innerWidth;
        // 这里可以添加根据窗口大小调整布局的逻辑
    }
    
    // 初始调用一次
    handleResize();
    
    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);
    
    // 预留功能 - 未来可以扩展更多交互特性
    // 例如：游戏搜索、分类筛选、用户成就系统等
});

// 预留接口 - 未来可能需要的功能
function loadGameCategories() {
    // 加载游戏分类
}

function searchGames(keyword) {
    // 搜索游戏功能
}

function trackGameUsage(gameId) {
    // 记录游戏使用情况
}