/**
 * 韫川科技 · 开业盛典H5邀请函
 * 交互与动效
 */

(function () {
  'use strict';

  /* ========================================
     1. 加载动画
     ======================================== */
  function initLoader() {
    var loader = document.getElementById('loader');
    var main = document.getElementById('main-content');

    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('fade-out');
        main.classList.remove('hidden');
        main.classList.add('visible');

        setTimeout(function () {
          loader.style.display = 'none';
          // 首屏元素动画
          animateHero();
        }, 800);
      }, 1800);
    });
  }

  function animateHero() {
    var items = document.querySelectorAll('.hero-section .anim-item');
    items.forEach(function (item) {
      var delay = parseInt(item.getAttribute('data-delay') || '0', 10);
      setTimeout(function () {
        item.classList.add('visible');
      }, delay);
    });
  }

  /* ========================================
     2. 滚动触发动画 (IntersectionObserver)
     ======================================== */
  function initScrollAnimations() {
    var observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);

          // 文化屏的特殊处理已在CSS中定义
          setTimeout(function () {
            el.classList.add('visible');
          }, delay);

          observer.unobserve(el);
        }
      });
    }, observerOptions);

    // 观察所有非首屏的动画元素
    var sections = document.querySelectorAll('.section:not(.hero-section)');
    sections.forEach(function (section) {
      var items = section.querySelectorAll('.anim-item');
      items.forEach(function (item) {
        observer.observe(item);
      });
    });
  }

  /* ========================================
     3. 水纹背景画布
     ======================================== */
  function initWaterCanvas() {
    var canvas = document.getElementById('water-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var width, height;
    var particles = [];
    var PARTICLE_COUNT = 50;
    var animId;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.2 - 0.1,
        alpha: Math.random() * 0.5 + 0.1,
        alphaDir: Math.random() > 0.5 ? 1 : -1,
        color: Math.random() > 0.6 ? 'gold' : 'red'
      };
    }

    function initParticles() {
      particles = [];
      for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
      }
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(function (p) {
        // 更新位置
        p.x += p.vx;
        p.y += p.vy;

        // 闪烁
        p.alpha += p.alphaDir * 0.003;
        if (p.alpha > 0.6) p.alphaDir = -1;
        if (p.alpha < 0.05) p.alphaDir = 1;

        // 边界循环
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // 绘制
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.color === 'gold') {
          ctx.fillStyle = 'rgba(212, 175, 55, ' + p.alpha + ')';
        } else {
          ctx.fillStyle = 'rgba(196, 30, 58, ' + (p.alpha * 0.6) + ')';
        }
        ctx.fill();
      });

      // 连线效果（距离近的粒子之间）
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            var lineAlpha = (1 - dist / 120) * 0.08;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(212, 175, 55, ' + lineAlpha + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(drawParticles);
    }

    resize();
    initParticles();
    drawParticles();

    window.addEventListener('resize', function () {
      resize();
      initParticles();
    });

    // 页面不可见时暂停动画
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        drawParticles();
      }
    });
  }

  /* ========================================
     4. 音乐按钮
     ======================================== */
  function initMusicButton() {
    var btn = document.getElementById('music-btn');
    var audio = document.getElementById('bg-music');
    if (!btn || !audio) return;

    var isPlaying = false;
    var isMutedAutoplay = false;
    var hasInteracted = false;
    var isWeChat = /MicroMessenger/i.test(navigator.userAgent);

    function setPlayingState(state) {
      isPlaying = state;
      if (state) {
        btn.classList.add('playing');
      } else {
        btn.classList.remove('playing');
      }
    }

    function unmuteAndPlay() {
      audio.muted = false;
      audio.volume = 0.5;
      isMutedAutoplay = false;
      audio.play().catch(function () {});
    }

    function tryAutoPlay() {
      audio.muted = true;
      var playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(function () {
          setPlayingState(true);
          isMutedAutoplay = true;
        }).catch(function () {
          setPlayingState(false);
          isMutedAutoplay = false;
        });
      }
    }

    function handleInteraction() {
      if (hasInteracted && !isWeChat) return;
      hasInteracted = true;
      if (isPlaying && isMutedAutoplay) {
        unmuteAndPlay();
      } else if (!isPlaying) {
        unmuteAndPlay();
        setPlayingState(true);
      } else if (isWeChat) {
        audio.play().catch(function () {});
      }
    }

    var interactionEvents = ['touchstart', 'click'];
    interactionEvents.forEach(function (evt) {
      document.addEventListener(evt, handleInteraction, { passive: true, capture: true });
    });

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (isPlaying) {
        audio.pause();
        setPlayingState(false);
      } else {
        unmuteAndPlay();
        setPlayingState(true);
      }
    });

    document.addEventListener('WeixinJSBridgeReady', function () {
      unmuteAndPlay();
      setPlayingState(true);
    });

    audio.addEventListener('ended', function () {
      if (audio.loop) {
        audio.play().catch(function () {});
      }
    });

    window.addEventListener('load', function () {
      tryAutoPlay();
    });
  }

  /* ========================================
     5. 文化屏特殊动效检测
     ======================================== */
  function initCultureAnimation() {
    var cultureSection = document.getElementById('culture');
    if (!cultureSection) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // 触发韫/川双栏滑入
          var yun = cultureSection.querySelector('.culture-yun');
          var chuan = cultureSection.querySelector('.culture-chuan');

          if (yun) {
            setTimeout(function () { yun.classList.add('visible'); }, 300);
          }
          if (chuan) {
            setTimeout(function () { chuan.classList.add('visible'); }, 500);
          }

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(cultureSection);
  }

  /* ========================================
     6. 页面可见性优化
     ======================================== */
  function initVisibilityOptimization() {
    // 在微信中优化体验
    document.addEventListener('WeixinJSBridgeReady', function () {
      // 微信JSBridge就绪
      document.body.classList.add('wechat');
    });
  }

  /* ========================================
     7. 初始化
     ======================================== */
  function init() {
    initLoader();
    initScrollAnimations();
    initWaterCanvas();
    initMusicButton();
    initCultureAnimation();
    initVisibilityOptimization();
  }

  // DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
