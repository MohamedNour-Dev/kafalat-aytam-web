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

// =========================================
// * تحديث القائمة النشطة (Active State)
// =========================================
const navItems = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

// 1. التحديث عند النقر
navItems.forEach(item => {
    item.addEventListener('click', function () {
        // إزالة الكلاس من الجميع
        navItems.forEach(link => link.classList.remove('active'));
        // إضافته للعنصر المنقور
        this.classList.add('active');
    });
});

// 2. التحديث عند التمرير (Scroll Spy)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.3 // عندما يظهر 30% من القسم
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // الحصول على الـ id الخاص بالقسم الحالي
            const id = entry.target.getAttribute('id');

            // إزالة الكلاس من جميع الروابط
            navItems.forEach(link => {
                link.classList.remove('active');
                // إضافة الكلاس للرابط المطابق للقسم الحالي
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

const sectionObserver = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach(section => sectionObserver.observe(section));

// نظام الصوت (التحكم بموسيقى الخلفية)
const soundBtn = document.getElementById('soundToggle');
const bgAudio = document.getElementById('bgAudio');

// دالة لتحديث شكل الزر
const updateSoundUI = () => {
    if (!soundBtn || !bgAudio) return;
    if (bgAudio.paused) {
        soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        soundBtn.classList.remove('playing');
    } else {
        soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        soundBtn.classList.add('playing');
    }
};

if (soundBtn && bgAudio) {
    bgAudio.volume = 0.6; // مستوى صوت واضح

    // محاولة التشغيل
    const startAudio = () => {
        bgAudio.play().then(() => {
            updateSoundUI();
            console.log("Audio started successfully");
            // بمجرد أن يبدأ بنجاح، نزيل المستمعات
            removeInteractionListeners();
        }).catch(err => {
            console.log("Waiting for user interaction to play audio...");
        });
    };

    // مستمعات التفاعل
    const interactionEvents = ['click', 'touchstart', 'scroll', 'mousemove', 'keydown'];

    const removeInteractionListeners = () => {
        interactionEvents.forEach(event => {
            document.removeEventListener(event, startAudio);
        });
    };

    interactionEvents.forEach(event => {
        document.addEventListener(event, startAudio);
    });

    // التحكم اليدوي بالزر
    soundBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // منع المستمع العام من التداخل
        if (bgAudio.paused) {
            bgAudio.play().then(updateSoundUI);
        } else {
            bgAudio.pause();
            updateSoundUI();
        }
    });

    // مزامنة حالة الأيقونة
    bgAudio.addEventListener('play', updateSoundUI);
    bgAudio.addEventListener('pause', updateSoundUI);
}

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
// معالجة نموذج الكفالة
const sponsorForm = document.querySelector('.sponsor-form');
const sponsorName = document.getElementById('sponsorName');
const sponsorEmail = document.getElementById('sponsorEmail');
const sponsorPhone = document.getElementById('sponsorPhone');
const countryCodeSelect = document.getElementById('countryCode');

// عناصر الإدخال اليدوي
const manualInputGroup = document.getElementById('manualInputGroup');
const manualCodeInput = document.getElementById('manualCodeInput');
const resetCountryBtn = document.getElementById('resetCountry');
const dynamicFlag = document.getElementById('dynamicFlag');

// دالة إغلاق النافذة (يجب تعريفها هنا قبل استخدامها)
const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('active');
    // إعادة تعيين الحالة عند الإغلاق
    const paymentForm = document.getElementById('payment-form');
    if (paymentForm) {
        paymentForm.style.display = 'block';
        const modalHeader = document.querySelector('.modal-header');
        if (modalHeader) modalHeader.style.display = 'block';
        const successMsg = document.getElementById('payment-success');
        if (successMsg) successMsg.style.display = 'none';
        paymentForm.reset();
    }
};

