// 家庭称呼学习游戏 - 交互脚本

// DOM元素引用
const sections = document.querySelectorAll('.game-section');
const menuButtons = {
    familyTree: document.getElementById('family-tree-btn'),
    quiz: document.getElementById('quiz-btn'),
    glossary: document.getElementById('glossary-btn'),
    achievements: document.getElementById('achievements-btn')
};
const backButtons = document.querySelectorAll('.back-btn');
const characterModal = document.getElementById('character-modal');
const closeModalBtn = document.querySelector('.close-modal-btn');

// 导航功能
function showSection(sectionId) {
    // 隐藏所有部分
    sections.forEach(section => section.classList.remove('active'));
    
    // 显示指定部分
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

// 返回主菜单
function goToMainMenu() {
    sections.forEach(section => section.classList.remove('active'));
    characterModal.classList.remove('active');
}

// 菜单按钮事件监听
menuButtons.familyTree.addEventListener('click', () => showSection('family-tree'));
menuButtons.quiz.addEventListener('click', () => showSection('quiz'));
menuButtons.glossary.addEventListener('click', () => showSection('glossary'));
menuButtons.achievements.addEventListener('click', () => showSection('achievements'));

// 返回按钮事件监听
backButtons.forEach(button => {
    button.addEventListener('click', goToMainMenu);
});

// 家族树功能实现
function initFamilyTree() {
    const treeNodes = document.querySelectorAll('.tree-node');
    const memberCards = document.querySelectorAll('.member-card');
    
    // 角色信息弹窗
    treeNodes.forEach(node => {
        node.addEventListener('click', () => {
            const role = node.dataset.role;
            const name = node.textContent;
            
            // 设置弹窗内容
            document.querySelector('.character-name').textContent = name;
            
            // 根据角色设置关系描述
            let relation = '';
            switch(role) {
                case 'father':
                    relation = '我的爸爸';
                    break;
                case 'mother':
                    relation = '我的妈妈';
                    break;
                case 'grandpa_paternal':
                    relation = '爸爸的爸爸';
                    break;
                case 'grandma_paternal':
                    relation = '爸爸的妈妈';
                    break;
                case 'grandpa_maternal':
                    relation = '妈妈的爸爸';
                    break;
                case 'grandma_maternal':
                    relation = '妈妈的妈妈';
                    break;
                case 'uncle_paternal':
                    relation = '爸爸的弟弟';
                    break;
                case 'aunt_paternal':
                    relation = '爸爸的妹妹';
                    break;
                case 'uncle_maternal':
                    relation = '妈妈的弟弟';
                    break;
                case 'aunt_maternal':
                    relation = '妈妈的妹妹';
                    break;
                default:
                    relation = '';
            }
            
            document.querySelector('.character-relation').textContent = relation;
            document.querySelector('.character-nickname').value = '';
            
            // 显示弹窗
            characterModal.classList.add('active');
        });
    });
    
    // 关闭弹窗
    closeModalBtn.addEventListener('click', () => {
        characterModal.classList.remove('active');
        
        // 可以在这里保存昵称等信息
        const nickname = document.querySelector('.character-nickname').value;
        if (nickname) {
            console.log(`保存昵称: ${nickname}`);
        }
    });
    
    // 拖拽功能实现
    let draggedItem = null;
    
    memberCards.forEach(card => {
        card.addEventListener('dragstart', function() {
            draggedItem = this;
            setTimeout(() => this.style.opacity = '0.5', 0);
        });
        
        card.addEventListener('dragend', function() {
            setTimeout(() => this.style.opacity = '1', 0);
            draggedItem = null;
        });
    });
    
    treeNodes.forEach(node => {
        node.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        node.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        node.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            if (draggedItem) {
                const draggedRole = draggedItem.dataset.role;
                const nodeRole = this.dataset.role;
                
                // 检查是否匹配
                if (draggedRole === nodeRole) {
                    // 显示成功动画或提示
                    this.style.backgroundColor = '#4caf50';
                    setTimeout(() => {
                        this.style.backgroundColor = '';
                    }, 500);
                    
                    console.log(`成功放置 ${draggedItem.textContent} 到 ${this.textContent}`);
                    
                    // 可以在这里记录完成的匹配
                } else {
                    // 显示错误提示
                    this.style.backgroundColor = '#f44336';
                    setTimeout(() => {
                        this.style.backgroundColor = '';
                    }, 500);
                }
            }
        });
    });
}

