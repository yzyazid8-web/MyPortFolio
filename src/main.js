import emailjs from '@emailjs/browser';

const ROUTES = {
  '/': {
    viewId: 'view-home',
    title: 'Yazid FAREZ | Portfolio'
  },
  '/experiences': {
    viewId: 'view-experiences',
    title: 'Mes Experiences | Yazid FAREZ'
  },
  '/education': {
    viewId: 'view-education',
    title: 'Mon Education | Yazid FAREZ'
  },
  '/projects': {
    viewId: 'view-projects',
    title: 'Mes Projets | Yazid FAREZ'
  },
  '/contact': {
    viewId: 'view-contact',
    title: 'Me Contacter | Yazid FAREZ'
  }
};

const EMAIL_SERVICE_ID = 'service_go0ovkb';
const EMAIL_TEMPLATE_ID = 'template_3ur515m';
const EMAIL_PUBLIC_KEY = import.meta.env.VITE_EMAIL_JS;

const skillIcons = {
  Python: 'bxl-python',
  Flask: 'bx-server',
  Docker: 'bxl-docker',
  GitLab: 'bxl-git',
  'CI/CD': 'bx-git-branch',
  R: 'bx-code-alt',
  Excel: 'bx-spreadsheet',
  'Data Visualisation': 'bx-bar-chart-alt-2',
  HTML: 'bxl-html5',
  CSS: 'bxl-css3',
  JavaScript: 'bxl-javascript',
  Shiny: 'bx-radar',
  Bokeh: 'bx-line-chart',
  Pandas: 'bx-data',
  RAG: 'bx-brain',
  Statistiques: 'bx-math',
  'Analyse de données': 'bx-analyse',
  'Analyse de donnees': 'bx-analyse',
  'ML et DL': 'bx-chip',
  NLP: 'bx-message-square-dots',
  Econométrie: 'bx-trending-up',
  Econometrie: 'bx-trending-up',
  Analyse: 'bx-chart',
  Algèbre: 'bx-calculator',
  Algebre: 'bx-calculator',
  'Statistiques et Probabilités': 'bx-bar-chart',
  'Statistiques et Probabilites': 'bx-bar-chart',
  'Micro et Macroéconomie': 'bx-dollar-circle',
  'Micro et Macroeconomie': 'bx-dollar-circle',
  Optimisation: 'bx-target-lock',
  'Théorie des graphes': 'bx-network-chart',
  'Theorie des graphes': 'bx-network-chart',
  SI: 'bx-server'
};

let educationData = [];
let experiencesData = [];
let projectsData = [];
let heroAnimationInitialized = false;
let heroMouseAnimationFrame = null;

function normalizeRoute(pathname) {
  const aliases = {
    '/index.html': '/',
    '/experiences.html': '/experiences',
    '/education.html': '/education',
    '/projects.html': '/projects',
    '/contact.html': '/contact'
  };

  const direct = aliases[pathname] || pathname;
  return ROUTES[direct] ? direct : '/';
}

