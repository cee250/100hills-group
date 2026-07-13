// ========================================
// 1000 HILLS GROUP - MAIN JS
// ALL FUNCTIONALITY IN ONE FILE
// ========================================

// ========================================
// FIREBASE CONFIG
// ========================================
const firebaseConfig = {
    apiKey: "AIzaSyABeFEPPKjKVFU14cx4s__uwWLRpHa5J2c",
    authDomain: "luxury-properties-36554.firebaseapp.com",
    projectId: "luxury-properties-36554",
    storageBucket: "luxury-properties-36554.firebasestorage.app",
    messagingSenderId: "214959691683",
    appId: "1:214959691683:web:864ba0f961cfefd7baac16"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// ========================================
// DOM READY
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // PRELOADER
    // ========================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', function() {
            setTimeout(() => {
                preloader.classList.add('hide');
            }, 800);
        });
    }

    // ========================================
    // HEADER SCROLL EFFECT
    // ========================================
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // ========================================
    // MOBILE MENU
    // ========================================
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // ========================================
    // AOS ANIMATIONS
    // ========================================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50,
            easing: 'ease-out-cubic'
        });
    }

    // ========================================
    // COUNTER ANIMATION
    // ========================================
    const counters = document.querySelectorAll('.counter');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.textContent);
        if (target === 0) return;
        
        let current = 0;
        const increment = Math.ceil(target / 60);
        const stepTime = 2000 / 60;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = current;
            }
        }, stepTime);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                animateCounter(counter);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // ========================================
    // LOAD TEAM FROM FIREBASE
    // ========================================
    async function loadTeam() {
        const container = document.getElementById('teamGrid');
        if (!container) return;
        
        try {
            const snapshot = await db.collection('team').get();
            
            if (snapshot.empty) {
                // Fallback team data - YOU ARE HERE!
                const fallbackTeam = [
                    {
                        name: 'Your Name',
                        role: 'Lead Web Developer & Cybersecurity Specialist',
                        bio: 'Building secure, high-performance digital solutions for Rwanda\'s top brands.',
                        image: 'https://ui-avatars.com/api/?name=Your+Name&background=C9A96E&color=000&size=200',
                        skills: ['Web Dev', 'Cybersecurity', 'Full-Stack', 'Firebase']
                    },
                    {
                        name: 'Jane Doe',
                        role: 'Digital Marketing Manager',
                        bio: 'Data-driven marketing strategist with 5+ years of experience.',
                        image: 'https://ui-avatars.com/api/?name=Jane+Doe&background=1A1A1A&color=C9A96E&size=200',
                        skills: ['SEO', 'Social Media', 'Content']
                    },
                    {
                        name: 'John Smith',
                        role: 'Senior UI/UX Designer',
                        bio: 'Creating beautiful, intuitive interfaces that users love.',
                        image: 'https://ui-avatars.com/api/?name=John+Smith&background=1A1A1A&color=C9A96E&size=200',
                        skills: ['UI/UX', 'Figma', 'Prototyping']
                    }
                ];
                renderTeam(fallbackTeam);
                return;
            }
            
            const teamData = [];
            snapshot.forEach(doc => {
                teamData.push({ id: doc.id, ...doc.data() });
            });
            renderTeam(teamData);
        } catch (error) {
            console.error('Error loading team:', error);
        }
    }

    function renderTeam(team) {
        const container = document.getElementById('teamGrid');
        if (!container) return;
        
        container.innerHTML = team.map(member => `
            <div class="team-card" data-aos="fade-up">
                <div class="team-image">
                    <img src="${member.image || 'https://ui-avatars.com/api/?name=Team+Member&background=1A1A1A&color=C9A96E&size=200'}" alt="${member.name}" />
                    ${member.role && member.role.includes('Cyber') ? '<span class="team-badge"><i class="fas fa-shield-alt"></i> Security Expert</span>' : ''}
                    ${member.role && member.role.includes('Lead') ? '<span class="team-badge" style="background: var(--gold); color: var(--black);"><i class="fas fa-crown"></i> Team Lead</span>' : ''}
                </div>
                <div class="team-info">
                    <h4>${member.name}</h4>
                    <p class="team-role">${member.role || 'Team Member'}</p>
                    <p class="team-bio">${member.bio || ''}</p>
                    <div class="team-skills">
                        ${(member.skills || []).map(skill => `<span>${skill}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Load team
    if (document.getElementById('teamGrid')) {
        loadTeam();
    }

    // ========================================
    // LOAD SERVICES FROM FIREBASE
    // ========================================
    async function loadServices() {
        const container = document.getElementById('servicesGrid');
        if (!container) return;
        
        try {
            const snapshot = await db.collection('services').get();
            
            if (snapshot.empty) {
                // Static services from HTML will show
                return;
            }
            
            const services = [];
            snapshot.forEach(doc => {
                services.push({ id: doc.id, ...doc.data() });
            });
            renderServices(services);
        } catch (error) {
            console.error('Error loading services:', error);
        }
    }

    function renderServices(services) {
        const container = document.getElementById('servicesGrid');
        if (!container) return;
        
        container.innerHTML = services.map(service => `
            <div class="service-card" data-aos="flip-up">
                <div class="service-icon"><i class="${service.icon || 'fas fa-cog'}"></i></div>
                <h4>${service.title}</h4>
                <p>${service.description}</p>
                <a href="${service.link || 'services.html'}" class="service-link">Learn More <i class="fas fa-arrow-right"></i></a>
            </div>
        `).join('');
    }

    if (document.getElementById('servicesGrid')) {
        loadServices();
    }

    // ========================================
    // SMOOTH SCROLL
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = document.getElementById('header')?.offsetHeight || 70;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========================================
    // CONTACT FORM
    // ========================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName')?.value;
            const email = document.getElementById('contactEmail')?.value;
            const phone = document.getElementById('contactPhone')?.value;
            const subject = document.getElementById('contactSubject')?.value;
            const message = document.getElementById('contactMessage')?.value;
            
            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }
            
            const submitBtn = this.querySelector('.btn-submit');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            try {
                // Save to Firebase
                await db.collection('messages').add({
                    name,
                    email,
                    phone,
                    subject,
                    message,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    status: 'unread'
                });
                
                // Also send to WhatsApp (opens in new tab)
                const whatsappUrl = `https://wa.me/250788695396?text=Hello%201000%20Hills%20Group!%0A%0AName:%20${encodeURIComponent(name)}%0AEmail:%20${encodeURIComponent(email)}%0APhone:%20${encodeURIComponent(phone)}%0ASubject:%20${encodeURIComponent(subject)}%0AMessage:%20${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
                
                alert('✅ Message sent successfully! We\'ll get back to you within 24 hours.');
                contactForm.reset();
            } catch (error) {
                console.error('Error sending message:', error);
                alert('❌ Error sending message. Please try again or contact us directly on WhatsApp.');
            }
            
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        });
    }

    // ========================================
    // CLIENT PORTAL LOGIC
    // ========================================
    const loginBox = document.getElementById('loginBox');
    const portalDashboard = document.getElementById('portalDashboard');
    const clientName = document.getElementById('clientName');

    if (loginBox && portalDashboard) {
        auth.onAuthStateChanged(user => {
            if (user) {
                loginBox.style.display = 'none';
                portalDashboard.classList.add('active');
                clientName.textContent = user.displayName || user.email || 'Client';
            } else {
                loginBox.style.display = 'block';
                portalDashboard.classList.remove('active');
            }
        });

        // Portal Login
        const loginForm = document.getElementById('portalLoginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('portalEmail').value;
                const password = document.getElementById('portalPassword').value;
                
                const btn = loginForm.querySelector('.btn-submit');
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
                
                try {
                    await auth.signInWithEmailAndPassword(email, password);
                } catch (error) {
                    alert('❌ Login failed: ' + error.message);
                }
                
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            });
        }

        // Portal Logout
        const logoutBtn = document.getElementById('portalLogout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await auth.signOut();
            });
        }
    }

    // ========================================
    // ADMIN LOGIC (on admin.html)
    // ========================================
    const adminLoginBtn = document.getElementById('loginBtn');
    const adminLogoutBtn = document.getElementById('logoutBtn');
    const authSection = document.getElementById('authSection');
    const adminPanel = document.getElementById('adminPanel');
    const adminUserEmail = document.getElementById('adminUserEmail');

    if (adminLoginBtn) {
        // Check admin auth
        auth.onAuthStateChanged(user => {
            if (user) {
                if (authSection) authSection.style.display = 'none';
                if (adminPanel) adminPanel.style.display = 'block';
                if (adminUserEmail) adminUserEmail.textContent = user.email;
                loadAllAdminData();
            } else {
                if (authSection) authSection.style.display = 'block';
                if (adminPanel) adminPanel.style.display = 'none';
            }
        });

        // Admin Login
        adminLoginBtn.addEventListener('click', async () => {
            const email = document.getElementById('adminEmail').value;
            const password = document.getElementById('adminPassword').value;
            const authError = document.getElementById('authError');
            
            authError.style.display = 'none';
            adminLoginBtn.disabled = true;
            adminLoginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            
            try {
                await auth.signInWithEmailAndPassword(email, password);
            } catch (error) {
                authError.textContent = error.message;
                authError.style.display = 'block';
                adminLoginBtn.disabled = false;
                adminLoginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            }
        });

        // Admin Logout
        if (adminLogoutBtn) {
            adminLogoutBtn.addEventListener('click', async () => {
                await auth.signOut();
            });
        }

        // Admin Tabs
        const tabs = document.querySelectorAll('.admin-tabs button');
        const panels = {
            team: document.getElementById('panel-team'),
            services: document.getElementById('panel-services'),
            portfolio: document.getElementById('panel-portfolio'),
            testimonials: document.getElementById('panel-testimonials')
        };

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                Object.keys(panels).forEach(key => {
                    if (panels[key]) panels[key].classList.remove('active');
                });
                
                const target = tab.dataset.tab;
                if (panels[target]) {
                    panels[target].classList.add('active');
                    loadAdminData(target);
                }
            });
        });

        // Admin CRUD Functions
        const collections = {
            team: 'team',
            services: 'services',
            portfolio: 'portfolio',
            testimonials: 'testimonials'
        };

        async function loadAllAdminData() {
            loadAdminData('team');
            loadAdminData('services');
            loadAdminData('portfolio');
            loadAdminData('testimonials');
        }

        async function loadAdminData(type) {
            const collection = collections[type];
            const listId = `${type}List`;
            const list = document.getElementById(listId);
            
            if (!list) return;
            
            try {
                const snapshot = await db.collection(collection).get();
                
                if (snapshot.empty) {
                    list.innerHTML = `<p style="padding: 20px; color: var(--grey); text-align: center;">No ${type} found. Add one above!</p>`;
                    return;
                }
                
                let html = '';
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const title = data.name || data.title || data.text || 'Untitled';
                    const subtitle = data.role || data.description || data.company || '';
                    html += `
                        <div class="admin-item" data-id="${doc.id}">
                            <div class="admin-item-info">
                                <h4>${title}</h4>
                                <p>${subtitle}</p>
                            </div>
                            <div class="admin-item-actions">
                                <button class="btn-edit" onclick="editAdminItem('${type}', '${doc.id}')"><i class="fas fa-edit"></i> Edit</button>
                                <button class="btn-delete" onclick="deleteAdminItem('${type}', '${doc.id}')"><i class="fas fa-trash"></i> Delete</button>
                            </div>
                        </div>
                    `;
                });
                list.innerHTML = html;
            } catch (error) {
                console.error(`Error loading ${type}:`, error);
                list.innerHTML = `<p style="padding: 20px; color: #ff4444; text-align: center;">Error loading ${type}</p>`;
            }
        }

        // Delete function (global)
        window.deleteAdminItem = async (type, id) => {
            if (!confirm(`Delete this ${type} item?`)) return;
            
            try {
                await db.collection(collections[type]).doc(id).delete();
                loadAdminData(type);
                showToast(`${type} item deleted!`);
            } catch (error) {
                console.error(error);
                alert('Error deleting: ' + error.message);
            }
        };

        // Edit function (placeholder)
        window.editAdminItem = (type, id) => {
            alert(`Edit ${type} item: ${id}\n\n(Full edit with modal coming soon!)`);
        };

        // Add Team Member
        const addTeamBtn = document.getElementById('addTeamBtn');
        if (addTeamBtn) {
            addTeamBtn.addEventListener('click', async () => {
                const name = document.getElementById('teamName').value;
                const role = document.getElementById('teamRole').value;
                const bio = document.getElementById('teamBio').value;
                const image = document.getElementById('teamImage').value || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=C9A96E&color=000&size=200';
                const skills = document.getElementById('teamSkills').value.split(',').map(s => s.trim()).filter(s => s);
                
                if (!name || !role) {
                    alert('Name and Role are required!');
                    return;
                }
                
                try {
                    await db.collection('team').add({ name, role, bio, image, skills });
                    document.getElementById('teamName').value = '';
                    document.getElementById('teamRole').value = '';
                    document.getElementById('teamBio').value = '';
                    document.getElementById('teamImage').value = '';
                    document.getElementById('teamSkills').value = '';
                    loadAdminData('team');
                    showToast('Team member added successfully!');
                } catch (error) {
                    console.error(error);
                    alert('Error adding team member: ' + error.message);
                }
            });
        }

        // Add Service
        const addServiceBtn = document.getElementById('addServiceBtn');
        if (addServiceBtn) {
            addServiceBtn.addEventListener('click', async () => {
                const title = document.getElementById('serviceTitle').value;
                const description = document.getElementById('serviceDesc').value;
                const icon = document.getElementById('serviceIcon').value || 'fas fa-cog';
                const link = document.getElementById('serviceLink').value || '#';
                
                if (!title || !description) {
                    alert('Title and Description are required!');
                    return;
                }
                
                try {
                    await db.collection('services').add({ title, description, icon, link });
                    document.getElementById('serviceTitle').value = '';
                    document.getElementById('serviceDesc').value = '';
                    document.getElementById('serviceIcon').value = '';
                    document.getElementById('serviceLink').value = '';
                    loadAdminData('services');
                    showToast('Service added successfully!');
                } catch (error) {
                    console.error(error);
                    alert('Error adding service: ' + error.message);
                }
            });
        }

        // Add Portfolio
        const addPortfolioBtn = document.getElementById('addPortfolioBtn');
        if (addPortfolioBtn) {
            addPortfolioBtn.addEventListener('click', async () => {
                const title = document.getElementById('portfolioTitle').value;
                const description = document.getElementById('portfolioDesc').value;
                const url = document.getElementById('portfolioUrl').value || '#';
                const icon = document.getElementById('portfolioIcon').value || 'fas fa-folder';
                
                if (!title || !description) {
                    alert('Title and Description are required!');
                    return;
                }
                
                try {
                    await db.collection('portfolio').add({ title, description, url, icon });
                    document.getElementById('portfolioTitle').value = '';
                    document.getElementById('portfolioDesc').value = '';
                    document.getElementById('portfolioUrl').value = '';
                    document.getElementById('portfolioIcon').value = '';
                    loadAdminData('portfolio');
                    showToast('Portfolio item added successfully!');
                } catch (error) {
                    console.error(error);
                    alert('Error adding portfolio: ' + error.message);
                }
            });
        }

        // Add Testimonial
        const addTestimonialBtn = document.getElementById('addTestimonialBtn');
        if (addTestimonialBtn) {
            addTestimonialBtn.addEventListener('click', async () => {
                const name = document.getElementById('testimonialName').value;
                const text = document.getElementById('testimonialText').value;
                const company = document.getElementById('testimonialCompany').value || '';
                
                if (!name || !text) {
                    alert('Name and Testimonial are required!');
                    return;
                }
                
                try {
                    await db.collection('testimonials').add({ name, text, company });
                    document.getElementById('testimonialName').value = '';
                    document.getElementById('testimonialText').value = '';
                    document.getElementById('testimonialCompany').value = '';
                    loadAdminData('testimonials');
                    showToast('Testimonial added successfully!');
                } catch (error) {
                    console.error(error);
                    alert('Error adding testimonial: ' + error.message);
                }
            });
        }

        // Toast notification
        function showToast(message) {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--gold);
                color: var(--black);
                padding: 12px 24px;
                border-radius: 8px;
                font-weight: 600;
                font-family: var(--font);
                box-shadow: var(--shadow);
                z-index: 99999;
                animation: slideUp 0.3s ease;
            `;
            toast.textContent = '✅ ' + message;
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transition = 'opacity 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    }

    // ========================================
    // LAZY LOAD IMAGES
    // ========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    console.log('🚀 1000 Hills Group - Website Loaded Successfully!');
    console.log('🔥 Built by the 1000 Hills Team');
    console.log('👨‍💻 Cybersecurity & Web Development Experts');
});