// 测验功能实现
function initQuiz() {
    const quizQuestions = [
        {
            question: '今天去奶奶家，看到一个和你爸爸年纪相仿的叔叔，他会是你爸爸的弟弟，你应该怎么称呼他？',
            options: ['A. 叔叔', 'B. 伯伯', 'C. 舅舅'],
            correctAnswer: 'A'
        },
        {
            question: '妈妈带你去见她的妹妹，她应该是你的...?',
            options: ['A. 姑姑', 'B. 舅妈', 'C. 姨姨'],
            correctAnswer: 'C'
        },
        {
            question: '爸爸的爸爸，你应该怎么称呼他？',
            options: ['A. 外公', 'B. 爷爷', 'C. 叔叔'],
            correctAnswer: 'B'
        },
        {
            question: '妈妈的妈妈，你应该怎么称呼她？',
            options: ['A. 奶奶', 'B. 外婆', 'C. 姑姑'],
            correctAnswer: 'B'
        },
        {
            question: '叔叔的儿子，如果比你大，你应该称呼他为...?',
            options: ['A. 表弟', 'B. 表哥', 'C. 堂哥'],
            correctAnswer: 'C'
        }
    ];
    
    let currentQuestionIndex = 0;
    let score = 0;
    
    const quizQuestionEl = document.querySelector('.quiz-question p');
    const quizOptionsEl = document.querySelector('.quiz-options');
    const quizFeedbackEl = document.querySelector('.quiz-feedback');
    const nextBtn = document.querySelector('.next-btn');
    const progressFillEl = document.querySelector('.progress-fill');
    const progressTextEl = document.querySelector('.progress-text');
    
    // 加载问题
    function loadQuestion(index) {
        const question = quizQuestions[index];
        quizQuestionEl.textContent = question.question;
        
        // 清空选项并添加新选项
        quizOptionsEl.innerHTML = '';
        question.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'quiz-option';
            button.dataset.answer = option.charAt(0);
            button.textContent = option;
            button.addEventListener('click', handleOptionClick);
            quizOptionsEl.appendChild(button);
        });
        
        // 更新进度
        progressFillEl.style.width = `${((index + 1) / quizQuestions.length) * 100}%`;
        progressTextEl.textContent = `问题 ${index + 1}/${quizQuestions.length}`;
        
        // 重置状态
        quizFeedbackEl.className = 'quiz-feedback';
        quizFeedbackEl.textContent = '';
        nextBtn.disabled = true;
    }
    
    // 处理选项点击
    function handleOptionClick(e) {
        const selectedOption = e.target;
        const selectedAnswer = selectedOption.dataset.answer;
        const correctAnswer = quizQuestions[currentQuestionIndex].correctAnswer;
        
        // 禁用所有选项
        const allOptions = document.querySelectorAll('.quiz-option');
        allOptions.forEach(option => {
            option.disabled = true;
            
            // 标记正确和错误选项
            if (option.dataset.answer === correctAnswer) {
                option.classList.add('correct');
            } else if (option === selectedOption && selectedAnswer !== correctAnswer) {
                option.classList.add('incorrect');
            }
        });
        
        // 显示反馈
        if (selectedAnswer === correctAnswer) {
            quizFeedbackEl.classList.add('correct');
            quizFeedbackEl.textContent = '太棒了！回答正确！';
            score++;
        } else {
            quizFeedbackEl.classList.add('incorrect');
            quizFeedbackEl.textContent = `回答错误，正确答案是：${correctAnswer}`;
        }
        
        // 启用下一题按钮
        nextBtn.disabled = false;
    }
    
    // 下一题
    nextBtn.addEventListener('click', () => {
        currentQuestionIndex++;
        
        if (currentQuestionIndex < quizQuestions.length) {
            loadQuestion(currentQuestionIndex);
        } else {
            // 显示结果
            showQuizResult();
        }
    });
    
    // 显示测验结果
    function showQuizResult() {
        const quizContainer = document.querySelector('.quiz-container');
        quizContainer.innerHTML = `
            <div class="quiz-result">
                <h2>测验完成！</h2>
                <p class="result-score">你的得分：${score}/${quizQuestions.length}</p>
                <div class="result-message">
                    ${score === quizQuestions.length ? '太厉害了！你是称呼小专家！' : 
                      score >= quizQuestions.length / 2 ? '不错！继续努力！' : '加油！多练习就能记住更多称呼！'}
                </div>
                <button class="restart-quiz-btn">再玩一次</button>
            </div>
        `;
        
        document.querySelector('.restart-quiz-btn').addEventListener('click', () => {
            currentQuestionIndex = 0;
            score = 0;
            quizContainer.innerHTML = `
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <span class="progress-text">问题 1/5</span>
                </div>
                <div class="quiz-question">
                    <p></p>
                </div>
                <div class="quiz-options">
                </div>
                <div class="quiz-feedback">
                </div>
                <button class="next-btn">下一题</button>
            `;
            
            // 重新获取元素引用
            quizQuestionEl = document.querySelector('.quiz-question p');
            quizOptionsEl = document.querySelector('.quiz-options');
            quizFeedbackEl = document.querySelector('.quiz-feedback');
            nextBtn = document.querySelector('.next-btn');
            progressFillEl = document.querySelector('.progress-fill');
            progressTextEl = document.querySelector('.progress-text');
            
            // 重新绑定事件
            nextBtn.addEventListener('click', () => {
                currentQuestionIndex++;
                
                if (currentQuestionIndex < quizQuestions.length) {
                    loadQuestion(currentQuestionIndex);
                } else {
                    showQuizResult();
                }
            });
            
            loadQuestion(currentQuestionIndex);
        });
    }
    
    // 初始化第一个问题
    loadQuestion(currentQuestionIndex);
}