function toAssetPath(path) {
  if (!path) return '';
  if (/^https?:\/\//.test(path)) return path;
  return `/${path.replace(/^\.?\//, '')}`;
}

function getSkillIcon(skill) {
  return skillIcons[skill] || 'bx-check-circle';
}

function updateActiveNav(route) {
  document.querySelectorAll('[data-route-link]').forEach((link) => {
    if (link.getAttribute('href') === route) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('overlay');
  if (mobileMenu) mobileMenu.classList.add('translate-x-full');
  if (overlay) overlay.classList.add('hidden');
  document.body.style.overflow = '';
}

function setFooterByRoute(route) {
  const withCv = document.querySelectorAll('[data-footer="cv"]');
  const withContact = document.querySelectorAll('[data-footer="contact"]');
  const showCv = route === '/' || route === '/contact';

  withCv.forEach((el) => el.classList.toggle('hidden', !showCv));
  withContact.forEach((el) => el.classList.toggle('hidden', showCv));
}

function renderRoute(route, replaceState = false) {
  Object.values(ROUTES).forEach(({ viewId }) => {
    const view = document.getElementById(viewId);
    if (!view) return;
    view.classList.add('hidden');
  });

  const config = ROUTES[route] || ROUTES['/'];
  const activeView = document.getElementById(config.viewId);
  if (activeView) {
    activeView.classList.remove('hidden');
  }

  document.title = config.title;
  updateActiveNav(route);
  setFooterByRoute(route);

  if (replaceState) {
    window.history.replaceState({ route }, '', route);
  }

  if (window.AOS) {
    window.AOS.refreshHard();
  }

  if (route === '/') {
    animateHeroTitle();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function animateHeroTitle() {
  const title = document.getElementById('hero-title');
  if (!title) return;

  const originalText = title.dataset.originalText || title.textContent || '';
  title.dataset.originalText = originalText;

  let index = 0;
  title.textContent = '';

  const type = () => {
    if (index < originalText.length) {
      title.textContent += originalText.charAt(index);
      index += 1;
      setTimeout(type, 45);
    }
  };

  type();
}

function setupHeroAnimations() {
  if (heroAnimationInitialized) return;
  heroAnimationInitialized = true;

  const profileImage = document.getElementById('profile-image');
  if (!profileImage) return;

  document.addEventListener('mousemove', (event) => {
    if (normalizeRoute(window.location.pathname) !== '/') return;

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const translateX = (centerX - event.clientX) / 45;
    const translateY = (centerY - event.clientY) / 45;

    if (heroMouseAnimationFrame) {
      cancelAnimationFrame(heroMouseAnimationFrame);
    }

    heroMouseAnimationFrame = requestAnimationFrame(() => {
      profileImage.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
  });
}

function navigate(route) {
  if (!ROUTES[route]) return;
  window.history.pushState({ route }, '', route);
  renderRoute(route);
  closeMobileMenu();
}

function setupRouter() {
  document.querySelectorAll('[data-route-link]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http')) return;

      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        link.target === '_blank'
      ) {
        return;
      }

      event.preventDefault();
      navigate(href);
    });
  });

  window.addEventListener('popstate', () => {
    const route = normalizeRoute(window.location.pathname);
    renderRoute(route, true);
  });
}

async function loadAllData() {
  const [eduResponse, expResponse, projResponse, skillsResponse] = await Promise.all([
    fetch('/data/education.json'),
    fetch('/data/experiences.json'),
    fetch('/data/projects.json'),
    fetch('/data/skills.json')
  ]);

  educationData = await eduResponse.json();
  experiencesData = await expResponse.json();
  projectsData = await projResponse.json();
  const skillsData = await skillsResponse.json();

  renderEducation();
  renderExperiences();
  renderProjects();
  renderSkills(skillsData);
}

function renderSkills(skillsData) {
  const firstGrid = document.getElementById('skills-grid-primary');
  const secondGrid = document.getElementById('skills-grid-duplicate');
  if (!firstGrid || !secondGrid) return;

  const markup = skillsData
    .map(
      (skill) => `
      <div class="skill-icon-container">
        <div class="skill-icon-wrapper">
          <div class="skill-icon">
            <i class="bx ${skill.icon} text-4xl"></i>
          </div>
          <div class="skill-name mt-3 text-center">
            <span class="font-medium">${skill.name}</span>
          </div>
        </div>
      </div>
    `
    )
    .join('');

  firstGrid.innerHTML = markup;
  secondGrid.innerHTML = markup;
}

function renderEducation() {
  const container = document.getElementById('education-container');
  if (!container) return;

  container.innerHTML = educationData
    .map(
      (edu, index) => `
      <div class="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" data-aos="zoom-in" data-aos-delay="${
        (index + 1) * 100
      }">
        <div class="relative overflow-hidden h-48">
          <img src="${toAssetPath(edu.image)}" alt="${edu.title}" class="w-full h-48 object-cover transform transition-transform duration-500 hover:scale-110">
          <div>
            <span class="absolute top-3 right-3 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">${edu.period}</span>
            <h3 class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4 text-xl font-semibold">${edu.title}</h3>
          </div>
        </div>

        <div class="p-6">
          <h4 class="text-lg font-medium text-primary-600 dark:text-primary-400 mb-3">${edu.institution}</h4>
          <div class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">${edu.formation}</div>

          <div class="mb-4">
            <h5 class="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Competences acquises</h5>
            <div class="flex flex-wrap gap-2">
              ${edu.skills
                .slice(0, 3)
                .map(
                  (skill) => `
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-xs rounded flex items-center">
                  <i class="bx ${getSkillIcon(skill)} mr-1"></i>
                  ${skill}
                </span>
              `
                )
                .join('')}
              ${
                edu.skills.length > 3
                  ? `<span class="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-xs rounded">+${edu.skills.length - 3}</span>`
                  : ''
              }
            </div>
          </div>

          <button data-edu-index="${index}" class="btn-voir-plus js-open-education-modal">
            <span>Voir plus</span>
            <i class="bx bx-right-arrow-alt"></i>
          </button>
        </div>
      </div>
    `
    )
    .join('');
}

function renderExperiences() {
  const container = document.getElementById('experiences-container');
  if (!container) return;

  container.innerHTML = experiencesData
    .map(
      (exp, index) => `
      <div class="bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" data-aos="zoom-in" data-aos-delay="${
        (index + 1) * 100
      }">
        <div class="relative overflow-hidden h-48">
          <img src="${toAssetPath(exp.image)}" alt="${exp.title}" class="w-full h-48 object-cover transform transition-transform duration-500 hover:scale-110">
          <div>
            <span class="absolute top-3 right-3 px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">${exp.period}</span>
            <h3 class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4 text-xl font-semibold">${exp.title}</h3>
          </div>
        </div>

        <div class="p-6">
          <h4 class="text-lg font-medium text-primary-600 dark:text-primary-400 mb-3">${exp.institution}</h4>
          <div class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">${exp.description}</div>

          <div class="mb-4">
            <h5 class="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Competences et outils</h5>
            <div class="flex flex-wrap gap-2">
              ${exp.skills
                .map(
                  (skill) => `
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-xs rounded flex items-center">
                  <i class="bx ${getSkillIcon(skill)} mr-1"></i>
                  ${skill}
                </span>
              `
                )
                .join('')}
            </div>
          </div>

          <button data-exp-index="${index}" class="btn-voir-plus js-open-experience-modal">
            <span>Voir plus</span>
            <i class="bx bx-right-arrow-alt"></i>
          </button>
        </div>
      </div>
    `
    )
    .join('');
}

function renderProjects() {
  const container = document.getElementById('projects-container');
  if (!container) return;

  container.innerHTML = projectsData
    .map(
      (project, index) => `
      <div class="project-card ${project.category.id} bg-white dark:bg-gray-700 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl" data-aos="zoom-in" data-aos-delay="${
        (index + 1) * 100
      }">
        <div class="relative overflow-hidden h-48">
          <img src="${toAssetPath(project.image)}" alt="${project.title}" class="w-full h-48 object-cover transform transition-transform duration-500 hover:scale-110">
          <div class="absolute top-3 right-3">
            <span class="px-3 py-1 bg-primary-500 text-white text-xs font-medium rounded-full">${project.category.name}</span>
          </div>
        </div>

        <div class="p-6">
          <h3 class="text-xl font-bold mb-3 text-gray-900 dark:text-white">${project.title}</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">${project.description}</p>

          <div class="mb-4">
            <h5 class="text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Technologies utilisees</h5>
            <div class="flex flex-wrap gap-2">
              ${project.technologies
                .map(
                  (tech) => `
                <span class="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-xs rounded flex items-center">
                  <i class="bx ${getSkillIcon(tech)} mr-1"></i>
                  ${tech}
                </span>
              `
                )
                .join('')}
            </div>
          </div>

          <button data-project-index="${index}" class="btn-voir-plus js-open-project-modal">
            <span>Voir plus</span>
            <i class="bx bx-right-arrow-alt"></i>
          </button>
        </div>
      </div>
    `
    )
    .join('');
}

function openModal(title, content) {
  const modal = document.getElementById('detail-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  modalTitle.textContent = title;
  modalBody.innerHTML = content;
  modal.classList.add('show');
}

function openEducationModal(index) {
  const edu = educationData[index];
  if (!edu) return;

  openModal(
    edu.title,
    `
    <div class="space-y-4">
      <div>
        <h4 class="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">${edu.institution}</h4>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4"><i class="bx bx-calendar mr-1"></i>${edu.period}</p>
      </div>
      ${
        edu.formation
          ? `<div><h5 class="font-semibold text-gray-900 dark:text-white mb-2">A propos de la formation</h5><p class="text-gray-600 dark:text-gray-300">${edu.formation}</p></div>`
          : ''
      }
      ${
        edu.parcours
          ? `<div><h5 class="font-semibold text-gray-900 dark:text-white mb-2">Parcours</h5><p class="text-gray-600 dark:text-gray-300">${edu.parcours}</p></div>`
          : ''
      }
      <div>
        <h5 class="font-semibold text-gray-900 dark:text-white mb-3">Competences acquises</h5>
        <div class="flex flex-wrap gap-2">
          ${edu.skills
            .map(
              (skill) => `
            <span class="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm rounded-full flex items-center">
              <i class="bx ${getSkillIcon(skill)} mr-2"></i>
              ${skill}
            </span>
          `
            )
            .join('')}
        </div>
      </div>
    </div>
  `
  );
}

function openExperienceModal(index) {
  const exp = experiencesData[index];
  if (!exp) return;

  openModal(
    exp.title,
    `
    <div class="space-y-4">
      <div>
        <h4 class="text-lg font-semibold text-primary-600 dark:text-primary-400 mb-2">${exp.institution}</h4>
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-4"><i class="bx bx-calendar mr-1"></i>${exp.period}</p>
      </div>
      <div>
        <h5 class="font-semibold text-gray-900 dark:text-white mb-2">Description</h5>
        <p class="text-gray-600 dark:text-gray-300">${exp.description}</p>
      </div>
      ${
        exp.missions?.length
          ? `<div><h5 class="font-semibold text-gray-900 dark:text-white mb-3">Missions principales</h5><ul class="space-y-2">${exp.missions
              .map(
                (mission) => `<li class="flex items-start text-gray-600 dark:text-gray-300"><i class="bx bx-check-circle text-primary-600 dark:text-primary-400 mr-2 mt-1 flex-shrink-0"></i><span>${mission}</span></li>`
              )
              .join('')}</ul></div>`
          : ''
      }
      <div>
        <h5 class="font-semibold text-gray-900 dark:text-white mb-3">Competences et outils</h5>
        <div class="flex flex-wrap gap-2">
          ${exp.skills
            .map(
              (skill) => `
            <span class="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm rounded-full flex items-center">
              <i class="bx ${getSkillIcon(skill)} mr-2"></i>
              ${skill}
            </span>
          `
            )
            .join('')}
        </div>
      </div>
    </div>
  `
  );
}

function openProjectModal(index) {
  const project = projectsData[index];
  if (!project) return;

  openModal(
    project.title,
    `
    <div class="space-y-4">
      <div>
        <span class="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm rounded-full">${project.category.name}</span>
      </div>
      <div>
        <h5 class="font-semibold text-gray-900 dark:text-white mb-2">Description</h5>
        <p class="text-gray-600 dark:text-gray-300">${project.description}</p>
      </div>
      <div>
        <h5 class="font-semibold text-gray-900 dark:text-white mb-3">Technologies utilisees</h5>
        <div class="flex flex-wrap gap-2">
          ${project.technologies
            .map(
              (tech) => `
            <span class="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm rounded-full flex items-center">
              <i class="bx ${getSkillIcon(tech)} mr-2"></i>
              ${tech}
            </span>
          `
            )
            .join('')}
        </div>
      </div>
      ${
        project.link
          ? `<div class="pt-4"><a href="${project.link}" target="_blank" class="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"><i class="bx bxl-github text-2xl mr-2"></i>Voir sur GitHub</a></div>`
          : ''
      }
    </div>
  `
  );
}

function closeModal() {
  const modal = document.getElementById('detail-modal');
  modal.classList.remove('show');
}

function setupModalEvents() {
  window.closeModal = closeModal;

  document.addEventListener('click', (event) => {
    const eduBtn = event.target.closest('.js-open-education-modal');
    if (eduBtn) {
      openEducationModal(Number(eduBtn.getAttribute('data-edu-index')));
      return;
    }

    const expBtn = event.target.closest('.js-open-experience-modal');
    if (expBtn) {
      openExperienceModal(Number(expBtn.getAttribute('data-exp-index')));
      return;
    }

    const projectBtn = event.target.closest('.js-open-project-modal');
    if (projectBtn) {
      openProjectModal(Number(projectBtn.getAttribute('data-project-index')));
      return;
    }

    const modal = document.getElementById('detail-modal');
    if (event.target === modal) {
      closeModal();
    }
  });
}

function setupThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');

  if (
    localStorage.getItem('darkMode') === 'true' ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches &&
      localStorage.getItem('darkMode') !== 'false')
  ) {
    document.documentElement.classList.add('dark');
  }

  function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
  }

  if (themeToggle) themeToggle.addEventListener('click', toggleDarkMode);
  if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleDarkMode);
}

