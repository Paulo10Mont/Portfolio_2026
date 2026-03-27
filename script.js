/* ══════════════════════════════════════════
   SCRIPT.JS — Portfólio Pessoal
   ══════════════════════════════════════════ */

/* ── CURSOR CUSTOMIZADO ── */
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animateCursor() {
  rx += (mx - rx) * 0.18;
  ry += (my - ry) * 0.18;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
  ring.style.left   = rx + 'px';
  ring.style.top    = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .skill-card, .project-card, .tech-badge, .contact-link').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    ring.style.opacity = '0';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.opacity = '1';
  });
});

/* ── PARTÍCULAS ── */
const canvas = document.getElementById('particles-canvas');
const ctx    = canvas.getContext('2d');
let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.vx    = (Math.random() - 0.5) * 0.4;
    this.vy    = (Math.random() - 0.5) * 0.4;
    this.size  = Math.random() * 1.5 + 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.6 ? '#3b82f6'
               : Math.random() > 0.5 ? '#93c5fd'
               : '#1d4ed8';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle   = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
  }
}

function initParticles() {
  particles = Array.from({ length: 120 }, () => new Particle());
}
initParticles();

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
      if (d < 110) {
        ctx.globalAlpha = (1 - d / 110) * 0.08;
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ── TYPED TEXT ── */
let words = [
  'Financeiro',
  'Fluxo de Caixa',
  'Contas a Pagar/Receber',
  'Conciliação Bancária',
  'Automação com IA'
];
let wi = 0, ci = 0, del = false;
const typedEl = document.getElementById('typed');

function typeIt() {
  const w = words[wi];
  typedEl.textContent = del ? w.slice(0, ci--) : w.slice(0, ci++);

  if (!del && ci > w.length) {
    del = true;
    setTimeout(typeIt, 1400);
    return;
  }
  if (del && ci < 0) {
    del = false;
    wi  = (wi + 1) % words.length;
    ci  = 0;
  }
  setTimeout(typeIt, del ? 45 : 80);
}
typeIt();

/* ── INTERSECTION OBSERVER — animações fade-up ── */
const fadeObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => fadeObs.observe(el));

/* ── COUNTER ANIMADO ── */
function animateCount(el, target) {
  let cur = 0;
  const step = target / 40;
  const id = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = Math.round(cur) + '+';
    if (cur >= target) clearInterval(id);
  }, 40);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      document.querySelectorAll('.stat-value[data-count]').forEach(el => {
        animateCount(el, parseInt(el.dataset.count));
      });
      counterObs.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsEl = document.querySelector('.hero-stats');
if (statsEl) counterObs.observe(statsEl);

/* ── FORM SUBMIT ── */
function handleForm(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-btn');
  btn.textContent   = 'Mensagem Enviada ✓';
  btn.style.background = 'var(--accent-green)';
  setTimeout(() => {
    btn.textContent      = 'Enviar Mensagem →';
    btn.style.background = '';
  }, 3000);
  // ✏️ ALTERE: adicione aqui sua lógica de envio (ex: EmailJS, Formspree, fetch para API)
}

/* ══════════════════════════════════════════
   INTERNACIONALIZAÇÃO (i18n) — PT / EN
   ══════════════════════════════════════════ */
