// 获取当前页面的 URL
const currentPageUrl = window.location.href;

// 获取主页面 A 的 URL
const mainPageUrl = '/webtimetower.html';

// 定义页面类型
let pageType = 'normal'; // 默认页面类型为 normal

// 判断是否为搜索结果页
if (currentPageUrl.includes('neweratv.com_search-result.html')) {
  pageType = 'search-result'; // 如果 URL 包含 "neweratv.com_search-result.html"，则认为是搜索结果页
}

// 每页显示的记录数
const recordsPerPage = 10;

// 从 localStorage 中获取已访问页面的链接列表
let visitedLinks = localStorage.getItem('visitedLinks');

// 如果 localStorage 中没有链接列表，则创建一个空数组
if (!visitedLinks) {
  visitedLinks = '[]';
}

// 将链接列表解析为 JavaScript 数组
visitedLinks = JSON.parse(visitedLinks);

// 检查当前页面是否已经存在于链接列表中
const isLinkAlreadyAdded = visitedLinks.some(link => link.url === currentPageUrl);

// 如果当前页面不在链接列表中，并且不是主页面，且不是搜索结果页，则添加到链接列表
if (!isLinkAlreadyAdded && currentPageUrl !== mainPageUrl && pageType !== 'search-result') {
  // 创建一个包含 URL 和标题的对象
  const pageInfo = {
    url: currentPageUrl,
    title: document.title // 获取当前页面的标题
  };

  visitedLinks.push(pageInfo);

  // 将更新后的链接列表保存到 localStorage 中
  localStorage.setItem('visitedLinks', JSON.stringify(visitedLinks));
}

// ※顶部固定条折叠及恢复※
// 获取DOM元素
        const archiveHeader = document.getElementById('archiveHeader');
        const returnHomeBtn = document.getElementById('returnHomeBtn');
        
        // 移动端滚动效果
        let lastScrollTop = 0;
        const headerTop = document.querySelector('.archive-header-top');
        const headerTopHeight = headerTop.offsetHeight;
        
        // 初始化：在移动端，设置顶部区域的高度
        function initHeaderHeight() {
            if (window.innerWidth < 768) {
                archiveHeader.style.setProperty('--header-top-height', `${headerTopHeight}px`);
            }
        }
        
        // 处理滚动事件
        function handleScroll() {
          if (window.innerWidth >= 768) {
        // PC端不处理滚动效果
        return;
        }
    
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
        if (scrollTop > lastScrollTop) {
        // 向下滚动，隐藏顶部区域
        archiveHeader.classList.add('top-hidden');
        } else {
        // 向上滚动
        if (scrollTop <= 10) { 
            // 滚动到顶端（距离顶端不超过10px），显示顶部区域
            archiveHeader.classList.remove('top-hidden');
        }
        }
    
        lastScrollTop = scrollTop;
        }
        
        // 初始化
        window.addEventListener('load', initHeaderHeight);
        window.addEventListener('resize', initHeaderHeight);
        window.addEventListener('scroll', handleScroll);

// 动态设置content-wrapper的上边距，使其与顶部条底端贴合
function setContentWrapperPadding() {
  if (window.innerWidth < 768) {
    // 移动端：根据顶部条当前状态（展开/折叠）计算高度
    const headerHeight = archiveHeader.offsetHeight;
    const contentWrapper = document.querySelector('.content-wrapper');
    contentWrapper.style.paddingTop = `${headerHeight}px`;
  } else {
    // PC端：直接获取顶部条高度并设置
    const headerHeight = archiveHeader.offsetHeight;
    const contentWrapper = document.querySelector('.content-wrapper');
    contentWrapper.style.paddingTop = `${headerHeight}px`;
  }
}

// 页面加载完成后执行一次，确保初始状态贴合
window.addEventListener('load', function() {
  initHeaderHeight();
  setContentWrapperPadding(); // 新增这行
});

