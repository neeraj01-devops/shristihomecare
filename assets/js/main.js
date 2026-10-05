/**
 * SHRISTI CARE AT HOME - MAIN JAVASCRIPT
 * Modern, robust vanilla JS for navigation, interactions, lightbox & form validation
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Effect
  const header = document.querySelector('.site-header');
  if (header) {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // 2. Mobile Navigation Toggle
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // 3. Mobile Submenu Toggle (Services Dropdown)
  const dropdownParents = document.querySelectorAll('.has-dropdown');
  dropdownParents.forEach((parent) => {
    const link = parent.querySelector('.dropdown-toggle');
    if (link) {
      link.addEventListener('click', (e) => {
        // Only prevent default on mobile viewports (< 769px)
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const isOpened = parent.classList.toggle('mobile-open');
          link.setAttribute('aria-expanded', isOpened ? 'true' : 'false');
        }
      });
    }
  });

  // 4. FAQ Accordions
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items in the same container
        const parentContainer = item.closest('.faq-container');
        if (parentContainer) {
          parentContainer.querySelectorAll('.faq-item').forEach((sibling) => {
            if (sibling !== item) {
              sibling.classList.remove('active');
              const sibAnswer = sibling.querySelector('.faq-answer');
              const sibBtn = sibling.querySelector('.faq-question');
              if (sibAnswer) sibAnswer.style.maxHeight = null;
              if (sibBtn) sibBtn.setAttribute('aria-expanded', 'false');
            }
          });
        }

        // Toggle current item
        if (isActive) {
          item.classList.remove('active');
          answer.style.maxHeight = null;
          questionBtn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('active');
          answer.style.maxHeight = answer.scrollHeight + 'px';
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // 5. Gallery Filter & Lightbox Functionality
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
  const lightboxModal = document.querySelector('.lightbox-modal');

  // Filter items
  if (filterBtns.length > 0 && galleryItems.length > 0) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        galleryItems.forEach((item) => {
          const itemCategory = item.getAttribute('data-category');
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Lightbox
  if (lightboxModal && galleryItems.length > 0) {
    const lightboxImg = lightboxModal.querySelector('.lightbox-img');
    const lightboxCaption = lightboxModal.querySelector('.lightbox-caption');
    const closeBtn = lightboxModal.querySelector('.lightbox-close-btn');
    const prevBtn = lightboxModal.querySelector('.prev-btn');
    const nextBtn = lightboxModal.querySelector('.next-btn');

    let currentItemIndex = 0;

    const getVisibleItems = () => {
      return galleryItems.filter((item) => item.style.display !== 'none');
    };

    const updateLightbox = (index) => {
      const visibleItems = getVisibleItems();
      if (visibleItems.length === 0) return;

      if (index < 0) {
        currentItemIndex = visibleItems.length - 1;
      } else if (index >= visibleItems.length) {
        currentItemIndex = 0;
      } else {
        currentItemIndex = index;
      }

      const activeItem = visibleItems[currentItemIndex];
      const img = activeItem.querySelector('img');
      const title = activeItem.querySelector('.gallery-overlay-title') || { textContent: '' };
      const badge = activeItem.querySelector('.gallery-overlay-badge') || { textContent: '' };

      if (img && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
      }
      if (lightboxCaption) {
        lightboxCaption.innerHTML = `<strong>${title.textContent}</strong> &bull; <span style="opacity:0.8">${badge.textContent}</span>`;
      }
    };

    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const visibleItems = getVisibleItems();
        currentItemIndex = visibleItems.indexOf(item);
        updateLightbox(currentItemIndex);
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateLightbox(currentItemIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateLightbox(currentItemIndex + 1);
      });
    }

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') updateLightbox(currentItemIndex - 1);
      if (e.key === 'ArrowRight') updateLightbox(currentItemIndex + 1);
    });
  }

  // 6. Contact Form Validation
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const successBox = document.getElementById('formSuccessMessage');

    const validateField = (input, rule) => {
      const errorMsg = input.parentElement.querySelector('.form-error-msg');
      const val = input.value.trim();
      let isValid = true;
      let msg = '';

      if (rule === 'name') {
        if (!val || val.length < 2) {
          isValid = false;
          msg = 'Please enter your full name.';
        }
      } else if (rule === 'phone') {
        // Indian phone format (10 digits, optional +91 or 0 prefix)
        const phoneRegex = /^(?:(?:\+|0{0,2})91(\s*[- ]*\s*)?|[0]?)?[6789]\d{9}$/;
        if (!val || !phoneRegex.test(val.replace(/[\s-]/g, ''))) {
          isValid = false;
          msg = 'Please enter a valid 10-digit mobile number.';
        }
      } else if (rule === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val || !emailRegex.test(val)) {
          isValid = false;
          msg = 'Please provide a valid email address.';
        }
      } else if (rule === 'service') {
        if (!val) {
          isValid = false;
          msg = 'Please select a required service.';
        }
      } else if (rule === 'message') {
        if (!val || val.length < 5) {
          isValid = false;
          msg = 'Please provide details about your care requirement.';
        }
      }

      if (!isValid) {
        input.classList.add('error');
        if (errorMsg) {
          errorMsg.textContent = msg;
          errorMsg.classList.add('visible');
        }
      } else {
        input.classList.remove('error');
        if (errorMsg) {
          errorMsg.classList.remove('visible');
        }
      }

      return isValid;
    };

    // Attach blur listeners for real-time validation
    const nameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phoneNumber');
    const emailInput = document.getElementById('emailAddress');
    const serviceSelect = document.getElementById('serviceRequired');
    const messageInput = document.getElementById('careMessage');

    if (nameInput) nameInput.addEventListener('blur', () => validateField(nameInput, 'name'));
    if (phoneInput) phoneInput.addEventListener('blur', () => validateField(phoneInput, 'phone'));
    if (emailInput) emailInput.addEventListener('blur', () => validateField(emailInput, 'email'));
    if (serviceSelect) serviceSelect.addEventListener('change', () => validateField(serviceSelect, 'service'));
    if (messageInput) messageInput.addEventListener('blur', () => validateField(messageInput, 'message'));

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = nameInput ? validateField(nameInput, 'name') : true;
      const isPhoneValid = phoneInput ? validateField(phoneInput, 'phone') : true;
      const isEmailValid = emailInput ? validateField(emailInput, 'email') : true;
      const isServiceValid = serviceSelect ? validateField(serviceSelect, 'service') : true;
      const isMessageValid = messageInput ? validateField(messageInput, 'message') : true;

      if (isNameValid && isPhoneValid && isEmailValid && isServiceValid && isMessageValid) {
        // Show success state
        if (successBox) {
          const clientName = nameInput ? nameInput.value.trim() : 'Valued Client';
          const successDetails = successBox.querySelector('.success-client-name');
          if (successDetails) {
            successDetails.textContent = clientName;
          }
          successBox.classList.add('visible');
          successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        // Reset form inputs
        contactForm.reset();

        // Remove error classes
        document.querySelectorAll('.form-input, .form-select, .form-textarea').forEach((el) => {
          el.classList.remove('error');
        });
        document.querySelectorAll('.form-error-msg').forEach((el) => {
          el.classList.remove('visible');
        });
      }
    });
  }

  // 7. Intersection Observer for Scroll Fade-In
  const animatedElements = document.querySelectorAll('.fade-in-up');
  if ('IntersectionObserver' in window && animatedElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('appeared');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    animatedElements.forEach((el) => observer.observe(el));
  } else {
    animatedElements.forEach((el) => el.classList.add('appeared'));
  }
});
