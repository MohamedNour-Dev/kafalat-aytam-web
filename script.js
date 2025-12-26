// =========================================
// 1/ قسم التحكم بشريط التنقل والصوت
// =========================================

// تغيير شكل شريط التنقل عند التمرير
window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// نظام الصوت (اختياري - لمسة فنية)
const soundBtn = document.getElementById('soundToggle');
let isMuted = true;
let audio = new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3'); // مثال لصوت بسيط

soundBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    if (!isMuted) {
        soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        // إضافة الكود الخاص بتشغيل موسيقى خلفية هادئة هنا
    } else {
        soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
});

// =========================================
// 2/ قسم العدادات (Counter Animation)
// =========================================

const counters = document.querySelectorAll('.counter');
const speed = 200;

const animateCounters = () => {
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const inc = target / speed;

            if (count < target) {
                counter.innerText = Math.ceil(count + inc);
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });
};

// تشغيل العداد عند الوصول للقسم
const statsSection = document.querySelector('.stats-section');
let options = {
    threshold: 0.5
};

let observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            observer.unobserve(entry.target);
        }
    });
}, options);

if(statsSection) {
    observer.observe(statsSection);
}

// =========================================
// 3/ قسم حركات الظهور عند التمرير (Scroll Reveal)
// =========================================

const revealElements = document.querySelectorAll('.animate-up, .card, .stat-item');

const revealOnScroll = () => {
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 50) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }
    });
};

// تهيئة العناصر قبل الحركة
revealElements.forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s ease-out";
});

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// =========================================
// 4/ التحكم في القائمة للجوال
// =========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    // يمكن إضافة قائمة جانبية هنا لاحقاً
    alert('سيتم فتح قائمة الجوال هنا');
});
