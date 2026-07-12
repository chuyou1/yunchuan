/**
 * 韫川科技 · 开业盛典H5邀请函
 * 交互与动效 - 浅色明亮主题 + 分层懒加载动画
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
    var items = document.querySelectorAll('.hero-section .lazy-animate');
    items.forEach(function (item, index) {
      var delay = parseInt(item.getAttribute('data-delay') || String(index * 200), 10);
      setTimeout(function () {
        item.classList.add('visible');
      }, delay);
    });
  }

  /* ========================================
     2. 滚动触发懒加载动画 (IntersectionObserver)
     ======================================== */
  function initLazyAnimations() {
    // 方案一：主 Obser 观察模块整体进入视口
    var sectionOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.08
    };

    // 子元素动画 - 延迟触发
    var elementOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    };

    // 子元素动画观察器
    var elementObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);

          setTimeout(function () {
            el.classList.add('visible');
          }, delay);

          elementObserver.unobserve(el);
        }
      });
    }, elementOptions);

    // 主模块动画观察器 - 为整个 section 添加类后触发子元素
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var section = entry.target;
          section.classList.add('section-visible');

          // 模块内所有带 lazy-animate 的元素依次动画
          var animatedItems = section.querySelectorAll('.lazy-animate:not(.visible)');
          animatedItems.forEach(function (el, index) {
            var delay = parseInt(el.getAttribute('data-delay') || String(index * 120), 10);
            setTimeout(function () {
              el.classList.add('visible');
            }, delay);
          });

          sectionObserver.unobserve(section);
        }
      });
    }, sectionOptions);

    // 观察所有模块
    var sections = document.querySelectorAll('.section');
    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });

    // 补充：对首屏元素也执行一次动画（兼容加载器未触发的情况）
    var heroSection = document.querySelector('.hero-section');
    if (heroSection) {
      var heroItems = heroSection.querySelectorAll('.lazy-animate');
      heroItems.forEach(function (el, index) {
        var delay = parseInt(el.getAttribute('data-delay') || String(index * 200), 10);
        setTimeout(function () {
          el.classList.add('visible');
        }, 2000 + delay); // 在加载动画完成后开始
      });
    }

    // 兜底：如果元素已经在视口中，直接触发
    if ('IntersectionObserver' in window) {
      document.querySelectorAll('.lazy-animate:not(.visible)').forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          var delay = parseInt(el.getAttribute('data-delay') || '0', 10);
          setTimeout(function () {
            el.classList.add('visible');
          }, delay);
        }
      });
    } else {
      // 旧浏览器不支持 IntersectionObserver 时，直接显示所有内容
      document.querySelectorAll('.lazy-animate').forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  /* ========================================
     3. 粒子背景画布 - 浅色主题
     ======================================== */
  function initWaterCanvas() {
    var canvas = document.getElementById('water-canvas');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var width, height;
    var particles = [];
    var PARTICLE_COUNT = 45;
    var animId;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.8,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.15 - 0.08,
        alpha: Math.random() * 0.45 + 0.1,
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
        p.x += p.vx;
        p.y += p.vy;

        p.alpha += p.alphaDir * 0.0025;
        if (p.alpha > 0.5) p.alphaDir = -1;
        if (p.alpha < 0.08) p.alphaDir = 1;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.color === 'gold') {
          ctx.fillStyle = 'rgba(212, 175, 55, ' + p.alpha + ')';
        } else {
          ctx.fillStyle = 'rgba(196, 30, 58, ' + (p.alpha * 0.55) + ')';
        }
        ctx.fill();
      });

      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            var lineAlpha = (1 - dist / 120) * 0.06;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = 'rgba(201, 162, 61, ' + lineAlpha + ')';
            ctx.lineWidth = 0.6;
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

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        drawParticles();
      }
    });
  }

  /* ========================================
     4. 音乐按钮 - 真实背景音乐播放
     ======================================== */
  function initMusicButton() {
    var btn = document.getElementById('music-btn');
    if (!btn) return;

    var audio = document.getElementById('bg-music');
    var isPlaying = false;
    var autoPlayAttempted = false;

    if (audio) {
      audio.loop = true;
      audio.volume = 0.5;
      audio.setAttribute('preload', 'auto');

      var tryAutoPlay = function () {
        if (autoPlayAttempted) return;
        autoPlayAttempted = true;
        var playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(function () {
            isPlaying = true;
            btn.classList.add('playing');
          }).catch(function () {
            isPlaying = false;
          });
        }
      };

      window.addEventListener('load', tryAutoPlay);

      var autoPlayOnInteraction = function () {
        if (!isPlaying && !audio.paused) {
          isPlaying = true;
          btn.classList.add('playing');
          return;
        }

        if (!isPlaying && !autoPlayAttempted) {
          var p = audio.play();
          if (p !== undefined) {
            p.then(function () {
              isPlaying = true;
              btn.classList.add('playing');
            }).catch(function () {});
          }
        }

        document.removeEventListener('click', autoPlayOnInteraction);
        document.removeEventListener('touchstart', autoPlayOnInteraction);
      };

      document.addEventListener('click', autoPlayOnInteraction);
      document.addEventListener('touchstart', autoPlayOnInteraction);
    }

    btn.addEventListener('click', function () {
      if (!audio) {
        isPlaying = !isPlaying;
        btn.classList.toggle('playing', isPlaying);
        return;
      }

      if (isPlaying) {
        audio.pause();
        isPlaying = false;
        btn.classList.remove('playing');
      } else {
        var p = audio.play();
        if (p !== undefined) {
          p.then(function () {
            isPlaying = true;
            btn.classList.add('playing');
          }).catch(function () {
            isPlaying = false;
            btn.classList.remove('playing');
          });
        }
      }
    });
  }

  /* ========================================
     5. 初始化
     ======================================== */
  function init() {
    initLoader();
    initLazyAnimations();
    initWaterCanvas();
    initMusicButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
