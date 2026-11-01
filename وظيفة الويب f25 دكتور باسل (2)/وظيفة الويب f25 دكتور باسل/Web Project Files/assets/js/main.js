// =========================================================
// ملف JavaScript الرئيسي - دليل فعاليات الجامعة الافتراضية
// =========================================================

document.addEventListener('DOMContentLoaded', function () {

    // دالة مساعدة لقراءة قيمة من الرابط مثل ?id=3 أو ?cat=tech
    function getUrlParam(name) {

        var query = window.location.search;

        if (query == '') {
            return null;
        }

        var queryParts = query.substring(1).split('&');

        for (var i = 0; i < queryParts.length; i++) {

            var part = queryParts[i].split('=');

            if (part[0] == name) {
                return decodeURIComponent(part[1]);
            }
        }

        return null;
    }


    // 0. الوضع الليلي (Dark Mode) عبر تبديل الصنف dark-mode على body
    // نحفظ اختيار المستخدم في localStorage حتى يبقى عند الانتقال بين الصفحات

    var themeToggle = document.getElementById('themeToggle');

    function applyTheme(isDark) {

        if (isDark) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }

        if (themeToggle) {
            themeToggle.innerHTML = isDark
                ? '<i class="bi bi-sun"></i>'
                : '<i class="bi bi-moon-stars"></i>';
        }
    }

    applyTheme(localStorage.getItem('theme') == 'dark');

    if (themeToggle) {

        themeToggle.addEventListener('click', function () {

            var isDark = !document.body.classList.contains('dark-mode');

            applyTheme(isDark);
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }


    // 1. البحث والفلترة في صفحة الفعاليات

    var filterSelect = document.getElementById('categoryFilter');
    var searchInput = document.getElementById('searchInput');
    var eventCards = document.getElementsByClassName('event-card-item');
    var dateFilter = document.getElementById('dateFilter');
    var locationFilter = document.getElementById('locationFilter');

    function filterEvents() {

        var selectedCat = 'all';
        var searchText = '';
        var selectedDate = '';
        var selectedLocation = 'all';

        if (filterSelect) {
            selectedCat = filterSelect.value;
        }

        if (searchInput) {
            searchText = searchInput.value.toLowerCase().trim();
        }

        if (dateFilter) {
            selectedDate = dateFilter.value;
        }

        if (locationFilter) {
            selectedLocation = locationFilter.value;
        }

        var visibleCount = 0;

        for (var i = 0; i < eventCards.length; i++) {

            var card = eventCards[i];

            var category = card.getAttribute('data-category') || '';
            var cardDate = card.getAttribute('data-date') || '';
            var cardLocation = card.getAttribute('data-location') || '';
            var titleElement = card.getElementsByClassName('card-title')[0];

            var title = '';

            if (titleElement) {
                title = titleElement.textContent.toLowerCase();
            }

            var matchesCategory = selectedCat == 'all' || category == selectedCat;
            var matchesSearch = title.indexOf(searchText) != -1;
            var matchesDate = selectedDate == '' || cardDate == selectedDate;
            var matchesLocation = selectedLocation == 'all' || cardLocation == selectedLocation;

            if (matchesCategory && matchesSearch && matchesDate && matchesLocation) {
                card.style.display = '';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        }

        // إظهار/إخفاء رسالة عدم وجود نتائج
        // نستخدم classList لأن الصنف d-none في Bootstrap أقوى من style.display
        var noResultsMessage = document.getElementById('noResultsMessage');

        if (noResultsMessage) {

            if (visibleCount == 0) {
                noResultsMessage.classList.remove('d-none');
            } else {
                noResultsMessage.classList.add('d-none');
            }
        }
    }

    if (filterSelect) {

        // إذا جاء المستخدم من التصنيفات السريعة في الرئيسية (events.html?cat=tech)
        var catFromUrl = getUrlParam('cat');

        if (catFromUrl) {
            filterSelect.value = catFromUrl;
            filterEvents();
        }

        filterSelect.addEventListener('change', filterEvents);
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterEvents);
    }

    if (dateFilter) {
        dateFilter.addEventListener('change', filterEvents);
    }

    if (locationFilter) {
        locationFilter.addEventListener('change', filterEvents);
    }


    // 2. التحقق من نموذج التواصل

    var contactForm = document.getElementById('contactForm');

    function showAlert(element, text, type) {

        element.className = 'alert alert-' + type + ' mt-3';
        element.textContent = text;
    }

    if (contactForm) {

        contactForm.addEventListener('submit', function (e) {

            e.preventDefault();

            var name = document.getElementById('nameInput').value.trim();
            var email = document.getElementById('emailInput').value.trim();
            var message = document.getElementById('messageInput').value.trim();
            var alertBox = document.getElementById('formAlert');

            if (name == '' || email == '' || message == '') {
                showAlert(alertBox, 'يرجى تعبئة جميع الحقول المطلوبة.', 'danger');
                return;
            }

            var atPosition = email.indexOf('@');
            var dotPosition = email.lastIndexOf('.');

            if (atPosition < 1 || dotPosition < atPosition + 2 || dotPosition == email.length - 1) {
                showAlert(alertBox, 'يرجى إدخال بريد إلكتروني بصيغة صحيحة.', 'warning');
                return;
            }

            showAlert(alertBox, 'تم إرسال رسالتك بنجاح! سنقوم بالرد عليك قريبًا.', 'success');
            contactForm.reset();
        });
    }


    // 3. زر العودة إلى أعلى الصفحة

    var scrollTopBtn = document.getElementById('btnScrollTop');

    if (scrollTopBtn) {

        window.addEventListener('scroll', function () {

            if (window.pageYOffset > 250) {
                scrollTopBtn.style.display = 'block';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        });

        scrollTopBtn.addEventListener('click', function () {
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
        });
    }


    // 4. بيانات الفعاليات السبع (تُستخدم في صفحة التفاصيل)
    // calDate: التاريخ بصيغة YYYYMMDD لاستخدامه في رابط التقويم

    var titleElement = document.getElementById('eventTitle');

    if (titleElement) {

        var eventsData = {

            '1': {
                title: 'نادي اللغة الأجنبية',
                category: 'ثقافة',
                badge: 'bg-primary',
                date: '1 تشرين الثاني 2026',
                calDate: '20261101',
                time: '5:00 مساءً',
                location: 'أونلاين',
                description: 'فعالية طلابية لدعم مهارات المحادثة باللغة الإنكليزية والتدرب عليها ضمن أجواء تفاعلية.',
                image: 'assets/img/english.jpeg'
            },

            '2': {
                title: 'كورس خوارزميات مكعب الروبك',
                category: 'رياضة',
                badge: 'bg-success',
                date: '2 تشرين الثاني 2026',
                calDate: '20261102',
                time: '5:00 مساءً',
                location: 'المزة',
                description: 'كورس تفاعلي للتعرف على خوارزميات حل مكعب الروبك وتنمية التفكير المنطقي وحل المشكلات.',
                image: 'assets/img/robic.jpeg'
            },

            '3': {
                title: 'البرمجة وبناء التطبيقات بلغة بايثون',
                category: 'تقنية',
                badge: 'bg-danger',
                date: '3 تشرين الثاني 2026',
                calDate: '20261103',
                time: '5:00 مساءً',
                location: 'المزة',
                description: 'فعالية تعليمية للتعرف على أساسيات البرمجة بلغة بايثون وكيفية استخدامها في بناء التطبيقات.',
                image: 'assets/img/python.png'
            },

            '4': {
                title: 'مسابقة الإنتاج الموسيقي والهندسة الصوتية',
                category: 'موسيقى',
                badge: 'bg-warning text-dark',
                date: '4 تشرين الثاني 2026',
                calDate: '20261104',
                time: '5:00 مساءً',
                location: 'أونلاين',
                description: 'مسابقة للطلاب المهتمين بالإنتاج الموسيقي والتكنولوجيا الرقمية والهندسة الصوتية.',
                image: 'assets/img/mont.jpeg'
            },

            '5': {
                title: 'معرض التصميم الرقمي UI/UX',
                category: 'تقنية',
                badge: 'bg-danger',
                date: '4 كانون الثاني 2027',
                calDate: '20270104',
                time: '5:00 مساءً',
                location: 'أونلاين',
                description: 'معرض لعرض أفكار وتصاميم واجهات المواقع والتطبيقات وتجربة المستخدم.',
                image: 'assets/img/UI.jpeg'
            },

            '6': {
                title: 'التصميم الجرافيكي والبوسترات',
                category: 'فنون',
                badge: 'bg-art',
                date: '10 تشرين الثاني 2026',
                calDate: '20261110',
                time: '5:00 مساءً',
                location: 'أونلاين',
                description: 'فعالية تعرض أعمال التصميم الجرافيكي والبوسترات والملصقات الفنية والتوعوية.',
                image: 'assets/img/Grafic.jpeg'
            },

            '7': {
                title: 'معرض الذكاء الاصطناعي',
                category: 'تقنية',
                badge: 'bg-danger',
                date: '4 كانون الأول 2026',
                calDate: '20261204',
                time: '5:00 مساءً',
                location: 'أونلاين',
                description: 'معرض لاستعراض مشاريع وأفكار طلابية تستخدم تقنيات الذكاء الاصطناعي وتطبيقاته.',
                image: 'assets/img/AI.jpeg'
            }
        };


        // معرفة رقم الفعالية من الرابط (الافتراضي 1)
        var eventId = getUrlParam('id') || '1';
        var selectedEvent = eventsData[eventId];

        var actionMessage = document.getElementById('eventActionMessage');

        function showEventMessage(text, type) {
            if (actionMessage) {
                actionMessage.textContent = text;
                actionMessage.className = 'alert alert-' + type + ' mt-3 mb-0';
            }
        }

        function setText(id, value) {
            var element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        }

        if (selectedEvent) {

            // عرض بيانات الفعالية
            setText('eventTitle', selectedEvent.title);
            setText('eventCategory', selectedEvent.category);
            setText('eventDate', selectedEvent.date);
            setText('eventTime', selectedEvent.time);
            setText('eventLocation', selectedEvent.location);
            setText('eventDescription', selectedEvent.description);
            document.title = selectedEvent.title + ' | دليل فعاليات SVU';

            // لون شارة التصنيف حسب نوع الفعالية
            document.getElementById('eventCategory').className = 'badge mb-2 ' + selectedEvent.badge;

            if (selectedEvent.location == 'أونلاين') {
                setText('mapLocationLabel', 'الفعالية أونلاين، والخريطة توضح مقر الجامعة الافتراضية السورية في دمشق.');
            } else {
                setText('mapLocationLabel', 'موقع الفعالية: ' + selectedEvent.location + ' - دمشق.');
            }

            // الصورة الرئيسية
            var eventImage = document.getElementById('eventImage');

            if (eventImage) {
                eventImage.src = selectedEvent.image;
                eventImage.alt = selectedEvent.title;
            }

            // معرض الصور: لكل فعالية 3 صور باسم eventX-1.jpg و eventX-2.jpg و eventX-3.jpg
            for (var g = 1; g <= 3; g++) {

                var galleryImg = document.getElementById('galleryImg' + g);

                if (galleryImg) {
                    galleryImg.src = 'assets/img/gallery/event' + eventId + '-' + g + '.jpg';
                    galleryImg.alt = selectedEvent.title + ' - صورة ' + g;
                }
            }


            // 5. التسجيل في الفعالية
            var registerButton = document.getElementById('registerEventBtn');

            if (registerButton) {

                registerButton.addEventListener('click', function () {

                    showEventMessage('تم تسجيل طلبك بالفعالية: ' + selectedEvent.title, 'success');

                    registerButton.innerHTML = '<i class="bi bi-check-circle"></i> تم التسجيل';
                    registerButton.disabled = true;
                });
            }


            // 6. زر أضف للتقويم: رابط Google Calendar جاهز بعنوان وموعد الفعالية
            // الوقت من 5 إلى 7 مساءً بتوقيت دمشق
            var calendarBtn = document.getElementById('calendarBtn');

            if (calendarBtn) {

                var calendarLink = 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
                    '&text=' + encodeURIComponent(selectedEvent.title) +
                    '&dates=' + selectedEvent.calDate + 'T170000/' + selectedEvent.calDate + 'T190000' +
                    '&ctz=Asia/Damascus' +
                    '&details=' + encodeURIComponent(selectedEvent.description) +
                    '&location=' + encodeURIComponent(selectedEvent.location);

                calendarBtn.href = calendarLink;
            }


            // 7. زر شارك: نسخ رابط الصفحة الحالية
            var shareBtn = document.getElementById('shareBtn');

            if (shareBtn) {

                shareBtn.addEventListener('click', function () {

                    var pageLink = window.location.href;

                    if (navigator.clipboard) {

                        navigator.clipboard.writeText(pageLink).then(function () {
                            showEventMessage('تم نسخ رابط الفعالية، يمكنك مشاركته الآن.', 'info');
                        });

                    } else {
                        // في حال كان المتصفح لا يدعم النسخ التلقائي
                        prompt('انسخ رابط الفعالية:', pageLink);
                    }
                });
            }


            // 8. فعاليات ذات صلة: نعرض فعاليات من نفس التصنيف أولاً ثم نكمل حتى 3 فعاليات
            var relatedBox = document.getElementById('relatedEvents');

            if (relatedBox) {

                var relatedIds = [];

                for (var id in eventsData) {
                    if (id != eventId && eventsData[id].category == selectedEvent.category) {
                        relatedIds.push(id);
                    }
                }

                for (var id2 in eventsData) {
                    if (relatedIds.length < 3 && id2 != eventId && relatedIds.indexOf(id2) == -1) {
                        relatedIds.push(id2);
                    }
                }

                var html = '';

                for (var r = 0; r < relatedIds.length && r < 3; r++) {

                    var ev = eventsData[relatedIds[r]];

                    html += '<div class="col-md-4">' +
                        '<div class="card h-100">' +
                        '<img src="' + ev.image + '" class="card-img-top related-img" alt="' + ev.title + '">' +
                        '<div class="card-body d-flex flex-column">' +
                        '<span class="badge mb-2 align-self-start ' + ev.badge + '">' + ev.category + '</span>' +
                        '<h3 class="h6 fw-bold">' + ev.title + '</h3>' +
                        '<p class="small text-muted">📅 ' + ev.date + '</p>' +
                        '<a href="event.html?id=' + relatedIds[r] + '" class="btn btn-sm btn-outline-primary mt-auto">عرض التفاصيل</a>' +
                        '</div></div></div>';
                }

                relatedBox.innerHTML = html;
            }

        } else {

            titleElement.textContent = 'الفعالية غير موجودة';
            setText('eventDescription', 'لم يتم العثور على الفعالية المطلوبة. يرجى العودة إلى صفحة الفعاليات.');
        }
    }

});