// خريطة الأعلام للكشف التلقائي (قائمة موسعة)
const codeToFlag = {
    '1': '🇺🇸', // USA / Canada
    '7': '🇷🇺', // Russia
    '20': '🇪🇬', '212': '🇲🇦', '213': '🇩🇿', '216': '🇹🇳', '218': '🇱🇾',
    '222': '🇲🇷', '249': '🇸🇩', '252': '🇸🇴', '253': '🇩🇯', '269': '🇰🇲',
    '30': '🇬🇷', '31': '🇳🇱', '32': '🇧🇪', '33': '🇫🇷', '34': '🇪🇸',
    '39': '🇮🇹', '44': '🇬🇧', '49': '🇩🇪', '55': '🇧🇷', '61': '🇦🇺',
    '62': '🇮🇩', '63': '🇵🇭', '64': '🇳🇿', '65': '🇸🇬', '66': '🇹🇭',
    '81': '🇯🇵', '82': '🇰🇷', '84': '🇻🇳', '86': '🇨🇳', '90': '🇹🇷',
    '91': '🇮🇳', '92': '🇵🇰', '93': '🇦🇫', '94': '🇱🇰', '95': '🇲🇲',
    '98': '🇮🇷',
    '960': '🇲🇻', '961': '🇱🇧', '962': '🇯🇴', '963': '🇸🇾', '964': '🇮🇶',
    '965': '🇰🇼', '966': '🇸🇦', '967': '🇾🇪', '968': '🇴🇲', '970': '🇵🇸',
    '971': '🇦🇪', '972': '🇮🇱', '973': '🇧🇭', '974': '🇶🇦', '975': '🇧🇹',
    '976': '🇲🇳', '977': '🇳🇵', '993': '🇹🇲', '994': '🇦🇿', '995': '🇬🇪',
    '996': '🇰🇬', '998': '🇺🇿'
};

// تبديل الوضع (القائمة <-> يدوي)
countryCodeSelect.addEventListener('change', (e) => {
    if (e.target.value === 'manual') {
        countryCodeSelect.style.display = 'none';
        manualInputGroup.style.display = 'flex';
        manualCodeInput.focus();
        manualCodeInput.value = '+'; // بادئة تلقائية
    }
});

resetCountryBtn.addEventListener('click', () => {
    manualInputGroup.style.display = 'none';
    countryCodeSelect.style.display = 'block';
    countryCodeSelect.value = '+966'; // إعادة تعيين للسعودية
    manualCodeInput.value = '';
    dynamicFlag.innerText = '🌐';
});

// الكشف التلقائي عن العلم
manualCodeInput.addEventListener('input', (e) => {
    let val = e.target.value;

    // ضمان وجود + في البداية
    if (!val.startsWith('+')) {
        val = '+' + val.replace(/\+/g, '');
        e.target.value = val;
    }

    // استخراج الكود (بدون +)
    const code = val.substring(1);

    // البحث عن العلم
    // نحاول مطابقة أطول كود ممكن (3 أرقام، ثم 2، ثم 1)
    let foundFlag = '🌐';

    // نتحقق من 3 أرقام (مثل 966)
    if (code.length >= 3 && codeToFlag[code.substring(0, 3)]) {
        foundFlag = codeToFlag[code.substring(0, 3)];
    }
    // نتحقق من رقمين (مثل 20)
    else if (code.length >= 2 && codeToFlag[code.substring(0, 2)]) {
        foundFlag = codeToFlag[code.substring(0, 2)];
    }
    // نتحقق من رقم واحد (مثل 1)
    else if (code.length >= 1 && codeToFlag[code.substring(0, 1)]) {
        foundFlag = codeToFlag[code.substring(0, 1)];
    }

    dynamicFlag.innerText = foundFlag;
});

// دالة لإظهار رسالة الخطأ
const showError = (input, message) => {
    if (!input) return;
    const formGroup = input.closest('.form-group') || input.closest('.phone-group-container');
    if (!formGroup) return;
    const errorSpan = formGroup.querySelector('.error-msg');
    input.classList.add('invalid');
    if (errorSpan) {
        errorSpan.innerText = message;
        errorSpan.classList.add('visible');
    }
};

// دالة لإخفاء رسالة الخطأ
const clearError = (input) => {
    if (!input) return;
    const formGroup = input.closest('.form-group') || input.closest('.phone-group-container');
    if (!formGroup) return;
    const errorSpan = formGroup.querySelector('.error-msg');
    input.classList.remove('invalid');
    if (errorSpan) {
        errorSpan.classList.remove('visible');
    }
};

// التحقق من الاسم
const validateName = () => {
    if (!sponsorName) return true; // إذا لم يكن العنصر موجوداً، نتجاوز التحقق
    const value = sponsorName.value.trim();
    if (!value) {
        showError(sponsorName, 'الرجاء إدخال الاسم الكامل');
        return false;
    }
    const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]+$/;
    if (!nameRegex.test(value)) {
        showError(sponsorName, 'الاسم يجب أن يحتوي على حروف فقط');
        return false;
    }
    clearError(sponsorName);
    return true;
};

// التحقق من البريد
const validateEmail = () => {
    if (!sponsorEmail) return true; // إذا لم يكن العنصر موجوداً، نتجاوز التحقق
    const value = sponsorEmail.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        showError(sponsorEmail, 'الرجاء إدخال بريد إلكتروني صحيح');
        return false;
    }
    clearError(sponsorEmail);
    return true;
};

