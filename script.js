/* ============================================
   Dayıoğlu Yol Yardım - Main JavaScript
   ============================================ */

// ⚠️ TELEFON NUMARANIZI BURAYA GİRİN (başında 90 ile, boşluksuz)
const PHONE_NUMBER = '905510326468';

// İzmir İlçeleri
const DISTRICTS = [
    'Aliağa', 'Balçova', 'Bayındır', 'Bayraklı', 'Bergama',
    'Beydağ', 'Bornova', 'Buca', 'Çeşme', 'Çiğli',
    'Dikili', 'Foça', 'Gaziemir', 'Güzelbahçe', 'Karabağlar',
    'Karaburun', 'Karşıyaka', 'Kemalpaşa', 'Kınık', 'Kiraz',
    'Konak', 'Menderes', 'Menemen', 'Narlıdere', 'Ödemiş',
    'Seferihisar', 'Selçuk', 'Tire', 'Torbalı', 'Urla'
];

// DOM Elements
const districtGrid = document.getElementById('districtGrid');
const searchInput = document.getElementById('searchInput');
const noResult = document.getElementById('noResult');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalDistrict = document.getElementById('modalDistrict');
const whatsappBtn = document.getElementById('whatsappBtn');
const callBtn = document.getElementById('callBtn');
const headerPhone = document.getElementById('headerPhone');

// Set phone links
headerPhone.href = `tel:+${PHONE_NUMBER}`;
callBtn.href = `tel:+${PHONE_NUMBER}`;

// Render Districts
function renderDistricts(filter = '') {
    const filtered = DISTRICTS.filter(d =>
        d.toLocaleLowerCase('tr').includes(filter.toLocaleLowerCase('tr'))
    );

    districtGrid.innerHTML = '';
    noResult.style.display = filtered.length === 0 ? 'block' : 'none';

    filtered.forEach((district, i) => {
        const card = document.createElement('div');
        card.className = 'district-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.style.animationDelay = `${i * 0.03}s`;
        card.innerHTML = `<span>${district}</span>`;

        card.addEventListener('click', () => openModal(district));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(district);
            }
        });

        districtGrid.appendChild(card);
    });
}

// Search
searchInput.addEventListener('input', (e) => {
    renderDistricts(e.target.value.trim());
});

// Modal
let currentDistrict = '';

function updateWhatsAppLink() {
    if (!currentDistrict) return;
    const selectedVehicle = document.querySelector('input[name="vehicleType"]:checked').value;
    const statusNode = document.querySelector('input[name="vehicleStatus"]:checked');
    const selectedStatus = statusNode ? statusNode.value : 'Arızalı';
    
    const message = encodeURIComponent(
        `Merhaba, ${currentDistrict} ilçesinden ${selectedStatus} durumdaki ${selectedVehicle} aracım için hizmet talep ediyorum. Yardımcı olabilir misiniz?`
    );
    whatsappBtn.href = `https://wa.me/${PHONE_NUMBER}?text=${message}`;
}

document.body.addEventListener('change', (e) => {
    if (e.target.name === 'vehicleType' || e.target.name === 'vehicleStatus') {
        updateWhatsAppLink();
    }
});

function openModal(district) {
    currentDistrict = district;
    modalDistrict.textContent = `📍 ${district} / İzmir`;
    updateWhatsAppLink();

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(() => {
        modalOverlay.querySelector('.modal').style.willChange = 'transform';
    });
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

// Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// Touch feedback for district cards (mobile)
document.addEventListener('touchstart', (e) => {
    const card = e.target.closest('.district-card');
    if (card) card.style.transform = 'scale(0.96)';
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const card = e.target.closest('.district-card');
    if (card) card.style.transform = '';
}, { passive: true });

// Header shadow on scroll
const header = document.querySelector('.header');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            if (window.scrollY > 20) {
                header.style.boxShadow = '0 4px 24px rgba(0,0,0,0.3)';
            } else {
                header.style.boxShadow = 'none';
            }
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// Floating CTA -> smooth scroll to districts
const floatingCta = document.getElementById('floatingCta');
floatingCta.addEventListener('click', () => {
    document.getElementById('districts').scrollIntoView({ behavior: 'smooth' });
});

// Init
renderDistricts();

// Scroll Reveal Observer
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(element => revealObserver.observe(element));
}

initScrollReveal();

