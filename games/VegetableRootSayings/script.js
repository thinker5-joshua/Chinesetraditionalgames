// 菜根潭摘录游戏 - JavaScript逻辑

class VegetableRootGame {
    constructor() {
        this.quotes = [];
        this.currentIndex = 0;
        this.isOriginalVisible = false;
        this.favorites = new Set();
        this.loadFavorites();
        this.init();
    }

    async init() {
        await this.loadQuotes();
        this.setupEventListeners();
        this.showRandomQuote();
        this.hideLoading();
    }

    async loadQuotes() {
        try {
            const response = await fetch('data.json');
            const data = await response.json();
            this.quotes = data.quotes;
        } catch (error) {
            console.error('加载名言数据失败:', error);
            this.showError('加载数据失败，请刷新页面重试');
        }
    }

    // 加载收藏列表
    loadFavorites() {
        try {
            const saved = localStorage.getItem('vegetableRootFavorites');
            if (saved) {
                this.favorites = new Set(JSON.parse(saved));
            }
        } catch (error) {
            console.error('加载收藏列表失败:', error);
        }
    }

    // 保存收藏列表
    saveFavorites() {
        try {
            localStorage.setItem('vegetableRootFavorites', JSON.stringify([...this.favorites]));
        } catch (error) {
            console.error('保存收藏列表失败:', error);
        }
    }

    setupEventListeners() {
        // 导航按钮
        document.getElementById('prevBtn').addEventListener('click', () => {
            this.showPreviousQuote();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.showNextQuote();
        });

        // 收藏按钮
        document.getElementById('favoriteBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite();
        });