// التحقق من الهاتف
const validatePhone = () => {
    if (!sponsorPhone) return true; // إذا لم يكن العنصر موجوداً، نتجاوز التحقق
    const value = sponsorPhone.value.trim();
    const phoneRegex = /^\d{5,15}$/;
    if (!phoneRegex.test(value)) {
        showError(sponsorPhone, 'الرجاء إدخال رقم جوال صحيح');
        return false;
    }
    clearError(sponsorPhone);
    return true;
};

// تفعيل التحقق الفوري (مع التحقق من وجود العناصر)
if (sponsorName) {
    sponsorName.addEventListener('input', validateName);
}
if (sponsorEmail) {
    sponsorEmail.addEventListener('input', validateEmail);
}
if (sponsorPhone) {
    sponsorPhone.addEventListener('input', () => {
        sponsorPhone.value = sponsorPhone.value.replace(/[^0-9]/g, '');
        if (sponsorPhone.value.length > 0) validatePhone();
    });
}


// ملاحظة: تم دمج منطق النموذج في قسم 6 بالأسفل لتجنب التضارب.
const sponsorshipTypeSelect = document.getElementById('sponsorshipType');

// فتح النافذة عند النقر على أزرار الكفالة
console.log('عدد أزرار الكفالة:', sponsorBtns.length);
sponsorBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        console.log('تم النقر على زر الكفالة');
        // نمنع الانتقال الافتراضي فوراً
        e.preventDefault();

        // إذا كان الزر هو "تبرع الآن" (الرئيسي)، نفتح المودال أيضاً أو نتركه يذهب لقسم التبرع؟
        // المستخدم كان يشتكي من "اكفل الآن" (في البطاقات).
        // لكن لضمان عدم حدوث تضارب، سنتحقق:
        if (btn.getAttribute('href') === '#donation') {
            console.log('زر التبرع - سيتم التمرير');
            // هذا الزر يذهب لقسم التبرع، سنسمح له بالتمرير (Scroll)
            // ولكننا منعنا الافتراضي، لذا سنقوم بالتمرير يدوياً
            const targetSection = document.querySelector('#donation');
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }

        console.log('سيتم فتح المودال');
        // تحديد نوع الكفالة بناءً على البطاقة
        const card = btn.closest('.card');
        if (card) {
            const title = card.querySelector('h3').innerText;
            if (title.includes('تعليمية')) sponsorshipTypeSelect.value = 'education';
            else if (title.includes('شاملة')) sponsorshipTypeSelect.value = 'full';
            else if (title.includes('صحية')) sponsorshipTypeSelect.value = 'health';
        }

        modal.classList.add('active');
        console.log('تمت إضافة class active للمودال');
    });
});

// ربط زر الإغلاق (مع التحقق من وجوده)
if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

// إغلاق عند النقر خارج النافذة
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// =========================================
// 6/ نموذج الدفع (Payment Process - Realistic)
// =========================================
const paymentForm = document.getElementById('payment-form');
const cardHolder = document.getElementById('cardHolder');
const cardNumber = document.getElementById('cardNumber');
const cardExpiry = document.getElementById('cardExpiry');
const cardCvc = document.getElementById('cardCvc');
const successMessage = document.getElementById('payment-success');

// التحقق البسيط (Simple Validation Helper)
const validateInput = (input) => {
    if (input.value.trim().length > 0) {
        input.classList.remove('input-error');
    }
}

// تنسيق رقم البطاقة (Format Card Number)
if (cardNumber) {
    cardNumber.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        // إضافة مسافة كل 4 أرقام
        value = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = value.substring(0, 19); // 16 digits + 3 spaces
        validateInput(e.target);
    });
}

// تنسيق التايرخ (Format Date MM/YY)
if (cardExpiry) {
    cardExpiry.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value.substring(0, 5);
        validateInput(e.target);
    });
}

// تنسيق CVV
if (cardCvc) {
    cardCvc.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
        validateInput(e.target);
    });
}

// خوارزمية لوهن (Luhn Algorithm) للتحقق من البطاقة
const luhnCheck = (val) => {
    let checksum = 0;
    let j = 1;
    for (let i = val.length - 1; i >= 0; i--) {
        let calc = 0;
        calc = Number(val.charAt(i)) * j;
        if (calc > 9) {
            checksum = checksum + 1;
            calc = calc - 10;
        }
        checksum = checksum + calc;
        if (j == 1) { j = 2 } else { j = 1 };
    }
    return (checksum % 10) == 0;
};

