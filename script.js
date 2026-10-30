/* ==========================================
   1. PRELOADER SEQUENCE & HASH RESTORATION
========================================== */
(function initPreloader() {
    const preloader = document.getElementById('preloader');
    const countEl = document.getElementById('preloaderCount');
    const barEl = document.getElementById('preloaderBar');
    if (!preloader || !countEl || !barEl) return;

    // If returning from works-*.html or arriving with a hash, immediately mark #preloader as is-loaded without showing it
    if (document.documentElement.classList.contains('skip-preloader') || window.location.hash || /works-/i.test(document.referrer)) {
        preloader.style.transition = 'none';
        preloader.style.display = 'none';
        preloader.classList.add('is-loaded');

        const targetEl = window.location.hash ? document.querySelector(window.location.hash) : null;
        if (targetEl) {
            const revealEls = document.querySelectorAll('.reveal');
            revealEls.forEach((el) => {
                el.style.transition = 'none';
                el.classList.add('is-visible');
            });

            if (window.location.hash.startsWith('#work-')) {
                document.body.classList.add('theme-dark');
            }

            // Eagerly load images in the works section so they are ready during zoom-in return
            document.querySelectorAll('.works img').forEach((img) => {
                img.loading = 'eager';
            });

            // Position viewport directly at the target <a> block while at scale(1)
            targetEl.scrollIntoView({ behavior: 'instant', block: 'center' });

            // Compute unscaled center of the target <a> block for zoom-return origin
            const savedScrollY = window.scrollY;
            const rect = targetEl.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const pageCenterX = centerX + window.scrollX;
            const pageCenterY = centerY + savedScrollY;

            const root = document.documentElement;
            root.style.setProperty('--zoom-origin-x', `${centerX}px`);
            root.style.setProperty('--zoom-origin-y', `${centerY}px`);
            root.style.setProperty('--zoom-page-x', `${pageCenterX}px`);
            root.style.setProperty('--zoom-page-y', `${pageCenterY}px`);

            // Lock initial zoomed-in (scale 4.2) & transparent state on <html> before first paint
            root.classList.add('is-zoom-returning-init');
            root.classList.remove('is-zoom-returning-prep');
            void root.offsetHeight;

            // Keep centered scroll position and trigger the 1.6s shrink-down + fade-in transition after paint
            requestAnimationFrame(() => {
                window.scrollTo({ top: savedScrollY, behavior: 'instant' });
                revealEls.forEach((el) => {
                    el.style.transition = '';
                });

                requestAnimationFrame(() => {
                    window.scrollTo({ top: savedScrollY, behavior: 'instant' });
                    root.classList.add('is-zoom-returning-active');
                });
            });

            setTimeout(() => {
                root.classList.remove('is-zoom-returning-prep', 'is-zoom-returning-init', 'is-zoom-returning-active');
            }, 1720);
        }
        return;
    }

    let progress = 0;

    const timer = setInterval(() => {
        progress += Math.floor(Math.random() * 14) + 6;
        if (progress >= 100) {
            progress = 100;
            clearInterval(timer);
            setTimeout(() => {
                preloader.classList.add('is-loaded');
            }, 280);
        }
        countEl.textContent = String(progress).padStart(2, '0');
        barEl.style.width = progress + '%';
    }, 60);
})();