function setupMobileMenu() {
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const closeMobileMenuButton = document.getElementById('close-mobile-menu');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('overlay');

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.remove('translate-x-full');
      overlay.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeMobileMenuButton) {
    closeMobileMenuButton.addEventListener('click', closeMobileMenu);
  }

  if (overlay) {
    overlay.addEventListener('click', closeMobileMenu);
  }
}

function setupBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.remove('opacity-0', 'invisible');
    } else {
      backToTopBtn.classList.add('opacity-0', 'invisible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function setupSkillScroller() {
  const skillsContainer = document.querySelector('.skills-container');
  if (!skillsContainer) return;

  const scrollWrapper = skillsContainer.querySelector('.skills-scroll-wrapper');
  let isScrolling = false;
  let startY = 0;
  let scrollTop = 0;

  skillsContainer.addEventListener('mousedown', (e) => {
    isScrolling = true;
    skillsContainer.style.cursor = 'grabbing';
    startY = e.pageY - skillsContainer.offsetTop;
    scrollTop = skillsContainer.scrollTop;
    e.preventDefault();
  });

  document.addEventListener('mouseup', () => {
    isScrolling = false;
    skillsContainer.style.cursor = 'grab';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isScrolling) return;
    const y = e.pageY - skillsContainer.offsetTop;
    const walkY = (y - startY) * 1.5;
    skillsContainer.scrollTop = scrollTop - walkY;
  });

  const skillItems = skillsContainer.querySelectorAll('.skill-icon-container');
  const itemCount = Math.max(1, skillItems.length / 2);
  if (itemCount > 6 && scrollWrapper) {
    const animationDuration = Math.min(30, itemCount * 2.5);
    scrollWrapper.style.animationDuration = `${animationDuration}s`;
  }
}

function setupContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  const formFields = contactForm.querySelectorAll('input, textarea');
  const submitBtn = document.getElementById('submit-btn');
  const spinner = document.getElementById('spinner');
  const formStatus = document.getElementById('form-status');

  function showError(field, message) {
    const errorDiv = field.closest('div')?.querySelector('.error-message');
    if (!errorDiv) return;
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    field.classList.add('border-red-500');
  }

  function clearError(field) {
    const errorDiv = field.closest('div')?.querySelector('.error-message');
    if (!errorDiv) return;
    errorDiv.classList.add('hidden');
    field.classList.remove('border-red-500');
  }

  function validateField(field) {
    clearError(field);

    if (field.required && !field.value.trim()) {
      showError(field, 'Ce champ est requis');
      return false;
    }

    if (field.type === 'email' && field.value.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        showError(field, 'Veuillez entrer une adresse email valide');
        return false;
      }
    }

    return true;
  }

  formFields.forEach((field) => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => clearError(field));
  });

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    let isValid = true;
    formFields.forEach((field) => {
      if (!validateField(field)) isValid = false;
    });

    if (!isValid) return;

    if (!EMAIL_PUBLIC_KEY) {
      formStatus.textContent = 'Configuration manquante: ajoutez VITE_EMAIL_JS dans Netlify.';
      formStatus.classList.add('text-red-600', 'dark:text-red-400');
      return;
    }

    submitBtn.disabled = true;
    spinner.classList.remove('hidden');

    try {
      await emailjs.send(
        EMAIL_SERVICE_ID,
        EMAIL_TEMPLATE_ID,
        {
          from_name: document.getElementById('name').value,
          from_email: document.getElementById('email').value,
          subject: document.getElementById('subject').value,
          message: document.getElementById('message').value
        },
        {
          publicKey: EMAIL_PUBLIC_KEY
        }
      );

      formStatus.textContent = 'Message envoye avec succes!';
      formStatus.classList.add('text-green-600', 'dark:text-green-400');
      formStatus.classList.remove('text-red-600', 'dark:text-red-400');
      contactForm.reset();
    } catch (error) {
      console.error(error);
      formStatus.textContent = "Une erreur s'est produite. Veuillez reessayer.";
      formStatus.classList.add('text-red-600', 'dark:text-red-400');
      formStatus.classList.remove('text-green-600', 'dark:text-green-400');
    } finally {
      spinner.classList.add('hidden');
      submitBtn.disabled = false;
      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.classList.remove('text-green-600', 'dark:text-green-400', 'text-red-600', 'dark:text-red-400');
      }, 4000);
    }
  });
}

function setupAos() {
  if (window.AOS) {
    window.AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
}

function setupPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  });
}

async function init() {
  setupAos();
  setupPreloader();
  setupMobileMenu();
  setupThemeToggle();
  setupBackToTop();
  setupHeroAnimations();
  setupRouter();
  setupModalEvents();
  setupContactForm();

  try {
    await loadAllData();
  } catch (error) {
    console.error('Erreur lors du chargement des donnees:', error);
  }

  setupSkillScroller();

  const initialRoute = normalizeRoute(window.location.pathname);
  renderRoute(initialRoute, true);
}

document.addEventListener('DOMContentLoaded', init);