// معالجة الدفع (Process Payment)
if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. التحقق من صحة المدخلات الأساسية
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();

        if (!isNameValid || !isEmailValid || !isPhoneValid) {
            return;
        }

        // 2. التحقق من صحة البطاقة
        const rawCardNum = cardNumber.value.replace(/\s/g, '');
        if (rawCardNum.length < 13 || !luhnCheck(rawCardNum)) {
            cardNumber.classList.add('input-error');
            cardNumber.focus();
            showError(cardNumber, 'رقم البطاقة غير صحيح (استخدم رقم حقيقي أو اختبار)');
            return;
        } else {
            clearError(cardNumber);
        }

        if (cardHolder && cardHolder.value.trim().length < 3) {
            cardHolder.classList.add('input-error');
            cardHolder.focus();
            showError(cardHolder, 'الرجاء إدخال اسم صاحب البطاقة');
            return;
        } else if (cardHolder) {
            clearError(cardHolder);
        }

        if (cardExpiry.value.length < 5) {
            cardExpiry.classList.add('input-error');
            cardExpiry.focus();
            showError(cardExpiry, 'تاريخ الانتهاء غير صحيح');
            return;
        } else {
            clearError(cardExpiry);
        }

        if (cardCvc.value.length < 3) {
            cardCvc.classList.add('input-error');
            cardCvc.focus();
            showError(cardCvc, 'رمز التحقق (CVV) غير صحيح');
            return;
        } else {
            clearError(cardCvc);
        }

        // 3. محاكاة المعالجة (Processing Simulation)
        const btn = paymentForm.querySelector('button');
        const btnText = document.getElementById('btn-text');

        // حالة التحميل
        const originalText = btnText.innerText;
        btnText.innerText = 'جاري المعالجة...';

        // إضافة Spinner
        const spinner = document.createElement('div');
        spinner.className = 'spinner';
        btn.appendChild(spinner);

        btn.disabled = true;
        btn.style.cursor = 'wait';

        // تحديد الكود النهائي للجوال (للعرض فقط)
        let finalCode = countryCodeSelect ? countryCodeSelect.value : '+966';
        if (countryCodeSelect && countryCodeSelect.style.display === 'none') {
            finalCode = manualCodeInput ? manualCodeInput.value : '+966';
        }
        const fullPhoneNumber = `${finalCode} ${sponsorPhone.value}`;

        // 4. النجاح بعد 3 ثواني
        setTimeout(() => {
            console.log(`Donation received from ${sponsorName.value} (${sponsorEmail.value}), phone: ${fullPhoneNumber}`);

            // إخفاء النموذج
            paymentForm.style.display = 'none';
            const modalHeader = document.querySelector('.modal-header');
            if (modalHeader) modalHeader.style.display = 'none';

            // إظهار رسالة النجاح
            successMessage.style.display = 'block';

            // تنظيف
            spinner.remove();
            btnText.innerText = originalText;
            btn.disabled = false;
            btn.style.cursor = 'pointer';

            // إعادة تعيين النموذج للخلفية (للمرة القادمة)
            // سيتم تصفير النموذج عند الإغلاق في closeModal()
        }, 3000);
    });
}

// =========================================
// 7/ معالجة نموذج التواصل
// =========================================
const contactForm = document.querySelector('.contact-form');
const contactNameInput = document.getElementById('contactName');

if (contactNameInput) {
    contactNameInput.addEventListener('input', function () {
        const val = this.value;
        const formGroup = this.closest('.form-group');
        const errorSpan = formGroup.querySelector('.error-msg');

        // التحقق من وجود أرقام (إنجليزية أو عربية)
        if (/[0-9\u0660-\u0669]/.test(val)) {
            this.classList.add('input-error');
            if (errorSpan) {
                errorSpan.innerText = 'يجب عليك إدخال أحرف فقط';
                errorSpan.classList.add('visible');
            }
        } else {
            this.classList.remove('input-error');
            if (errorSpan) {
                errorSpan.classList.remove('visible');
            }
        }
    });
}

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // التحقق قبل الإرسال
        const nameVal = contactNameInput ? contactNameInput.value : '';
        if (/[0-9\u0660-\u0669]/.test(nameVal)) {
            if (contactNameInput) contactNameInput.focus();
            return;
        }

        const btn = contactForm.querySelector('button');
        btn.innerText = 'جاري الإرسال...';

        setTimeout(() => {
            alert('تم استلام رسالتك بنجاح!');
            btn.innerText = 'إرسال الرسالة';
            contactForm.reset();
            // إزالة الأخطاء
            document.querySelectorAll('.contact-form .input-error').forEach(el => el.classList.remove('input-error'));
            document.querySelectorAll('.contact-form .error-msg').forEach(el => el.classList.remove('visible'));
        }, 1500);
    });
}