        // 查看收藏按钮
        document.getElementById('favoritesListBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.showFavoritesList();
        });

        // 分享按钮
        document.getElementById('shareBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.shareQuote();
        });

        // 名言卡片点击事件
        document.getElementById('quoteCard').addEventListener('click', (e) => {
            if (!e.target.closest('.original-text') && !e.target.closest('.nav-btn') && !e.target.closest('.action-btn')) {
                this.toggleOriginalText();
            }
        });

        // 关闭原文按钮
        document.getElementById('closeBtn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.hideOriginalText();
        });

        // 键盘导航
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.showPreviousQuote();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.showNextQuote();
                    break;
                case 'Escape':
                    this.hideOriginalText();
                    break;
                case 'Enter':
                case ' ':
                    if (!this.isOriginalVisible) {
                        e.preventDefault();
                        this.toggleOriginalText();
                    }
                    break;
                case 'f':
                case 'F':
                    e.preventDefault();
                    this.toggleFavorite();
                    break;
            }
        });

        // 触摸滑动支持
        this.setupTouchEvents();
    }

    setupTouchEvents() {
        let touchStartX = 0;
        let touchEndX = 0;

        document.getElementById('quoteCard').addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        document.getElementById('quoteCard').addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        });
    }

    handleSwipe(startX, endX) {
        const minSwipeDistance = 50;
        const distance = startX - endX;

        if (Math.abs(distance) < minSwipeDistance) return;

        if (distance > 0) {
            // 向左滑动 - 下一句
            this.showNextQuote();
        } else {
            // 向右滑动 - 上一句
            this.showPreviousQuote();
        }
    }

    showRandomQuote() {
        if (this.quotes.length === 0) return;
        
        const randomIndex = Math.floor(Math.random() * this.quotes.length);
        this.currentIndex = randomIndex;
        this.displayQuote(randomIndex);
    }

    showNextQuote() {
        if (this.quotes.length === 0) return;
        
        this.currentIndex = (this.currentIndex + 1) % this.quotes.length;
        this.displayQuote(this.currentIndex);
        this.hideOriginalText();
    }

    showPreviousQuote() {
        if (this.quotes.length === 0) return;
        
        this.currentIndex = (this.currentIndex - 1 + this.quotes.length) % this.quotes.length;
        this.displayQuote(this.currentIndex);
        this.hideOriginalText();
    }

    displayQuote(index) {
        const quote = this.quotes[index];
        
        document.getElementById('quoteText').textContent = quote.quote;
        document.getElementById('quoteSource').textContent = quote.source;
        
        // 更新原文内容
        document.getElementById('originalContent').textContent = quote.fullText;
        
        // 更新收藏按钮状态
        this.updateFavoriteButton();
        
        // 添加动画效果
        this.animateQuoteChange();
    }

    animateQuoteChange() {
        const quoteCard = document.getElementById('quoteCard');
        quoteCard.style.opacity = '0';
        quoteCard.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            quoteCard.style.opacity = '1';
            quoteCard.style.transform = 'translateY(0)';
        }, 300);
    }

    toggleOriginalText() {
        if (this.isOriginalVisible) {
            this.hideOriginalText();
        } else {
            this.showOriginalText();
        }
    }

    showOriginalText() {
        const originalText = document.getElementById('originalText');
        originalText.style.display = 'block';
        this.isOriginalVisible = true;
        
        // 滚动到原文区域
        setTimeout(() => {
            originalText.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }

    hideOriginalText() {
        const originalText = document.getElementById('originalText');
        originalText.style.display = 'none';
        this.isOriginalVisible = false;
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.style.opacity = '0';
        
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 500);
    }

    showError(message) {
        const quoteText = document.getElementById('quoteText');
        quoteText.textContent = message;
        quoteText.style.color = '#e74c3c';
        
        const quoteSource = document.getElementById('quoteSource');
        quoteSource.textContent = '错误提示';
    }

    // 收藏功能
    toggleFavorite() {
        const quoteId = this.quotes[this.currentIndex].id;
        
        if (this.favorites.has(quoteId)) {
            this.favorites.delete(quoteId);
            this.showToast('已取消收藏');
        } else {
            this.favorites.add(quoteId);
            this.showToast('已添加到收藏');
        }
        
        this.saveFavorites();
        this.updateFavoriteButton();
    }

    // 更新收藏按钮状态
    updateFavoriteButton() {
        const favoriteBtn = document.getElementById('favoriteBtn');
        const quoteId = this.quotes[this.currentIndex].id;
        
        if (this.favorites.has(quoteId)) {
            favoriteBtn.classList.add('favorited');
            favoriteBtn.title = '取消收藏';
            favoriteBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            `;
        } else {
            favoriteBtn.classList.remove('favorited');
            favoriteBtn.title = '收藏';
            favoriteBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
            `;
        }
    }

    // 分享功能
    async shareQuote() {
        const quote = this.getCurrentQuote();
        const shareText = `${quote.quote} —— ${quote.source}`;
        
        try {
            if (navigator.share) {
                await navigator.share({
                    title: '菜根潭摘录 - Vegetable Root Sayings',
                    text: shareText,
                    url: window.location.href
                });
                this.showToast('分享成功');
            } else {
                // 复制到剪贴板 - 使用现代异步方法
                await this.copyToClipboard(shareText);
            }
        } catch (error) {
            console.error('分享失败:', error);
            
            // 备用方案
            try {
                await this.copyToClipboard(shareText);
            } catch (err) {
                console.error('复制失败:', err);
                this.showToast('分享失败，请手动复制文字');
            }
        }
    }

    // 现代复制到剪贴板方法
    async copyToClipboard(text) {
        // 优先使用现代的 Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            this.showToast('名言已复制到剪贴板');
            return;
        }
        
        // 备用方案：使用现代DOM方法
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.cssText = `
            position: fixed;
            left: -9999px;
            top: 0;
            opacity: 0;
            pointer-events: none;
        `;
        
        document.body.appendChild(textArea);
        
        try {
            // 现代文本选择方法
            textArea.select();
            textArea.setSelectionRange(0, 99999); // 兼容移动端
            
            // 使用 Clipboard API 的 writeText 方法
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(text);
                this.showToast('名言已复制到剪贴板');
            } else {
                // 如果所有方法都失败，显示提示让用户手动复制
                this.showToast('请手动复制以下文字：\\n' + text);
            }
        } finally {
            // 清理DOM
            document.body.removeChild(textArea);
        }
    }

    // 获取当前名言信息
    getCurrentQuote() {
        return this.quotes[this.currentIndex];
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            z-index: 1000;
            font-size: 14px;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 2000);
    }
}

// 页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    window.vegetableRootGame = new VegetableRootGame();
});

// 添加服务工作者支持（离线缓存）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}