/* ==========================================
   2. HERO TYPEWRITER
========================================== */
(function initHeroEffects() {
    const titleElement = document.getElementById('typewriter-title');
    if (!titleElement) return;
    const textArray = [
        'JOINJO <span>STUDIO</span>',
        'UI <span>DESIGNER</span>',
        'FRONT-END <span>DEVELOPER</span>'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentText = textArray[textIndex];
        const speed = isDeleting ? 55 : 110;
        titleElement.innerHTML = currentText.substring(0, charIndex);

        if (!isDeleting && charIndex === currentText.length) {
            setTimeout(() => { isDeleting = true; }, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
        }
        charIndex += isDeleting ? -1 : 1;
        setTimeout(type, speed);
    }
    setTimeout(type, 1000);
})();

/* ==========================================
   3. CUSTOM MAGNETIC CURSOR
========================================== */
(function initCursor() {
    const pill = document.getElementById('cursorPill');
    const text = document.getElementById('cursorText');
    if (!pill || !text) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let pillX = mouseX;
    let pillY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function renderCursor() {
        pillX += (mouseX - pillX) * 0.16;
        pillY += (mouseY - pillY) * 0.16;
        pill.style.transform = `translate3d(${pillX}px, ${pillY}px, 0)`;
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    document.querySelectorAll('[data-cursor]').forEach((el) => {
        el.addEventListener('mouseenter', (e) => {
            const label = (el.getAttribute('data-cursor') || '').trim();
            if (label) {
                if (!pill.classList.contains('is-active')) {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                    pillX = e.clientX;
                    pillY = e.clientY;
                    pill.style.transform = `translate3d(${pillX}px, ${pillY}px, 0)`;
                }
                text.textContent = label;
                pill.classList.add('is-active');
            } else {
                text.textContent = '';
                pill.classList.remove('is-active');
            }
        });
        el.addEventListener('mouseleave', () => {
            pill.classList.remove('is-active');
        });
    });
})();

/* ==========================================
   4. SCROLL THEME MORPHING & REVEAL
========================================== */
(function initScrollObservers() {
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach((el) => revealObserver.observe(el));

    const themedSections = document.querySelectorAll('[data-theme]');
    const themeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const theme = entry.target.getAttribute('data-theme');
                document.body.classList.remove('theme-dark', 'theme-blue');
                if (theme === 'dark') document.body.classList.add('theme-dark');
                if (theme === 'blue') document.body.classList.add('theme-blue');
                window.currentLusionTheme = theme;
            }
        });
    }, { rootMargin: '-42% 0px -42% 0px' });

    themedSections.forEach((sec) => themeObserver.observe(sec));
})();