// 词典功能实现
function initGlossary() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const pronounceBtns = document.querySelectorAll('.pronounce-btn');
    
    // 标签切换
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            // 移除所有活动状态
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 添加当前活动状态
            btn.classList.add('active');
            document.getElementById(`${tab}-content`).classList.add('active');
        });
    });
    
    // 预加载妈妈这边的内容
    const maternalContent = document.getElementById('maternal-content');
    maternalContent.innerHTML = `
        <div class="glossary-item">
            <div class="term-header">
                <h3>外公</h3>
                <button class="pronounce-btn">🔊</button>
            </div>
            <p class="term-description">妈妈的爸爸</p>
            <div class="term-image"></div>
        </div>
        <div class="glossary-item">
            <div class="term-header">
                <h3>外婆</h3>
                <button class="pronounce-btn">🔊</button>
            </div>
            <p class="term-description">妈妈的妈妈</p>
            <div class="term-image"></div>
        </div>
        <div class="glossary-item">
            <div class="term-header">
                <h3>舅舅</h3>
                <button class="pronounce-btn">🔊</button>
            </div>
            <p class="term-description">妈妈的弟弟</p>
            <div class="term-image"></div>
        </div>
        <div class="glossary-item">
            <div class="term-header">
                <h3>姨姨</h3>
                <button class="pronounce-btn">🔊</button>
            </div>
            <p class="term-description">妈妈的妹妹</p>
            <div class="term-image"></div>
        </div>
    `;
    
    // 预加载平辈的内容
    const peerContent = document.getElementById('peer-content');
    peerContent.innerHTML = `
        <div class="glossary-item">
            <div class="term-header">
                <h3>哥哥</h3>
                <button class="pronounce-btn">🔊</button>
            </div>
            <p class="term-description">比我大的兄弟</p>
            <div class="term-image"></div>
        </div>
        <div class="glossary-item">
            <div class="term-header">
                <h3>弟弟</h3>
                <button class="pronounce-btn">🔊</button>
            </div>
            <p class="term-description">比我小的兄弟</p>
            <div class="term-image"></div>
        </div>
        <div class="glossary-item">
            <div class="term-header">
                <h3>姐姐</h3>
                <button class="pronounce-btn">🔊</button>
            </div>
            <p class="term-description">比我大的姐妹</p>
            <div class="term-image"></div>
        </div>
        <div class="glossary-item">
            <div class="term-header">
                <h3>妹妹</h3>
                <button class="pronounce-btn">🔊</button>
            </div>
            <p class="term-description">比我小的姐妹</p>
            <div class="term-image"></div>
        </div>
        <div class="glossary-item">
            <div class="term-header">
                <h3>堂哥/堂弟</h3>
                <button class="pronounce-btn">🔊</button>
            </div>
            <p class="term-description">叔叔或姑姑的儿子</p>
            <div class="term-image"></div>
        </div>
        <div class="glossary-item">
            <div class="term-header">
                <h3>堂姐/堂妹</h3>
                <button class="pronounce-btn">🔊</button>
            </div>
            <p class="term-description">叔叔或姑姑的女儿</p>
            <div class="term-image"></div>
        </div>
        <div class="glossary-item">
            <div class="term-header">
                <h3>表哥/表弟</h3>
                <button class="pronounce-btn">🔊</button>
            </div>
            <p class="term-description">舅舅或姨姨的儿子</p>
            <div class="term-image"></div>
        </div>
        <div class="glossary-item">
            <div class="term-header">
                <h3>表姐/表妹</h3>
                <button class="pronounce-btn">🔊</button>
            </div>
            <p class="term-description">舅舅或姨姨的女儿</p>
            <div class="term-image"></div>
        </div>
    `;
    
    // 发音功能
    function setupPronounceButtons() {
        const buttons = document.querySelectorAll('.pronounce-btn');
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                const term = this.parentElement.querySelector('h3').textContent;
                speakText(term);
            });
        });
    }
    
    // 文字转语音
    function speakText(text) {
        if ('speechSynthesis' in window) {
            // 创建一个新的 SpeechSynthesisUtterance 对象
            const utterance = new SpeechSynthesisUtterance(text);
            
            // 设置语音为中文
            utterance.lang = 'zh-CN';
            
            // 设置语速
            utterance.rate = 0.9;
            
            // 播放语音
            window.speechSynthesis.speak(utterance);
        } else {
            console.log('浏览器不支持语音合成');
        }
    }
    
    // 初始设置发音按钮
    setupPronounceButtons();
    
    // 当标签切换后重新设置发音按钮
    tabBtns.forEach(btn => {
        btn.addEventListener('click', setupPronounceButtons);
    });
}

