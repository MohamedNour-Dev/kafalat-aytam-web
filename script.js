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

if (statsSection) {
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
// =========================================
// 4/ التحكم في القائمة للجوال (Mobile Menu)
// =========================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');

    // تغيير أيقونة القائمة
    const icon = mobileMenuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// إغلاق القائمة عند النقر على أي رابط
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
    });
});

// =========================================
// 5/ نافذة الكفالة (Sponsorship Modal)
// =========================================
const modal = document.getElementById('sponsorModal');
const closeBtn = document.querySelector('.close-modal');
const sponsorBtns = document.querySelectorAll('.btn-card, .btn-primary-large');
const sponsorshipTypeSelect = document.getElementById('sponsorshipType');

// فتح النافذة عند النقر على أزرار الكفالة
sponsorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (btn.getAttribute('href') === '#donation') return; // تجاهل زر "ابدأ الكفالة" العلوي إذا كان مجرد رابط تنقل

        e.preventDefault();

        // تحديد نوع الكفالة بناءً على البطاقة
        const card = btn.closest('.card');
        if (card) {
            const title = card.querySelector('h3').innerText;
            if (title.includes('تعليمية')) sponsorshipTypeSelect.value = 'education';
            else if (title.includes('شاملة')) sponsorshipTypeSelect.value = 'full';
            else if (title.includes('صحية')) sponsorshipTypeSelect.value = 'health';
        }

        modal.classList.add('active');
    });
});

// إغلاق النافذة
const closeModal = () => {
    modal.classList.remove('active');
};

closeBtn.addEventListener('click', closeModal);

// إغلاق عند النقر خارج النافذة
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// معالجة نموذج الكفالة
const sponsorForm = document.querySelector('.sponsor-form');
sponsorForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // محاكاة إرسال البيانات
    const submitBtn = sponsorForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;

    submitBtn.innerText = 'جاري المعالجة...';
    submitBtn.disabled = true;

    setTimeout(() => {
        alert('شكراً لك! تم استلام طلب الكفالة بنجاح وسنتواصل معك قريباً.');
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        closeModal();
        sponsorForm.reset();
    }, 1500);
});

// معالجة نموذج التواصل
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button');
        btn.innerText = 'جاري الإرسال...';

        setTimeout(() => {
            alert('تم استلام رسالتك بنجاح!');
            btn.innerText = 'إرسال الرسالة';
            contactForm.reset();
        }, 1500);
    });
}