/* ==========================================
   5. 3D TILT & ZOOM PAGE TRANSITION ON WORK CARDS
========================================== */
(function initCardTilt() {
    document.querySelectorAll('.work-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            if (document.body.classList.contains('is-zoom-transitioning')) return;
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(1100px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-6px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Click zoom-and-fade transition for .works a
    let isTransitioning = false;
    document.querySelectorAll('.works a').forEach((link) => {
        link.addEventListener('click', (e) => {
            // Allow modifier clicks (new tab / window) to behave normally
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('javascript:')) return;

            e.preventDefault();
            if (isTransitioning) return;
            isTransitioning = true;

            // Reset card 3D tilt before measuring its bounding box center
            link.style.transform = '';
            const rect = link.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const pageCenterX = centerX + window.scrollX;
            const pageCenterY = centerY + window.scrollY;

            const root = document.documentElement;
            root.style.setProperty('--zoom-origin-x', `${centerX}px`);
            root.style.setProperty('--zoom-origin-y', `${centerY}px`);
            root.style.setProperty('--zoom-page-x', `${pageCenterX}px`);
            root.style.setProperty('--zoom-page-y', `${pageCenterY}px`);

            // Hide magnetic cursor pill immediately
            const pill = document.getElementById('cursorPill');
            if (pill) pill.classList.remove('is-active');

            // Trigger whole-page zoom & fade-out to #0a0b10
            document.body.classList.add('is-zoom-transitioning');

            setTimeout(() => {
                window.location.href = href;
            }, 950);
        });
    });

    // Restore page state if returning via browser Back/Forward cache (bfcache)
    window.addEventListener('pageshow', () => {
        isTransitioning = false;
        document.body.classList.remove('is-zoom-transitioning');
    });
})();

/* ==========================================
   6. SERVICES HORIZONTAL SLIDER & DRAG
========================================== */
(function initServicesCarousel() {
    const track = document.getElementById('servicesTrack');
    const viewport = document.getElementById('servicesViewport');
    const prevBtn = document.getElementById('servicePrev');
    const nextBtn = document.getElementById('serviceNext');
    if (!track || !viewport) return;

    let currentOffset = 0;

    function getMaxOffset() {
        return Math.max(0, track.scrollWidth - viewport.clientWidth);
    }

    function setOffset(val) {
        const max = getMaxOffset();
        currentOffset = Math.max(0, Math.min(val, max));
        track.style.transform = `translate3d(${-currentOffset}px, 0, 0)`;
        prevBtn.classList.toggle('active', currentOffset > 10);
        nextBtn.classList.toggle('active', currentOffset < max - 10);
    }

    function getStepSize() {
        const firstCard = track.querySelector('.service-card');
        if (firstCard && window.innerWidth <= 768) {
            return firstCard.offsetWidth + 16;
        }
        return Math.min(760, getMaxOffset());
    }

    nextBtn.addEventListener('click', () => {
        setOffset(currentOffset + getStepSize());
    });

    prevBtn.addEventListener('click', () => {
        setOffset(currentOffset - getStepSize());
    });

    let isDown = false;
    let startX = 0;
    let startOffset = 0;

    viewport.addEventListener('pointerdown', (e) => {
        isDown = true;
        startX = e.clientX;
        startOffset = currentOffset;
        track.style.transition = 'none';
    });

    window.addEventListener('pointermove', (e) => {
        if (!isDown) return;
        const dx = e.clientX - startX;
        setOffset(startOffset - dx);
    });

    window.addEventListener('pointerup', () => {
        if (!isDown) return;
        isDown = false;
        track.style.transition = 'transform 0.75s cubic-bezier(0.35, 0, 0.15, 1)';
    });

    window.addEventListener('resize', () => setOffset(currentOffset));
})();

/* ==========================================
   7. LUSION-STYLE REAL-TIME 3D PHYSICS SCENE
========================================== */
(function initLusionWebGL() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 13;

    // Cyberpunk Neon / Synthwave Studio Lighting (Electric Blue -> Purple -> Hot Pink)
    const ambientLight = new THREE.AmbientLight(0x1e1836, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00f0ff, 2.8);
    dirLight1.position.set(-9, 10, 8);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xff1e74, 2.6);
    dirLight2.position.set(9, -7, 6);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x8b2cf5, 2.8, 28);
    pointLight.position.set(0, 2, 7);
    scene.add(pointLight);

    // JoinJO.png Palette Materials: Electric Cyan-Blue, Luminous Purple, Hot Pink/Magenta, Cyber Obsidian
    const materials = [
        new THREE.MeshPhysicalMaterial({
            color: 0x00d8ff,
            emissive: 0x002b4d,
            roughness: 0.14,
            metalness: 0.22,
            clearcoat: 1.0,
            clearcoatRoughness: 0.08
        }),
        new THREE.MeshPhysicalMaterial({
            color: 0x7b2cbf,
            emissive: 0x220840,
            roughness: 0.16,
            metalness: 0.25,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1
        }),
        new THREE.MeshPhysicalMaterial({
            color: 0xff1e74,
            emissive: 0x450422,
            roughness: 0.15,
            metalness: 0.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.08
        }),
        new THREE.MeshPhysicalMaterial({
            color: 0x0d0f1d,
            roughness: 0.2,
            metalness: 0.65,
            clearcoat: 1.0
        })
    ];

    const group = new THREE.Group();
    scene.add(group);

    const spheres = [];
    const sphereGeo = new THREE.SphereGeometry(1, 36, 36);
    const count = 22;

    for (let i = 0; i < count; i++) {
        const mat = materials[i % materials.length];
        const mesh = new THREE.Mesh(sphereGeo, mat);
        const radius = 0.28 + Math.random() * 0.58;
        mesh.scale.setScalar(radius);

        const angle = (i / count) * Math.PI * 2;
        const spread = 1.6 + Math.random() * 3.2;
        const homeX = Math.cos(angle) * spread + (Math.random() - 0.5) * 1.2;
        const homeY = Math.sin(angle) * spread * 0.75 + (Math.random() - 0.5) * 1.2;
        const homeZ = (Math.random() - 0.5) * 2.5;

        mesh.position.set(homeX, homeY, homeZ);
        group.add(mesh);

        spheres.push({
            mesh,
            radius,
            home: new THREE.Vector3(homeX, homeY, homeZ),
            vel: new THREE.Vector3(),
            phase: Math.random() * Math.PI * 2,
            speed: 0.6 + Math.random() * 0.8
        });
    }

    const pointer3D = new THREE.Vector3(999, 999, 0);
    window.addEventListener('mousemove', (e) => {
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1;
        pointer3D.set(nx * 6.5, ny * 4.2, 0.5);
    });

    window.addEventListener('mouseleave', () => {
        pointer3D.set(999, 999, 0);
    });

    let scrollY = window.scrollY;
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    }, { passive: true });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        if (document.hidden) return;
        const t = clock.getElapsedTime();

        // Gentle scroll-linked rotation of the entire cluster
        group.rotation.y = scrollY * 0.00065 + Math.sin(t * 0.25) * 0.15;
        group.rotation.x = Math.cos(t * 0.2) * 0.1;
        group.position.x = window.innerWidth > 960 ? 1.8 : 0;

        // Spring + cursor repulsion + sphere-to-sphere soft collision
        for (let i = 0; i < spheres.length; i++) {
            const s = spheres[i];
            const pos = s.mesh.position;

            // Target home with organic breathing offset
            const targetX = s.home.x + Math.sin(t * s.speed + s.phase) * 0.35;
            const targetY = s.home.y + Math.cos(t * s.speed + s.phase) * 0.35;
            const targetZ = s.home.z + Math.sin(t * 0.5 + s.phase) * 0.25;

            s.vel.x += (targetX - pos.x) * 0.022;
            s.vel.y += (targetY - pos.y) * 0.022;
            s.vel.z += (targetZ - pos.z) * 0.022;

            // Repel from mouse pointer in 3D space
            const dx = pos.x + group.position.x - pointer3D.x;
            const dy = pos.y - pointer3D.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 6.2) {
                const dist = Math.sqrt(distSq) || 0.001;
                const force = (2.5 - dist) * 0.045;
                if (force > 0) {
                    s.vel.x += (dx / dist) * force;
                    s.vel.y += (dy / dist) * force;
                }
            }

            // Soft pairwise separation
            for (let j = i + 1; j < spheres.length; j++) {
                const other = spheres[j];
                const ox = pos.x - other.mesh.position.x;
                const oy = pos.y - other.mesh.position.y;
                const oz = pos.z - other.mesh.position.z;
                const minDist = (s.radius + other.radius) * 1.12;
                const d2 = ox * ox + oy * oy + oz * oz;
                if (d2 < minDist * minDist && d2 > 0.0001) {
                    const d = Math.sqrt(d2);
                    const push = (minDist - d) * 0.03;
                    const nx = (ox / d) * push;
                    const ny = (oy / d) * push;
                    const nz = (oz / d) * push;
                    s.vel.x += nx;
                    s.vel.y += ny;
                    s.vel.z += nz;
                    other.vel.x -= nx;
                    other.vel.y -= ny;
                    other.vel.z -= nz;
                }
            }

            s.vel.multiplyScalar(0.88);
            pos.add(s.vel);
        }

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();