// 窗口大小变化时重新计算，适配屏幕旋转等场景
window.addEventListener('resize', function() {
  initHeaderHeight();
  setContentWrapperPadding(); // 新增这行
});

// 移动端滚动时（顶部条展开/折叠），实时更新边距
window.addEventListener('scroll', function() {
  handleScroll();
  if (window.innerWidth < 768) {
    setContentWrapperPadding(); // 新增这行，确保滚动时仍贴合
  }
});

// ※点击广告空链接※
function showTowerMessage(msg) {
  var pc = document.getElementById('tower-placeholder-pc');
  var mobile = document.getElementById('tower-placeholder-mobile');
  if (pc) {
    pc.textContent = msg;
    pc.classList.add('visible');
  }
  if (mobile) {
    mobile.textContent = msg;
    mobile.classList.add('visible');
  }

  // 2秒后自动消失（如果msg不为空）
  if (msg) {
    setTimeout(function() {
      if (pc) {
        pc.textContent = '';
        pc.classList.remove('visible');
      }
      if (mobile) {
        mobile.textContent = '';
        mobile.classList.remove('visible');
      }
    }, 2000);
  }
}

// 初始隐藏
showTowerMessage('');

// 绑定所有广告链接
document.querySelectorAll('.ad-link').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    showTowerMessage('正在查询...');
    setTimeout(function() {
      showTowerMessage('抱歉，网络时光塔没有收录这个网址');
    }, 300);
  });
});


// ※移动端链接后缀隐藏※
function autoEllipsisLink(selector, minLen = 10) {
  var links = document.querySelectorAll(selector);
  links.forEach(function(link) {
    var original = link.getAttribute('data-original') || link.textContent.trim();
    link.setAttribute('data-original', original);

    // 只在手机端生效
    if (window.innerWidth > 768) {
      link.textContent = original;
      link.style.maxWidth = '';
      link.style.display = '';
      link.style.whiteSpace = '';
      link.style.overflow = '';
      link.style.textOverflow = '';
      return;
    }

    // 强制inline-block，防止inline自动换行
    link.style.display = 'inline-block';
    link.style.verticalAlign = 'middle';
    link.style.whiteSpace = 'nowrap';
    link.style.overflow = 'hidden';
    link.style.textOverflow = 'ellipsis';

    // 让max-width更精准，取父div的宽度
    var container = link.closest('.archive-info,.archive-header-content,.text-center') || link.parentElement;
    var maxW = container ? container.clientWidth : window.innerWidth;
    // 估算最多可显示的字符数
    var fontSize = parseFloat(window.getComputedStyle(link).fontSize) || 16;
    var maxChars = Math.floor((maxW - 60) / (fontSize * 0.7)); // 给多点边距
    maxChars = Math.max(maxChars, minLen);

    // 设置max-width，防止溢出
    link.style.maxWidth = Math.floor(maxW * 0.85) + 'px';

    if (original.length > maxChars) {
      var head = original.slice(0, Math.max(6, maxChars - 6));
      var tail = original.slice(-4);
      link.textContent = head + "..." + tail;
    } else {
      link.textContent = original;
    }
  });
}

function updateArchiveLinkEllipsis() {
  autoEllipsisLink('.archive-link', 10);
}
window.addEventListener('resize', updateArchiveLinkEllipsis);
window.addEventListener('DOMContentLoaded', updateArchiveLinkEllipsis);

// ※搜索框密钥※
const AUTH_KEY = "3K7p-9xQ2-fS5d";
const AUTH_STORAGE_KEY = "searchbox_auth_passed";

// 检查认证状态
function isSearchboxAuthed() {
  return localStorage.getItem(AUTH_STORAGE_KEY) === "1";
}

// 设置已认证
function setSearchboxAuthed() {
  localStorage.setItem(AUTH_STORAGE_KEY, "1");
}