// Testimonials Carousel Navigation
function initTestimonialsCarousel() {
    const grid = document.getElementById('testimonialsGrid');
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    
    if (!grid || !prevBtn || !nextBtn) return;
    
    function getScrollAmount() {
        const firstCard = grid.querySelector('.testimonial-card');
        if (firstCard) {
            return firstCard.offsetWidth + 16; // Card width + gap
        }
        return 300;
    }
    
    prevBtn.addEventListener('click', () => {
        grid.scrollBy({
            left: -getScrollAmount(),
            behavior: 'smooth'
        });
    });
    
    nextBtn.addEventListener('click', () => {
        grid.scrollBy({
            left: getScrollAmount(),
            behavior: 'smooth'
        });
    });

    function updateButtonVisibility() {
        const scrollLeft = grid.scrollLeft;
        const maxScroll = grid.scrollWidth - grid.clientWidth;
        
        if (scrollLeft <= 5) {
            prevBtn.style.opacity = '0.3';
            prevBtn.style.pointerEvents = 'none';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.pointerEvents = 'auto';
        }
        
        if (scrollLeft >= maxScroll - 5) {
            nextBtn.style.opacity = '0.3';
            nextBtn.style.pointerEvents = 'none';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.pointerEvents = 'auto';
        }
    }
    
    updateButtonVisibility();
    grid.addEventListener('scroll', updateButtonVisibility, { passive: true });
    window.addEventListener('resize', updateButtonVisibility, { passive: true });
}

initTestimonialsCarousel();

// ============================================
// SSS (FAQ) Accordion
// ============================================
function initFAQ() {
    const items = document.querySelectorAll('.faq-item');
    items.forEach(item => {
        const btn = item.querySelector('.faq-question');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            // Hepsini kapat
            items.forEach(i => i.classList.remove('open'));
            // Tıklanan kapalıysa aç
            if (!isOpen) item.classList.add('open');
        });
    });
}
initFAQ();

// ============================================
// Fleet (Araç Filosu) Carousel Navigation
// ============================================
function initFleetCarousel() {
    const grid = document.getElementById('fleetGrid');
    const prevBtn = document.getElementById('prevFleet');
    const nextBtn = document.getElementById('nextFleet');

    if (!grid || !prevBtn || !nextBtn) return;

    function getScrollAmount() {
        const firstCard = grid.querySelector('.fleet-card');
        return firstCard ? firstCard.offsetWidth + 16 : 320;
    }

    prevBtn.addEventListener('click', () => {
        grid.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        grid.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });

    function updateVisibility() {
        const scrollLeft = grid.scrollLeft;
        const maxScroll = grid.scrollWidth - grid.clientWidth;

        prevBtn.style.opacity = scrollLeft <= 5 ? '0.3' : '1';
        prevBtn.style.pointerEvents = scrollLeft <= 5 ? 'none' : 'auto';

        nextBtn.style.opacity = scrollLeft >= maxScroll - 5 ? '0.3' : '1';
        nextBtn.style.pointerEvents = scrollLeft >= maxScroll - 5 ? 'none' : 'auto';
    }

    updateVisibility();
    grid.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility, { passive: true });
}
initFleetCarousel();



// ============================================
// İstatistik Sayaç Animasyonu
// ============================================
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target) || target === 0) return;
    const duration = 2000;
    const startTime = performance.now();

    function easeOutExpo(t) {
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const current = Math.round(easedProgress * target);
        el.textContent = current;
        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            el.textContent = target;
        }
    }
    requestAnimationFrame(tick);
}