/* ==========================================
   8. CASE STUDY TEMPLATE INTERACTIONS
========================================== */
(function initCaseStudyInteractions() {
    if (document.querySelector('.page-featured')) {
        try {
            sessionStorage.setItem('skipPreloader', '1');
        } catch (err) { /* ignore storage errors */ }
    }

    const progressBar = document.getElementById('scrollProgressBar');
    if (progressBar) {
        const updateProgress = () => {
            const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
            const pct = Math.min(100, Math.max(0, (window.scrollY / maxScroll) * 100));
            progressBar.style.width = pct + '%';
        };
        window.addEventListener('scroll', updateProgress, { passive: true });
        updateProgress();
    }

    // Blur fade-out transition when clicking .close-pill on works-*.html
    let isClosing = false;
    document.querySelectorAll('.close-pill').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;

            const href = btn.getAttribute('href');
            if (!href) return;

            e.preventDefault();
            if (isClosing) return;
            isClosing = true;

            const pill = document.getElementById('cursorPill');
            if (pill) pill.classList.remove('is-active');

            document.body.classList.add('is-work-closing');

            setTimeout(() => {
                window.location.href = href;
            }, 680);
        });
    });

    window.addEventListener('pageshow', () => {
        isClosing = false;
        document.body.classList.remove('is-work-closing');
    });
})();



