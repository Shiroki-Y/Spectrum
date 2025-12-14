// mode-link-replace.js - 优化版（解决不弹窗+增加调试日志）
(function() {
    // ========== 配置项 - 可根据需要修改 ==========
    const REPLACE_RULES = [
        {
            targetFileName: 'neweratv.com_20051013_news.html',
            replaceWithFileName: 'neweratv.com_20051013_news1.html'
        }
    ];
    // ============================================

    // 调试日志（方便排查问题，上线可删除）
    console.log('=== mode-link-replace.js 加载成功 ===');
    console.log('当前localStorage中的模式：', localStorage.getItem('userExperienceMode'));

    // 从本地存储获取用户选择的模式
    function getUserMode() {
        return localStorage.getItem('userExperienceMode') || 'pure';
    }

    // 核心函数：替换链接中的目标文件名
    function replaceLinkFileName(linkHref) {
        if (getUserMode() === 'original') {
            console.log(`[原版] 链接不替换：${linkHref}`);
            return linkHref;
        }

        let url;
        try {
            url = new URL(linkHref, window.location.href);
        } catch (e) {
            console.log(`[无效URL] 跳过替换：${linkHref}`);
            return linkHref;
        }

        const pathname = url.pathname;
        for (const rule of REPLACE_RULES) {
            if (pathname.endsWith(rule.targetFileName)) {
                const newPathname = pathname.replace(rule.targetFileName, rule.replaceWithFileName);
                url.pathname = newPathname;
                console.log(`[纯净版] 链接替换：${linkHref} → ${url.href}`);
                return url.href;
            }
        }

        console.log(`[无匹配规则] 链接不替换：${linkHref}`);
        return linkHref;
    }

    // 批量替换页面中所有链接的href
    function replaceAllPageLinks() {
        console.log('开始批量替换页面所有链接...');
        const allLinks = document.querySelectorAll('a');
        allLinks.forEach(link => {
            if (link.href) {
                link.href = replaceLinkFileName(link.href);
            }
        });
        console.log(`批量替换完成，共处理 ${allLinks.length} 个链接`);
    }

    // 全局点击拦截
    function interceptLinkClicks() {
        document.addEventListener('click', function(e) {
            const targetLink = e.target.closest('a');
            if (targetLink && targetLink.href) {
                const originalHref = targetLink.href;
                const newHref = replaceLinkFileName(originalHref);
                
                if (newHref !== originalHref) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(`[拦截点击] 跳转：${originalHref} → ${newHref}`);
                    window.location.href = newHref;
                }
            }
        }, true);
    }

    // 首次访问弹出模式选择（强制弹窗测试：把 !localStorage.getItem(...) 改为 true）
    function showModePrompt() {
        // 测试时可临时改为 true，强制每次刷新都弹窗：
        // if (true) {
        if (!localStorage.getItem('userExperienceMode')) {
            console.log('首次访问，弹出模式选择框...');
            const promptMsg = "请选择您想要体验的模式：\n1. 纯净版（删除可能影响直播的外部链接，如果您在直播请务必选择此项）\n2. 原版\n\n请输入 1 选择纯净版，输入 2 选择原版";
            let userChoice = prompt(promptMsg, "1");
            
            while (userChoice !== null && userChoice !== "1" && userChoice !== "2") {
                userChoice = prompt("输入无效！请重新选择：\n1. 纯净版\n2. 原版\n\n仅可输入 1 或 2", "1");
            }
            
            const mode = (userChoice === "2") ? "original" : "pure";
            localStorage.setItem('userExperienceMode', mode);
            alert(`已选择${mode === "pure" ? "纯净版" : "原版"}，全站生效！`);
            console.log(`用户选择模式：${mode}，已保存到localStorage`);
        }
    }

    // 初始化：优先执行，不依赖DOM加载
    function init() {
        // 第一步：先弹模式选择框（DOM加载前也能执行）
        showModePrompt();
        
        // 第二步：等待DOM加载完成后，执行链接替换和拦截
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                replaceAllPageLinks();
                interceptLinkClicks();
                initMutationObserver();
            });
        } else {
            replaceAllPageLinks();
            interceptLinkClicks();
            initMutationObserver();
        }
    }

    // 监听动态内容加载
    function initMutationObserver() {
        const observer = new MutationObserver(function() {
            console.log('检测到页面内容变化，重新替换链接...');
            replaceAllPageLinks();
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        console.log('动态内容监听已开启');
    }

    // 立即执行初始化（不等待DOM）
    init();

    // 暴露全局方法
    window.replaceLinkFileName = replaceLinkFileName;
    window.replaceAllPageLinks = replaceAllPageLinks;
})();