function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
}
initStatCounters();
// ============================================
// 3D Tilt Effect for Service Cards
// ============================================
function init3DTilt() {
    const cards = document.querySelectorAll('.service-card');
    if (!cards.length) return;

    // Check if the device has a pointer / supports hover
    if (window.matchMedia('(hover: hover)').matches) {
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Rotation angles (max 8 degrees for smooth tilt)
                const rotateX = ((centerY - y) / centerY) * 8;
                const rotateY = ((x - centerX) / centerX) * 8;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
                card.style.transition = 'none';
                card.style.boxShadow = `${-rotateY * 1.5}px ${rotateX * 1.5}px 25px rgba(245, 158, 11, 0.12), var(--shadow-glow)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
                card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease';
                card.style.boxShadow = '';
            });
        });
    }
}
init3DTilt();

// ============================================
// Interactive Towing Winch Cable & Car Scroll Animation
// ============================================
function initTowingScrollAnimation() {
    const towedCar = document.getElementById('towedCar');
    const winchCable = document.getElementById('winchCable');
    if (!towedCar || !winchCable) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        // Limit the effect within the first 800px of scrolling
        const limit = 800;
        const ratio = Math.min(scrollY / limit, 1);

        // Move the car closer to the winch wall (up to 5.5px forward)
        const dX = ratio * 5.5;
        towedCar.style.transform = `translate3d(${dX}px, 0, 0)`;

        // Adjust winch cable connection point (85 + dX)
        winchCable.setAttribute('x2', (85 + dX).toFixed(2));
        
        // Increase winch cable thickness (tension indicator) and add glowing red pulse on scroll
        const strokeWidth = (1.2 + ratio * 0.8).toFixed(2);
        winchCable.setAttribute('stroke-width', strokeWidth);
        winchCable.setAttribute('stroke', `rgb(${148 + Math.round(ratio * (239 - 148))}, ${163 - Math.round(ratio * (163 - 68))}, ${184 - Math.round(ratio * (184 - 68))})`); // Shift from slate (#94a3b8) to bright red (#ef4444)
    }, { passive: true });
}
// ============================================
// Apple-Style 3D Storytelling Animation (Horizontal)
// ============================================
function initStoryAnimation() {
    const container = document.getElementById('storyScrollContainer');
    if (!container) return;
    
    const brokenCar = document.getElementById('storyBrokenCar');
    const towTruck = document.getElementById('storyTowTruck');
    const winchCable = document.getElementById('storyWinchCable');
    const smoke1 = document.querySelector('.story-smoke-1');
    const smoke2 = document.querySelector('.story-smoke-2');

    container.addEventListener('scroll', () => {
        const maxScroll = container.scrollWidth - container.clientWidth;
        if(maxScroll <= 0) return;
        
        let progress = container.scrollLeft / maxScroll;
        progress = Math.max(0, Math.min(progress, 1));

        if (progress <= 0.5) {
            let p = progress / 0.5;
            
            if(smoke1 && smoke2) {
                smoke1.style.opacity = p * 0.4;
                smoke2.style.opacity = p * 0.3;
            }
            
            const truckX = -400 + (p * 680);
            towTruck.setAttribute('transform', `translate(${truckX}, 200)`);
            brokenCar.setAttribute('transform', `translate(550, 240) rotate(0)`);
            winchCable.setAttribute('x2', 235);
            winchCable.setAttribute('y2', 65);
            
        } else {
            let p = (progress - 0.5) / 0.5;
            
            let truckX = 280;
            let carX = 550;
            let carY = 240;

            if (p < 0.4) {
                const cableExt = p / 0.4;
                winchCable.setAttribute('x2', 235 + cableExt * 190);
                winchCable.setAttribute('y2', 65 + cableExt * 25);
                brokenCar.setAttribute('transform', `translate(${carX}, ${carY}) rotate(0)`);
                towTruck.setAttribute('transform', `translate(${truckX}, 200)`);
            } else {
                const pull = (p - 0.4) / 0.6;
                winchCable.setAttribute('x2', 235 + (1 - pull) * 190);
                winchCable.setAttribute('y2', 65 + (1 - pull) * 25);
                
                carX = 550 - pull * 230;
                carY = 240 - pull * 45;
                brokenCar.setAttribute('transform', `translate(${carX}, ${carY}) rotate(${-pull * 6})`);
                towTruck.setAttribute('transform', `translate(${truckX}, 200)`);
            }
        }
    }, { passive: true });

    // Arrow navigation
    const prevBtn = document.getElementById('storyPrevBtn');
    const nextBtn = document.getElementById('storyNextBtn');
    
    if(prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            container.scrollBy({ left: -container.clientWidth, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            container.scrollBy({ left: container.clientWidth, behavior: 'smooth' });
        });
        
        container.addEventListener('scroll', () => {
            const maxScroll = container.scrollWidth - container.clientWidth;
            prevBtn.style.opacity = container.scrollLeft <= 10 ? '0' : '1';
            prevBtn.style.pointerEvents = container.scrollLeft <= 10 ? 'none' : 'auto';
            
            nextBtn.style.opacity = container.scrollLeft >= maxScroll - 10 ? '0' : '1';
            nextBtn.style.pointerEvents = container.scrollLeft >= maxScroll - 10 ? 'none' : 'auto';
        }, { passive: true });
        
        // Initial state
        prevBtn.style.opacity = '0';
        prevBtn.style.pointerEvents = 'none';
    }
}
initStoryAnimation();

// ============================================
// Active Trucks Simulation
// ============================================
function initActiveTrucks() {
    const countEl = document.getElementById('activeTruckCount');
    if(!countEl) return;
    
    // Initial random number between 3 and 6
    let currentCount = Math.floor(Math.random() * 4) + 3;
    countEl.innerText = currentCount;

    setInterval(() => {
        // Change by -1, 0, or 1
        let diff = Math.floor(Math.random() * 3) - 1; 
        let newCount = currentCount + diff;
        
        // Keep within believable limits (2 to 8)
        if(newCount < 2) newCount = 2;
        if(newCount > 8) newCount = 8;
        
        if(newCount !== currentCount) {
            currentCount = newCount;
            
            // Pop animation
            countEl.style.transform = 'scale(1.5)';
            countEl.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            countEl.style.color = '#fff';
            
            setTimeout(() => {
                countEl.innerText = currentCount;
            }, 150);
            
            setTimeout(() => {
                countEl.style.transform = 'scale(1)';
                countEl.style.color = 'var(--amber-500)';
            }, 400);
        }
    }, 15000 + Math.random() * 20000); // Check every 15-35 seconds
}
initActiveTrucks();

// ============================================
// Tahmini Fiyat ve Mesafe Hesaplayıcı
// ============================================

const DISTRICT_COORDS = {
    'Aliağa': { lat: 38.7994, lon: 26.9747 },
    'Balçova': { lat: 38.3881, lon: 27.0450 },
    'Bayındır': { lat: 38.2173, lon: 27.6469 },
    'Bayraklı': { lat: 38.4633, lon: 27.1856 },
    'Bergama': { lat: 39.1206, lon: 27.1800 },
    'Beydağ': { lat: 38.0833, lon: 28.2167 },
    'Bornova': { lat: 38.4658, lon: 27.2185 },
    'Buca': { lat: 38.3842, lon: 27.1708 },
    'Çeşme': { lat: 38.3233, lon: 26.3067 },
    'Çiğli': { lat: 38.4878, lon: 27.0603 },
    'Dikili': { lat: 39.0717, lon: 26.8906 },
    'Foça': { lat: 38.6703, lon: 26.7561 },
    'Gaziemir': { lat: 38.3253, lon: 27.1306 },
    'Güzelbahçe': { lat: 38.3619, lon: 26.8872 },
    'Karabağlar': { lat: 38.3644, lon: 27.1333 },
    'Karaburun': { lat: 38.6364, lon: 26.5161 },
    'Karşıyaka': { lat: 38.4542, lon: 27.1147 },
    'Kemalpaşa': { lat: 38.4264, lon: 27.4161 },
    'Kınık': { lat: 39.0833, lon: 27.3833 },
    'Kiraz': { lat: 38.2325, lon: 28.2047 },
    'Konak': { lat: 38.4189, lon: 27.1286 },
    'Menderes': { lat: 38.2514, lon: 27.1350 },
    'Menemen': { lat: 38.6019, lon: 27.0700 },
    'Narlıdere': { lat: 38.3917, lon: 26.9850 },
    'Ödemiş': { lat: 38.2311, lon: 27.9731 },
    'Seferihisar': { lat: 38.1969, lon: 26.8378 },
    'Selçuk': { lat: 37.9483, lon: 27.3686 },
    'Tire': { lat: 38.0886, lon: 27.7328 },
    'Torbalı': { lat: 38.1517, lon: 27.3611 },
    'Urla': { lat: 38.3228, lon: 26.7644 }
};

function initCalculator() {
    const calcFrom = document.getElementById('calcFrom');
    const calcTo = document.getElementById('calcTo');
    const calcBtn = document.getElementById('calcBtn');
    const calcResult = document.getElementById('calcResult');
    const calcPriceValue = document.getElementById('calcPriceValue');
    const calcWhatsappBtn = document.getElementById('calcWhatsappBtn');

    if (!calcFrom || !calcTo) return;

    // Populate dropdowns alphabetically
    Object.keys(DISTRICT_COORDS).sort((a,b) => a.localeCompare(b, 'tr')).forEach(district => {
        calcFrom.add(new Option(district, district));
        calcTo.add(new Option(district, district));
    });

    // Haversine formula
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
        return R * c; // Distance in km
    }

    calcBtn.addEventListener('click', async () => {
        const fromVal = calcFrom.value;
        const toVal = calcTo.value;
        const calcVehicleType = document.getElementById('calcVehicleType');
        const vehicleType = calcVehicleType ? calcVehicleType.value : 'binek';
        let vehicleTypeName = 'Binek Araç';
        if (vehicleType === 'suv') vehicleTypeName = 'SUV / Panelvan / Ticari';
        else if (vehicleType === 'moto') vehicleTypeName = 'Motosiklet';

        if (!fromVal || !toVal) {
            alert('Lütfen alınacak ve gidilecek ilçeyi seçin.');
            return;
        }

        const fromCoord = DISTRICT_COORDS[fromVal];
        const toCoord = DISTRICT_COORDS[toVal];

        calcBtn.innerText = 'Hesaplanıyor...';
        calcBtn.disabled = true;

        let distanceKm = 0;

        if (fromVal === toVal) {
            // Aynı ilçe içi tahmini ortalama hareket mesafesi
            distanceKm = 10; 
        } else {
            try {
                // OSRM API Request (lon,lat format)
                const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${fromCoord.lon},${fromCoord.lat};${toCoord.lon},${toCoord.lat}?overview=false`;
                const response = await fetch(osrmUrl);
                const data = await response.json();

                if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                    distanceKm = data.routes[0].distance / 1000; // meters to km
                } else {
                    throw new Error('Route not found');
                }
            } catch (error) {
                console.warn('OSRM API hatası, kuş uçuşu formülü kullanılıyor.', error);
                // Fallback: Haversine * 1.4 for driving winding factor
                distanceKm = getDistanceFromLatLonInKm(fromCoord.lat, fromCoord.lon, toCoord.lat, toCoord.lon) * 1.4;
            }
        }

        // Fiyat Hesaplama: km başı 30 TL + 1000 TL her zaman eklenecek sabit ücret
        const PER_KM_PRICE = 30;
        const BASE_FEE = 1000;
        let basePrice = Math.round(distanceKm * PER_KM_PRICE) + BASE_FEE;
        
        // Araç Tipi Çarpanı (SUV için +%20. Motosiklet ve Binek için değişiklik yok)
        if (vehicleType === 'suv') {
            basePrice = Math.round(basePrice * 1.2);
        }
        
        const minPrice = Math.ceil((basePrice * 0.9) / 50) * 50; // %10 aşağı, 50'nin katına yuvarla
        const maxPrice = Math.ceil((basePrice * 1.1) / 50) * 50; // %10 yukarı, 50'nin katına yuvarla

        // Sonuçları göster
        calcPriceValue.innerText = `${minPrice} TL - ${maxPrice} TL`;
        
        // WhatsApp linki güncelle
        const waMsg = encodeURIComponent(`Merhaba, ${fromVal} ilçesinden ${toVal} ilçesine çekici hizmeti almak istiyorum. Araç Tipi: ${vehicleTypeName}. Sisteminizin verdiği tahmini fiyat aralığı: ${minPrice} TL - ${maxPrice} TL. Yardımcı olabilir misiniz?`);
        calcWhatsappBtn.href = `https://wa.me/${PHONE_NUMBER}?text=${waMsg}`;

        calcResult.style.display = 'block';
        calcBtn.innerText = 'Fiyat Hesapla';
        calcBtn.disabled = false;
        
        // Scroll to result smoothly
        setTimeout(() => {
            calcResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    });
}
initCalculator();