// 成就系统初始化
function initAchievements() {
    // 这里可以添加成就解锁逻辑
    // 例如检查本地存储中的成就数据
    const achievements = getAchievements();
    
    // 更新成就显示
    updateAchievementDisplay(achievements);
}

// 获取成就数据
function getAchievements() {
    // 从本地存储获取成就数据，如果没有则返回默认数据
    const storedAchievements = localStorage.getItem('familyGameAchievements');
    if (storedAchievements) {
        return JSON.parse(storedAchievements);
    }
    
    // 默认成就数据
    return {
        beginner: false,
        teacher: false,
        master: false
    };
}

// 保存成就数据
function saveAchievements(achievements) {
    localStorage.setItem('familyGameAchievements', JSON.stringify(achievements));
}

// 更新成就显示
function updateAchievementDisplay(achievements) {
    // 这里可以根据成就数据更新UI
    if (achievements.beginner) {
        document.querySelector('.achievement-card:first-child').classList.add('unlocked');
    }
    
    if (achievements.teacher) {
        document.querySelector('.achievement-card:nth-child(2)').classList.add('unlocked');
    }
    
    if (achievements.master) {
        document.querySelector('.achievement-card:last-child').classList.add('unlocked');
    }
}

// 游戏初始化
function initGame() {
    // 初始化各个模块
    initFamilyTree();
    initQuiz();
    initGlossary();
    initAchievements();
    
    // 阻止页面刷新时的拖拽行为
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('drop', function(e) {
        e.preventDefault();
    });
}

// 当页面加载完成后初始化游戏
window.addEventListener('DOMContentLoaded', initGame);