const i18n = {
  pt: {
    /* nav */
    'nav.home': 'Home', 'nav.sobre': 'Sobre', 'nav.skills': 'Skills',
    'nav.projetos': 'Projetos', 'nav.contato': 'Contato',
    /* hero */
    'hero.tag': 'Aberto a novas oportunidades',
    'hero.role': 'Analista',
    'hero.bio': 'Analista financeiro com foco em resultados — domínio em contas a pagar e receber, fluxo de caixa e conciliação. Uso Python, Power BI e IA como vantagem competitiva para automatizar processos e entregar mais inteligência ao financeiro.',
    'hero.btn.projetos': 'Ver Projetos',
    'hero.btn.contato': 'Entrar em Contato',
    'hero.stat.anos': 'Anos Exp.',
    'hero.stat.processos': 'Processos Auto.',
    'hero.stat.relatorios': 'Relatórios',
    /* sobre */
    'sobre.label': '// 01 — sobre mim', 'sobre.title': 'Quem sou eu',
    'sobre.p1': 'Sou <strong style="color:var(--text-primary)">Paulo Monteiro</strong>, analista financeiro com sólida experiência em contas a pagar e receber, fluxo de caixa, conciliação bancária e processamento de arquivos de remessa e retorno. Atualmente, sou responsável pela elaboração de relatórios e análise de dados estratégicos para a tomada de decisões.',
    'sobre.p2': 'O que me diferencia é o uso estratégico de tecnologia: combino o domínio financeiro com Python, Excel avançado, Power BI e ferramentas de IA para automatizar rotinas, reduzir erros e entregar análises mais rápidas e precisas.',
    'sobre.p3': '<strong style="color:var(--text-primary)">vibe coding</strong> — uso IA como copiloto para construir soluções que antes exigiriam um time de TI. Isso não é substituto para o conhecimento financeiro, é uma vantagem competitiva real.',
    'terminal.role': '"Analista Financeiro"',
    'terminal.focus': '["CP/CR", "Fluxo de Caixa", "Relatório"]',
    /* skills */
    'skills.label': '// 02 — habilidades', 'skills.title': 'Stack & Competências',
    'skill.gestao.name': 'Análise Financeira',
    'skill.gestao.desc': 'Contas a pagar e receber, controle de fluxo de caixa e conciliação bancária com precisão e visão estratégica.',
    'skill.gestao.tag1': 'Contas a Pagar', 'skill.gestao.tag2': 'Contas a Receber',
    'skill.gestao.tag3': 'Fluxo de Caixa', 'skill.gestao.tag4': 'Conciliação',
    'skill.remessa.name': 'Remessa & Retorno',
    'skill.remessa.desc': 'Processamento e automação de arquivos CNAB 240/400, integração bancária e conciliação automática de cobranças.',
    'skill.remessa.tag1': 'Cobrança Bancária',
    'skill.python.desc': 'Automação de processos financeiros, leitura de arquivos CNAB, geração de relatórios e tratamento de dados com bibliotecas modernas.',
    'skill.tag.automacao': 'Automação',
    'skill.excel.name': 'Excel Avançado',
    'skill.excel.desc': 'Modelagem financeira, controle de fluxo de caixa, tabelas dinâmicas e automação de rotinas com Power Query e fórmulas avançadas.',
    'skill.excel.tag1': 'Tabelas Dinâmicas', 'skill.excel.tag2': 'Fórmulas',
    'skill.powerbi.desc': 'Dashboards financeiros interativos, indicadores de fluxo de caixa e relatórios executivos com modelagem DAX.',
    'skill.powerbi.tag1': 'Dashboards',
    'skill.english.name': 'Inglês Profissional',
    'skill.english.desc': 'Leitura técnica, documentação, comunicação com stakeholders internacionais e navegação fluente em ferramentas e conteúdo em inglês.',
    'skill.english.tag1': 'Leitura Técnica', 'skill.english.tag2': 'Documentação', 'skill.english.tag3': 'Comunicação',
    'skill.vibe.name': 'Vibe Coding & IA',
    'skill.vibe.desc': 'Uso estratégico de IA para construir automações, gerar scripts financeiros e acelerar soluções — sem precisar de time de TI. Essa é a vantagem competitiva.',
    'badge.english': 'English',
    'badge.python.info': 'Automação de processos financeiros, leitura de arquivos CNAB, geração de relatórios e tratamento de dados com pandas e openpyxl.',
    'badge.excel.info': 'Modelagem financeira, tabelas dinâmicas, fórmulas avançadas (PROCV, ÍNDICE/CORRESP) e automação com Power Query.',
    'badge.powerbi.info': 'Criação de dashboards interativos, KPIs financeiros e relatórios executivos com modelagem DAX avançada.',
    'badge.ia.info': 'Uso de IA como copiloto para construir soluções financeiras, gerar scripts e acelerar automações — sem depender de TI.',
    'badge.powerquery.info': 'Transformação e limpeza de dados diretamente no Excel ou Power BI: unpivot, merge, filtragem e tipagem automática.',
    'badge.english.info': 'Inglês profissional para leitura técnica, documentação e comunicação com ferramentas e times internacionais.',
    /* projetos */
    'projetos.label': '// 03 — projetos', 'projetos.title': 'Trabalhos Recentes',
    'proj.num1': 'PROJETO_01', 'proj.num2': 'PROJETO_02', 'proj.num3': 'PROJETO_03', 'proj.num4': 'PROJETO_04',
    'proj.title1': 'Gerador de Remessa PIX (CNAB)',
    'proj.title2': 'Editor de Arquivo de Retorno Bancário',
    'proj.title3': 'Explorador de PDFs com Busca Full-Text',
    'proj.title4': 'Extrator de Extratos Jurídicos em PDF',
    'proj.status.done': 'Concluído', 'proj.status.wip': 'Em Progresso',
    'proj.desc1': 'Script Python para geração automática de arquivos de remessa PIX no layout CNAB 500. Automatiza a criação de instruções de pagamento em lote com formatação bancária precisa, conversão de moeda e validação dos dados antes do envio ao banco.',
    'proj.desc2': 'Aplicação desktop para correção e edição de arquivos de retorno bancário (.RET). Interface gráfica com recálculo automático de totalizadores, correção de datas e transformação de códigos. Distribuído como executável independente (.exe).',
    'proj.desc3': 'Aplicação desktop para indexação e busca em documentos PDF. Usa SQLite com FTS5 para busca de texto completo, preview de páginas, indexação multi-thread e organização de arquivos — tudo via interface gráfica.',
    'proj.desc4': 'Ferramenta para extração automática de dados financeiros de extratos jurídicos em PDF. Usa pdfplumber com clustering de palavras para identificar datas, valores e lançamentos, exportando para Excel formatado com padrão brasileiro.',
    'proj.link.ver': '→ Ver Projeto',
    /* contato */
    'contato.label': '// 04 — contato', 'contato.title': 'Vamos Conversar',
    'contato.text': 'Estou aberto a oportunidades como analista financeiro, projetos de automação financeira e colaborações que envolvam Python, Power BI ou IA aplicada ao financeiro. Se você quer transformar processos financeiros com tecnologia, vamos trocar uma ideia.',
    'form.nome': 'Nome', 'form.email': 'E-mail', 'form.mensagem': 'Mensagem',
    'form.ph.nome': 'Seu nome', 'form.ph.email': 'seu@email.com',
    'form.ph.msg': 'Descreva seu projeto ou oportunidade...',
    'form.btn': 'Enviar Mensagem →',
    /* footer */
    'footer.copy': '© 2026 — Financeiro com inteligência ⚡',
  },
  en: {
    /* nav */
    'nav.home': 'Home', 'nav.sobre': 'About', 'nav.skills': 'Skills',
    'nav.projetos': 'Projects', 'nav.contato': 'Contact',
    /* hero */
    'hero.tag': 'Open to new opportunities',
    'hero.role': 'Financial',
    'hero.bio': 'Financial analyst focused on results — expertise in accounts payable and receivable, cash flow management and reconciliation. I use Python, Power BI and AI as a competitive edge to automate processes and deliver smarter financial insights.',
    'hero.btn.projetos': 'View Projects',
    'hero.btn.contato': 'Get in Touch',
    'hero.stat.anos': 'Years Exp.',
    'hero.stat.processos': 'Auto. Processes',
    'hero.stat.relatorios': 'Reports',
    /* sobre */
    'sobre.label': '// 01 — about me', 'sobre.title': 'About Me',
    'sobre.p1': 'I\'m <strong style="color:var(--text-primary)">Paulo Monteiro</strong>, a financial analyst with solid experience in accounts payable and receivable, cash flow management, bank reconciliation and processing of remittance and return files. I\'m currently responsible for preparing reports and strategic data analysis for decision-making.',
    'sobre.p2': 'What sets me apart is the strategic use of technology: I combine financial domain expertise with Python, advanced Excel, Power BI and AI tools to automate routines, reduce errors and deliver faster, more accurate analyses.',
    'sobre.p3': '<strong style="color:var(--text-primary)">vibe coding</strong> — I use AI as a co-pilot to build solutions that used to require a full IT team. This doesn\'t replace financial knowledge, it\'s a real competitive advantage.',
    'terminal.role': '"Financial Analyst"',
    'terminal.focus': '["CP/CR", "Cash Flow", "Report"]',
    /* skills */
    'skills.label': '// 02 — skills', 'skills.title': 'Stack & Skills',
    'skill.gestao.name': 'Financial Analysis',
    'skill.gestao.desc': 'Accounts payable and receivable, cash flow control and bank reconciliation with precision and strategic vision.',
    'skill.gestao.tag1': 'Accounts Payable', 'skill.gestao.tag2': 'Accounts Receivable',
    'skill.gestao.tag3': 'Cash Flow', 'skill.gestao.tag4': 'Reconciliation',
    'skill.remessa.name': 'Remittance & Return',
    'skill.remessa.desc': 'Processing and automation of CNAB 240/400 files, bank integration and automatic charge reconciliation.',
    'skill.remessa.tag1': 'Bank Billing',
    'skill.python.desc': 'Financial process automation, CNAB file reading, report generation and data processing with modern libraries.',
    'skill.tag.automacao': 'Automation',
    'skill.excel.name': 'Advanced Excel',
    'skill.excel.desc': 'Financial modeling, cash flow control, pivot tables and workflow automation with Power Query and advanced formulas.',
    'skill.excel.tag1': 'Pivot Tables', 'skill.excel.tag2': 'Formulas',
    'skill.powerbi.desc': 'Interactive financial dashboards, cash flow KPIs and executive reports with advanced DAX modeling.',
    'skill.powerbi.tag1': 'Dashboards',
    'skill.english.name': 'Professional English',
    'skill.english.desc': 'Technical reading, documentation, communication with international stakeholders and fluent navigation of tools and content in English.',
    'skill.english.tag1': 'Technical Reading', 'skill.english.tag2': 'Documentation', 'skill.english.tag3': 'Communication',
    'skill.vibe.name': 'Vibe Coding & AI',
    'skill.vibe.desc': "Strategic use of AI to build automations, generate financial scripts and accelerate solutions — without needing a full IT team. That's the competitive edge.",
    'badge.english': 'English',
    'badge.python.info': 'Financial process automation, CNAB file reading, report generation and data handling with pandas and openpyxl.',
    'badge.excel.info': 'Financial modeling, pivot tables, advanced formulas (VLOOKUP, INDEX/MATCH) and automation with Power Query.',
    'badge.powerbi.info': 'Interactive dashboards, financial KPIs and executive reports with DAX modeling.',
    'badge.ia.info': 'Using AI as a co-pilot to build financial solutions, generate scripts and accelerate automations — no IT dependency.',
    'badge.powerquery.info': 'Data transformation and cleaning directly in Excel or Power BI: unpivot, merge, filtering and auto typing.',
    'badge.english.info': 'Professional English for technical reading, documentation and communication with international tools and teams.',
    /* projetos */
    'projetos.label': '// 03 — projects', 'projetos.title': 'Recent Work',
    'proj.num1': 'PROJECT_01', 'proj.num2': 'PROJECT_02', 'proj.num3': 'PROJECT_03', 'proj.num4': 'PROJECT_04',
    'proj.title1': 'PIX Remittance Generator (CNAB)',
    'proj.title2': 'Bank Return File Editor',
    'proj.title3': 'PDF Explorer with Full-Text Search',
    'proj.title4': 'Legal Statement PDF Extractor',
    'proj.status.done': 'Completed', 'proj.status.wip': 'In Progress',
    'proj.desc1': 'Python script for automatic generation of PIX remittance files in the CNAB 500 layout. Automates the creation of batch payment instructions with precise banking formatting, currency conversion and data validation before sending to the bank.',
    'proj.desc2': 'Desktop application for editing and correcting bank return files (.RET). GUI with automatic recalculation of totals, date correction and code transformation. Distributed as a standalone executable (.exe).',
    'proj.desc3': 'Desktop application for indexing and searching PDF documents. Uses SQLite with FTS5 for full-text search, page preview, multi-threaded indexing and file organization — all through a graphical interface.',
    'proj.desc4': 'Tool for automatic extraction of financial data from legal PDF statements. Uses pdfplumber with word clustering to identify dates, amounts and entries, exporting to formatted Excel using Brazilian standards.',
    'proj.link.ver': '→ View Project',
    /* contato */
    'contato.label': '// 04 — contact', 'contato.title': "Let's Talk",
    'contato.text': "I'm open to opportunities as a financial analyst, financial automation projects and collaborations involving Python, Power BI or AI applied to finance. If you want to transform financial processes with technology, let's connect.",
    'form.nome': 'Name', 'form.email': 'E-mail', 'form.mensagem': 'Message',
    'form.ph.nome': 'Your name', 'form.ph.email': 'your@email.com',
    'form.ph.msg': 'Describe your project or opportunity...',
    'form.btn': 'Send Message →',
    /* footer */
    'footer.copy': '© 2026 — Finance with intelligence ⚡',
  }
};