// ============================================
// Splash Screen
// ============================================
(function initSplash() {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;
    setTimeout(() => {
        splash.classList.add('hide');
        setTimeout(() => splash.remove(), 600);
    }, 1200);
})();

// ============================================
// Live Badge (Saat Bazlı Durum Mesajı)
// ============================================
(function initLiveBadge() {
    const badge = document.getElementById('liveBadgeText');
    if (!badge) return;

    function updateBadge() {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) {
            badge.textContent = '☀️ Sabah Ekibimiz Aktif';
        } else if (hour >= 12 && hour < 18) {
            badge.textContent = '☀️ Gündüz Ekibimiz Sahada';
        } else if (hour >= 18 && hour < 22) {
            badge.textContent = '🌆 Akşam Ekibimiz Aktif';
        } else {
            badge.textContent = '🌙 Gece Ekibimiz Aktif';
        }
    }
    updateBadge();
    setInterval(updateBadge, 60000);
})();

// ============================================
// Son 24 Saatte Kurtarılan Araç Sayısı
// ============================================
(function initDailyRescue() {
    const el = document.getElementById('dailyRescueCount');
    if (!el) return;

    // Günün seed'ine göre tutarlı "rastgele" sayı (aynı gün hep aynı)
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const count = 8 + (seed % 9); // 8-16 arası
    el.setAttribute('data-target', count.toString());
})();

