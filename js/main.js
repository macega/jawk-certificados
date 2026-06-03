document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================
     1. SCROLL HEADER ANIMATION
     ========================================== */
  const header = document.querySelector('.header');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check initially on load

  /* ==========================================
     2. MOBILE MENU TOGGLE
     ========================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close menu when clicking on any link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  /* ==========================================
     3. FAQ ACCORDION (DYNAMIC HEIGHT)
     ========================================== */
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(faqHeader => {
    faqHeader.addEventListener('click', () => {
      const faqItem = faqHeader.parentElement;
      const faqBody = faqItem.querySelector('.faq-body');
      const isActive = faqItem.classList.contains('active');

      // Close all FAQs first for clean single-expand behavior
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-body').style.maxHeight = null;
      });

      // If clicked one wasn't active, open it
      if (!isActive) {
        faqItem.classList.add('active');
        // Set height based on scrollHeight for smooth transition
        faqBody.style.maxHeight = faqBody.scrollHeight + "px";
      }
    });
  });

  /* ==========================================
     4. INTERACTIVE QUIZ / SIMULATOR
     ========================================== */
  const quizSteps = document.querySelectorAll('.quiz-step');
  const optionButtons = document.querySelectorAll('.quiz-option');
  const prevBtn = document.getElementById('quiz-prev');
  const progressBarFill = document.getElementById('quiz-progress-fill');
  
  let currentQuizStep = 1;
  const userAnswers = {
    profile: '',   // pf, pj, contador
    need: '',      // signature, invoice, partnership...
    priority: ''   // speed, security
  };

  // Pricing & plans data for quiz results
  const plansData = {
    pf: {
      name: 'e-CPF A1 (Pessoa Física)',
      price: 'R$ 139',
      bullets: [
        'Emissão 100% online em minutos',
        'Somente 1 videoconferência por pelo menos 10 anos',
        'Assinatura de contratos com validade jurídica',
        'Ideal para médicos, advogados e cidadãos'
      ],
      planId: 'plan-pf'
    },
    pj: {
      name: 'e-CNPJ A1 (Pessoa Jurídica)',
      price: 'R$ 189',
      bullets: [
        'Emissão rápida via CNH/Biometria',
        'Somente 1 videoconferência por pelo menos 10 anos',
        'Compatível com NFe, NFSe e todos os faturadores',
        'Acesso total ao e-CAC e Receita Federal'
      ],
      planId: 'plan-pj'
    },
    contador: {
      name: 'Combo Contador (Parceria JAWK)',
      price: 'Condições Especiais',
      bullets: [
        'Painel exclusivo para gerenciar clientes',
        'Indicações comissadas ou descontos diretos',
        'Emissão expressa sem burocracia para clientes',
        'Suporte técnico VIP dedicado'
      ],
      planId: 'plan-contador'
    }
  };

  // Option selection logic
  optionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const stepName = button.getAttribute('data-step');
      const optionValue = button.getAttribute('data-val');
      
      // Select visual option
      const siblingOptions = button.parentElement.querySelectorAll('.quiz-option');
      siblingOptions.forEach(opt => opt.classList.remove('selected'));
      button.classList.add('selected');

      // Store answer
      userAnswers[stepName] = optionValue;

      // Handle custom questions in Step 2 based on Step 1
      if (stepName === 'profile') {
        updateStep2Options(optionValue);
      }

      // Automatically advance step with small delay
      setTimeout(() => {
        nextQuizStep();
      }, 300);
    });
  });

  prevBtn.addEventListener('click', () => {
    if (currentQuizStep > 1) {
      currentQuizStep--;
      showQuizStep(currentQuizStep);
    }
  });

  const nextQuizStep = () => {
    if (currentQuizStep < 3) {
      currentQuizStep++;
      showQuizStep(currentQuizStep);
    } else {
      // Calculate and show result
      showQuizResult();
    }
  };

  const showQuizStep = (step) => {
    quizSteps.forEach(stepEl => stepEl.classList.remove('active'));
    document.getElementById(`quiz-step-${step}`).classList.add('active');
    
    // Progress fill update
    const progressPercent = ((step - 1) / 3) * 100;
    progressBarFill.style.width = `${progressPercent || 15}%`;

    // Manage Prev button visibility
    if (step === 1) {
      prevBtn.style.visibility = 'hidden';
    } else {
      prevBtn.style.visibility = 'visible';
    }
  };

  const updateStep2Options = (profile) => {
    const pfNeeds = document.getElementById('quiz-needs-pf');
    const pjNeeds = document.getElementById('quiz-needs-pj');
    const contNeeds = document.getElementById('quiz-needs-contador');

    // Hide all
    pfNeeds.style.display = 'none';
    pjNeeds.style.display = 'none';
    contNeeds.style.display = 'none';

    // Show appropriate
    if (profile === 'pf') {
      pfNeeds.style.display = 'grid';
    } else if (profile === 'pj') {
      pjNeeds.style.display = 'grid';
    } else if (profile === 'contador') {
      contNeeds.style.display = 'grid';
    }
  };

  const showQuizResult = () => {
    progressBarFill.style.width = '100%';
    quizSteps.forEach(stepEl => stepEl.classList.remove('active'));
    const resultStep = document.getElementById('quiz-step-result');
    resultStep.classList.add('active');
    prevBtn.style.visibility = 'hidden';

    // Determine plan recommendation
    let recommendedPlan;
    if (userAnswers.profile === 'contador') {
      recommendedPlan = plansData.contador;
    } else if (userAnswers.profile === 'pj') {
      recommendedPlan = plansData.pj;
    } else {
      recommendedPlan = plansData.pf;
    }

    // Populate recommendation card
    document.getElementById('res-plan-name').textContent = recommendedPlan.name;
    document.getElementById('res-plan-price').textContent = recommendedPlan.price;
    
    const bulletsList = document.getElementById('res-plan-bullets');
    bulletsList.innerHTML = '';
    recommendedPlan.bullets.forEach(bullet => {
      const li = document.createElement('li');
      li.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
        <span>${bullet}</span>
      `;
      bulletsList.appendChild(li);
    });

    // Configure result button to open checkout modal
    const resultActionBtn = document.getElementById('quiz-result-cta');
    resultActionBtn.onclick = () => {
      openModal(recommendedPlan.name, recommendedPlan.price);
    };
  };

  // Restart Quiz function
  window.restartQuiz = () => {
    currentQuizStep = 1;
    userAnswers.profile = '';
    userAnswers.need = '';
    userAnswers.priority = '';
    
    // Reset selected states
    optionButtons.forEach(opt => opt.classList.remove('selected'));
    
    // Show step 1
    showQuizStep(currentQuizStep);
  };

  /* ==========================================
     5. MODAL (CHECKOUT SIMULATOR)
     ========================================== */
  const modalOverlay = document.getElementById('modal-checkout');
  const modalClose = document.getElementById('modal-close');
  const checkoutForm = document.getElementById('checkout-form');
  const modalSummaryName = document.getElementById('modal-summary-name');
  const modalSummaryPrice = document.getElementById('modal-summary-price');
  
  // Attach checkout events to plan cards dynamically
  const planButtons = document.querySelectorAll('.plan-btn');
  planButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const planName = btn.getAttribute('data-plan-name');
      const planPrice = btn.getAttribute('data-plan-price');
      openModal(planName, planPrice);
    });
  });

  const openModal = (planName, planPrice) => {
    modalSummaryName.textContent = planName;
    modalSummaryPrice.textContent = planPrice;
    modalOverlay.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Lock background scroll
  };

  const closeModal = () => {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto'; // Release scroll
    checkoutForm.reset();
    
    // Restore default form screen if previously completed
    document.getElementById('modal-form-content').style.display = 'block';
    document.getElementById('modal-success-content').style.display = 'none';
  };

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Handle Checkout submission
  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const clientName = document.getElementById('checkout-name').value.trim();
    const clientEmail = document.getElementById('checkout-email').value.trim();
    const clientPhone = document.getElementById('checkout-phone').value.trim();

    if (!clientName || !clientEmail || !clientPhone) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    // Success Screen transition
    document.getElementById('modal-form-content').style.display = 'none';
    document.getElementById('modal-success-content').style.display = 'block';
  });

  /* ==========================================
     6. CONTACT FORM VALIDATION
     ========================================== */
  const contactForm = document.getElementById('contact-form');
  const contactFeedback = document.getElementById('contact-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      if (!name || !email || !message) {
        showFeedback('Por favor, preencha todos os campos para enviar.', 'error');
        return;
      }

      // Simple email validation pattern
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        showFeedback('Por favor, insira um e-mail válido.', 'error');
        return;
      }

      // Change button state to loading
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name, email, message })
        });

        const data = await response.json();

        if (response.ok) {
          showFeedback('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
          contactForm.reset();
        } else {
          showFeedback(data.error || 'Erro ao enviar a mensagem. Tente novamente.', 'error');
        }
      } catch (error) {
        console.error('Erro de conexão:', error);
        showFeedback('Falha na comunicação com o servidor. Verifique sua conexão.', 'error');
      } finally {
        // Restore button state
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
      }
    });
  }

  const showFeedback = (msg, type) => {
    contactFeedback.textContent = msg;
    contactFeedback.className = `form-feedback ${type}`;
    
    // Hide feedback after 5 seconds
    setTimeout(() => {
      contactFeedback.style.display = 'none';
    }, 5000);
  };
});