const typedByLang = {
  pt: ['Financeiro', 'Fluxo de Caixa', 'Contas a Pagar/Receber', 'Conciliação Bancária', 'Automação com IA'],
  en: ['Analyst', 'Cash Flow Manager', 'AP/AR Specialist', 'Automation Expert']
};

let currentLang = localStorage.getItem('lang') || 'pt';

function applyTranslations(lang) {
  const t = i18n[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const v = t[el.dataset.i18n];
    if (v !== undefined) el.textContent = v;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const v = t[el.dataset.i18nHtml];
    if (v !== undefined) el.innerHTML = v;
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const v = t[el.dataset.i18nPh];
    if (v !== undefined) el.placeholder = v;
  });
  document.querySelectorAll('.tech-badge[data-info-key]').forEach(badge => {
    const popup = badge.querySelector('.badge-popup');
    if (popup) popup.textContent = t[badge.dataset.infoKey] || '';
  });
  words.splice(0, words.length, ...typedByLang[lang]);
  wi = 0; ci = 0; del = false;
  document.getElementById('lang-toggle').textContent = lang === 'pt' ? 'EN' : 'PT';
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  currentLang = lang;
  localStorage.setItem('lang', lang);
}

function toggleLang() { applyTranslations(currentLang === 'pt' ? 'en' : 'pt'); }

applyTranslations(currentLang);

/* ── HIGHLIGHT NAVBAR AO ROLAR ── */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let curr = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 200) curr = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + curr
      ? 'var(--accent-cyan)'
      : '';
  });
});

/* ── TECH BADGE POPUP AO CLICAR ── */
document.querySelectorAll('.tech-badge[data-info-key]').forEach(badge => {
  badge.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = badge.classList.contains('badge-open');
    document.querySelectorAll('.tech-badge.badge-open').forEach(b => b.classList.remove('badge-open'));
    if (!isOpen) badge.classList.add('badge-open');
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('.tech-badge.badge-open').forEach(b => b.classList.remove('badge-open'));
});