// 绑定搜索按钮事件
document.getElementById("siteSearchBtn").addEventListener("click", function(e) {
  e.preventDefault();
  const input = document.getElementById("siteSearchInput");
  const value = input.value.trim();

  if (!isSearchboxAuthed()) {
    if (value === AUTH_KEY) {
      setSearchboxAuthed();
      alert("您已通过权限认证！请继续搜索其他内容");
      input.value = ""; // 清空输入
    } else {
      alert("搜索框已设置权限保护，请先输入密钥");
      input.value = ""; // 清空输入
    }
    return;
  }

  // 已认证逻辑（此处仅弹窗，实际搜索可自定义）
  // 自动检测当前页面路径，使用正确的相对路径
  const currentPath = window.location.pathname;
  const isInSubdirectory = currentPath.includes('/secret/') || currentPath.includes('\\secret\\');
  const searchResultPath = isInSubdirectory ? '../neweratv.com_search-result.html' : 'neweratv.com_search-result.html';
  window.location.href = `${searchResultPath}?q=${encodeURIComponent(value)}`;
return; 
  // TODO: 执行真实搜索逻辑
});

document.getElementById("siteSearchInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    document.getElementById("siteSearchBtn").click();
  }
});

// ※视频两侧高度※
function syncVideoSectionHeight() {
  if (window.innerWidth >= 769) {
    var videoPlaceholder = document.querySelector('.video-center .video-placeholder');
    var videoSection = document.querySelector('.video-section');
    if (videoPlaceholder && videoSection) {
      videoSection.style.height = videoPlaceholder.offsetHeight + 'px';
    }
  } else {
    // 移动端恢复自动高度
    var videoSection = document.querySelector('.video-section');
    if (videoSection) {
      videoSection.style.height = '';
    }
  }
}
window.addEventListener('resize', syncVideoSectionHeight);
window.addEventListener('DOMContentLoaded', syncVideoSectionHeight);

// ※特别节目问卷※
// 提示（在选项和按钮之间）
function showTip(msg, color, bold = false, duration = 2000) {
  const tipBox = document.getElementById('survey-tip');
  if (msg) {
    tipBox.innerHTML = bold ? `<span style="color:${color};font-weight:bold;">${msg}</span>` : `<span style="color:${color};">${msg}</span>`;
    tipBox.style.display = "block";
  } else {
    tipBox.innerHTML = "";
    tipBox.style.display = "none";
  }
  if (duration > 0 && msg) {
    setTimeout(() => { 
      tipBox.innerHTML = "";
      tipBox.style.display = "none"; 
    }, duration);
  }
}

// 顶部条弹窗（复用你已有的showTowerMessage机制）
function showSurveyTopBar(msg) {
  if (typeof showTowerMessage === 'function') {
    showTowerMessage(msg);
  } else {
    // 兜底方案：直接alert
    alert(msg);
  }
}

// 记录第三选项是否已经成功提交过
let parallelVoted = false;

// 绑定问卷按钮（仅在存在对应元素的页面执行）
const voteBtn = document.getElementById('vote-btn');
const resultBtn = document.getElementById('result-btn');

if (voteBtn) {
  voteBtn.onclick = function() {
    const selected = document.querySelector('input[name="explore"]:checked');
    if (!selected) {
      showTip('请选择一个选项', '#d8000c', true, 2000);
      return;
    }
    if (selected.value === 'parallel') {
      if (!parallelVoted) {
        showTip('提交成功！感谢您的选择', '#d8000c', true, 2000);
        parallelVoted = true;
      } else {
        showTip('我们很期待', '#d8000c', true, 2000);
      }
    } else {
      showTip('', '', false, 0); // 清空下方提示
      showSurveyTopBar('该网页已停止服务，无法提交');
    }
  };
}

if (resultBtn) {
  resultBtn.onclick = function() {
    showTip('', '', false, 0); // 清空下方提示
    showSurveyTopBar('该网页已停止服务，无法提交');
  };
}