// ============================================
// Aktif Bölüm Vurgusu (Section Glow on Scroll)
// ============================================
(function initSectionGlow() {
    const titles = document.querySelectorAll('.section-title');
    if (!titles.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-active');
            } else {
                entry.target.classList.remove('section-active');
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-10% 0px -10% 0px'
    });

    titles.forEach(title => observer.observe(title));
})();

// ============================================
// Parallax Scroll Efekti (Hero)
// ============================================
(function initParallax() {
    const hero = document.querySelector('.hero');
    const truckWrapper = document.querySelector('.hero-truck-wrapper');
    const heroTitle = document.querySelector('.hero-title');
    const heroDesc = document.querySelector('.hero-desc');
    const bgAnimation = document.querySelector('.bg-animation');

    if (!hero || !truckWrapper) return;

    let ticking = false;

    function onScroll() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const heroHeight = hero.offsetHeight;

            // Sadece hero görünürken uygula
            if (scrollY < heroHeight) {
                const ratio = scrollY / heroHeight;

                // Çekici daha yavaş hareket eder (derinlik hissi)
                truckWrapper.style.transform = `translateY(${scrollY * 0.3}px)`;
                truckWrapper.style.opacity = 1 - ratio * 0.8;

                // Başlık ve açıklama daha hızlı kayar
                if (heroTitle) heroTitle.style.transform = `translateY(${scrollY * 0.15}px)`;
                if (heroDesc) heroDesc.style.transform = `translateY(${scrollY * 0.1}px)`;

                // Arka plan çizgileri en yavaş
                if (bgAnimation) bgAnimation.style.transform = `translateY(${scrollY * 0.05}px)`;
            }
            ticking = false;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
})();

// ============================================
// Lazy Loading Observer (Görsel & SVG Optimizasyonu)
// ============================================
(function initLazyLoad() {
    // data-src olan görselleri lazy load et
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // data-src varsa src'ye aktar
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.add('lazy-loaded');
                    obs.unobserve(img);
                }
            });
        }, {
            rootMargin: '200px 0px' // 200px önceden yüklemeye başla
        });

        lazyImages.forEach(img => imgObserver.observe(img));
    }

    // Ağır SVG section'ları gecikmeli render et
    const heavySections = document.querySelectorAll('.story-horizontal-section, .fleet-section');
    
    if (heavySections.length && 'IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('section-loaded');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '300px 0px'
        });

        heavySections.forEach(section => {
            section.classList.add('section-deferred');
            sectionObserver.observe(section);
        });
    }
})();

// ============================================
// Pull to Refresh (Mobil için)
// ============================================
(function initPullToRefresh() {
    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    const threshold = 100; // Ne kadar çekilirse yenilenecek
    
    const ptrContainer = document.getElementById('ptrContainer');
    if (!ptrContainer) return;

    window.addEventListener('touchstart', e => {
        if (window.scrollY === 0) {
            startY = e.touches[0].clientY;
            isPulling = true;
        }
    }, { passive: true });

    window.addEventListener('touchmove', e => {
        if (!isPulling) return;
        currentY = e.touches[0].clientY;
        const diff = currentY - startY;

        if (diff > 0 && window.scrollY === 0) {
            // Aşağı çekiliyor
            const moveY = Math.min(diff * 0.4, threshold); // Direnç ekledik
            ptrContainer.style.transform = `translateY(${moveY - 80}px)`; // 80px kendi boyu
            ptrContainer.classList.add('ptr-active');
            
            if (diff > threshold) {
                ptrContainer.classList.add('ptr-loading');
            } else {
                ptrContainer.classList.remove('ptr-loading');
            }
        }
    }, { passive: true });

    window.addEventListener('touchend', e => {
        if (!isPulling) return;
        isPulling = false;
        
        const diff = currentY - startY;
        
        if (diff > threshold && window.scrollY === 0) {
            // Yeterince çekildi, sayfayı yenile
            ptrContainer.style.transform = `translateY(0px)`;
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } else {
            // İptal edildi, geri sar
            ptrContainer.style.transform = `translateY(-100%)`;
            ptrContainer.classList.remove('ptr-active', 'ptr-loading');
        }
    });
})();
