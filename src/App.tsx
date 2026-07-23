/* ============================================================================
 *  Wolfgang Carneiro — Portfólio de Desenvolvedor
 *  App.tsx · React + TypeScript (single-file)
 *  Stack de UI: CSS puro (App.module.css) · Boxicons · AOS · Notyf
 *  Tema padrão: Dark · alternável para Light
 * ========================================================================== */

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type FC,
  type FormEvent,
  type ReactNode,
} from 'react';

import AOS from 'aos';
import 'aos/dist/aos.css';

import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

import emailjs from '@emailjs/browser';

import styles from './App.module.css';

/* ---------------------------------------------------------------------------
 *  Configuração do EmailJS  ─  https://dashboard.emailjs.com
 *  Substitua os 3 valores abaixo pelos da sua conta (Email Services / Templates
 *  / Account > API Keys). No template do EmailJS use as variáveis:
 *  {{name}}, {{email}}, {{subject}}, {{message}}.
 * ------------------------------------------------------------------------- */
const EMAILJS_SERVICE_ID = 'service_wrscmd3';   // ex.: service_ab12cde
const EMAILJS_TEMPLATE_ID = 'template_qhg22ug'; // ex.: template_xy34fgh
const EMAILJS_PUBLIC_KEY = 'Njh7EpQ8FiC9FysSr';   // ex.: AbCdEf123456

/* ---------------------------------------------------------------------------
 *  Configuração do botão flutuante do WhatsApp
 *  Número em formato internacional, apenas dígitos (DDI + DDD + número).
 * ------------------------------------------------------------------------- */
const WHATSAPP_NUMBER = '5581973432910';

/** Gera uma mensagem de saudação dinâmica de acordo com o horário do visitante. */
function buildWhatsappMessage(): string {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  return `${greeting}, Wolfgang! Vi seu portfólio e gostaria de conversar sobre uma oportunidade.`;
}

/** Monta o link do WhatsApp (wa.me) já com a mensagem pré-preenchida e codificada. */
function buildWhatsappLink(): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsappMessage())}`;
}

/* ---------------------------------------------------------------------------
 *  Tipagens do domínio
 * ------------------------------------------------------------------------- */
type Theme = 'dark' | 'light';

interface NavItem {
  id: string;
  label: string;
}

interface SkillGroup {
  icon: string;        // classe do Boxicons (ex.: 'bx bx-code-alt')
  title: string;
  tags: readonly string[];
}

interface Experience {
  period: string;
  role: string;
  company: string;
}

interface Project {
  title: string;
  description: string;
  image: string;       // placeholder — troque pela imagem real
  stack: readonly string[];
  deployUrl: string;   // placeholder — troque pelo link de deploy
  gitUrl: string;      // placeholder — troque pelo link do repositório
  featured?: boolean;
}

/* ---------------------------------------------------------------------------
 *  Dados (extraídos do currículo — fáceis de editar)
 * ------------------------------------------------------------------------- */
const NAV_ITEMS: readonly NavItem[] = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'habilidades', label: 'Habilidades' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'contato', label: 'Contato' },
];

const ROLES: readonly string[] = [
  'Desenvolvedor Delphi Jr.',
  'Sistemas ERP & Automação Comercial',
  'Firebird · SQL · ACBr · FastReport',
  'Integração via APIs REST',
];

const SKILLS: readonly SkillGroup[] = [
  {
    icon: 'bx bxl-delphi',
    title: 'Delphi / Object Pascal',
    tags: ['Delphi 7', 'Delphi 10', 'Delphi 12', 'VCL', 'DataSnap'],
  },
  {
    icon: 'bx bx-data',
    title: 'Bancos de Dados',
    tags: ['Firebird', 'SQL', 'IBExpert', 'Modelagem', 'Tuning'],
  },
  {
    icon: 'bx bx-store-alt',
    title: 'Automação Comercial',
    tags: ['ACBr', 'NF-e', 'PDV', 'Regras de Negócio', 'Estoque'],
  },
  {
    icon: 'bx bx-transfer-alt',
    title: 'Integrações & APIs',
    tags: ['API REST', 'JSON', 'Consumo', 'Criação', 'Endpoints'],
  },
  {
    icon: 'bx bx-file',
    title: 'Relatórios',
    tags: ['FastReport', 'Relatórios dinâmicos', 'Layouts personalizados'],
  },
  {
    icon: 'bx bxl-git',
    title: 'Versionamento',
    tags: ['Git', 'GitHub', 'Branches', 'Merges', 'Colaboração'],
  },
  {
    icon: 'bx bx-code-alt',
    title: 'Front-end',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsividade'],
  },
  {
    icon: 'bx bx-line-chart',
    title: 'Ferramentas & Soft Skills',
    tags: ['Excel', 'Google Sheets', 'Liderança', 'Análise'],
  },
];

const EXPERIENCE: readonly Experience[] = [
  {
    period: '08/2025 — Atual',
    role: 'Desenvolvedor Jr. I',
    company: 'ONGOLD Tecnologia · Limoeiro, PE',
  },
  {
    period: '01/2025 — 07/2025',
    role: 'Suporte Técnico em TI',
    company: 'ONGOLD Tecnologia · Limoeiro, PE',
  },
  {
    period: '08/2021 — 06/2024',
    role: 'Supervisor de Instalação',
    company: 'Dtel Telecom · Carpina, PE',
  },
  {
    period: '08/2020 — 07/2021',
    role: 'Instalador de Internet',
    company: 'Dtel Telecom · Carpina, PE',
  },
];

/* Imagens: placeholders do Unsplash — substitua pelas capturas reais.
 * Dica: coloque prints em /public e use "/img/nome.png". */
const PROJECTS: readonly Project[] = [
  {
    title: 'Consultar CNPJ',
    description:
      'Aplicação desktop em Delphi que consome APIs REST para consulta de dados '
      + 'cadastrais de empresas a partir do CNPJ. Trata retornos em JSON, valida '
      + 'entradas e exibe os resultados de forma organizada — pensada para o dia a '
      + 'dia de cadastro e conferência em automação comercial.',
    image:
      'ConsultarCNPJ.webp',
    stack: ['Delphi', 'API REST', 'JSON', 'Firebird'],
    deployUrl: '#', // TODO: link do release/executável
    gitUrl: '#',    // TODO: repositório do projeto
    featured: true,
  },
  {
    title: 'Calculadora Delphi',
    description:
      'Um projeto que marcou meu avanço no aprendizado de Delphi, '
      + 'explorando recursos da linguagem e práticas de desenvolvimento profissional.',
    image:
      'CalculadoraDelphi.webp',
    stack: ['Delphi', 'VCL', 'Object Pascal'],
    deployUrl: '#',
    gitUrl: '#',
  },
  {
    title: 'MediCenter',
    description:
      'Projeto de tela principal em HTML e CSS, inteiramente construído com Flexbox, '
      + 'destacando habilidades em design e organização de layouts responsivos.',
    image:
      'MediCenter.webp',
    stack: ['HTML', 'CSS', 'JavaScript'],
    deployUrl: '#',
    gitUrl: '#',
  },
  {
    title: 'TheKingBurguer',
    description:
      'Cardápio online interativo para hamburgueria: navegação por categorias, '
      + 'carrinho e experiência mobile-first.',
    image:
      'TheKingBurguer.webp',
    stack: ['HTML', 'CSS', 'JavaScript'],
    deployUrl: '#',
    gitUrl: '#',
  },
  {
    title: 'Calculadora IMC',
    description:
      'Este projeto é uma calculadora de IMC (Índice de Massa Corporal '
      + 'desenvolvida em Delphi (VCL).',
    image:
      'CalculadoraIMC.webp',
    stack: ['Delphi', 'VCL'],
    deployUrl: '#',
    gitUrl: '#',
  },
];

/* ---------------------------------------------------------------------------
 *  Hook: efeito de digitação para os cargos do Hero
 * ------------------------------------------------------------------------- */
function useTypewriter(words: readonly string[], speed = 70, pause = 1600): string {
  const [text, setText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    const done = !deleting && text === current;
    const cleared = deleting && text === '';

    const delay = done ? pause : deleting ? speed / 2 : speed;

    const timer = window.setTimeout(() => {
      if (done) {
        setDeleting(true);
      } else if (cleared) {
        setDeleting(false);
        setWordIndex((i) => i + 1);
      } else {
        const next = deleting
          ? current.slice(0, text.length - 1)
          : current.slice(0, text.length + 1);
        setText(next);
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [text, deleting, wordIndex, words, speed, pause]);

  return text;
}

/* ---------------------------------------------------------------------------
 *  Sub-componente: Navbar (desktop + gatilho do menu mobile)
 * ------------------------------------------------------------------------- */
interface NavbarProps {
  theme: Theme;
  scrolled: boolean;
  onToggleTheme: () => void;
  onOpenMenu: () => void;
}

const Navbar: FC<NavbarProps> = ({ theme, scrolled, onToggleTheme, onOpenMenu }) => (
  <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
    <div className={styles.navInner}>
      <a href="#inicio" className={styles.logo} aria-label="Ir para o início">
        <span className={styles.logoBracket}>&lt;</span>
        <span className={styles.logoName}>Wolfgang</span>
        <span className={styles.logoBracket}>/&gt;</span>
        <span className={styles.logoCursor} aria-hidden="true" />
      </a>

      <ul className={styles.navLinks}>
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={styles.navLink}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <div className={styles.navActions}>
        <button
          type="button"
          className={styles.themeBtn}
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
        >
          <i className={theme === 'dark' ? 'bx bx-sun' : 'bx bx-moon'} />
        </button>

        <button
          type="button"
          className={styles.burger}
          onClick={onOpenMenu}
          aria-label="Abrir menu"
        >
          <i className="bx bx-menu" />
        </button>
      </div>
    </div>
  </nav>
);

/* ---------------------------------------------------------------------------
 *  Sub-componente: Drawer (menu mobile)
 * ------------------------------------------------------------------------- */
interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
}

const MobileMenu: FC<MobileMenuProps> = ({ open, onClose }) => (
  <>
    <div
      className={`${styles.mobileOverlay} ${open ? styles.mobileOverlayOpen : ''}`}
      onClick={onClose}
      aria-hidden="true"
    />
    <aside
      className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu de navegação"
    >
      <div className={styles.drawerHead}>
        <span className={styles.logo}>
          <span className={styles.logoBracket}>&lt;</span>
          <span className={styles.logoName}>WC</span>
          <span className={styles.logoBracket}>/&gt;</span>
        </span>
        <button
          type="button"
          className={styles.drawerClose}
          onClick={onClose}
          aria-label="Fechar menu"
        >
          <i className="bx bx-x" />
        </button>
      </div>

      <ul className={styles.drawerLinks}>
        {NAV_ITEMS.map((item, i) => (
          <li key={item.id}>
            <a href={`#${item.id}`} className={styles.drawerLink} onClick={onClose}>
              <span className={styles.idx}>0{i + 1}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ul>

      <div className={styles.drawerFoot}>
        <a
          className={styles.drawerSocial}
          href="https://github.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <i className="bx bxl-github" />
        </a>
        <a
          className={styles.drawerSocial}
          href="https://www.linkedin.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <i className="bx bxl-linkedin" />
        </a>
        <a
          className={styles.drawerSocial}
          href="mailto:wolfgang.alexandre15@gmail.com"
          aria-label="E-mail"
        >
          <i className="bx bx-envelope" />
        </a>
      </div>
    </aside>
  </>
);

/* ---------------------------------------------------------------------------
 *  Sub-componente: cabeçalho de seção reutilizável
 * ------------------------------------------------------------------------- */
interface SectionHeadProps {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
}

const SectionHead: FC<SectionHeadProps> = ({ eyebrow, title, lead }) => (
  <header data-aos="fade-up">
    <span className={styles.eyebrow}>{eyebrow}</span>
    <h2 className={styles.sectionTitle}>{title}</h2>
    {lead ? <p className={styles.sectionLead}>{lead}</p> : null}
  </header>
);

/* ---------------------------------------------------------------------------
 *  Sub-componente: Hero
 * ------------------------------------------------------------------------- */
const Hero: FC = () => {
  const typed = useTypewriter(ROLES);

  return (
    <section id="inicio" className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.heroGrid}>
          {/* Coluna de texto */}
          <div data-aos="fade-up">
            <span className={styles.heroStatus}>
              <span className={styles.pulse} />
              Disponível para novos desafios
            </span>

            <h1 className={styles.heroTitle}>
              <span className={styles.line}>Wolfgang</span>
              <span className={`${styles.line} ${styles.gradText}`}>Carneiro</span>
            </h1>

            <p className={styles.heroRole}>
              {typed}
              <span className={styles.caret}>|</span>
            </p>

            <p className={styles.heroDesc}>
              Desenvolvedor focado em sistemas ERP para automação comercial.
              Da linha de frente do suporte técnico à liderança de equipes, trago
              domínio real das regras de negócio para escrever código que resolve
              problemas do varejo — emissão de NF-e, controle de estoque e PDV.
            </p>

            <div className={styles.heroCtas}>
              <a href="#projetos" className={`${styles.btn} ${styles.btnPrimary}`}>
                <i className="bx bx-code-block" />
                Ver projetos
              </a>
              <a href="#contato" className={`${styles.btn} ${styles.btnGhost}`}>
                <i className="bx bx-send" />
                Entrar em contato
              </a>
            </div>

            <div className={styles.heroStats}>
              <div className={styles.stat}>
                <span className={styles.statNum}>5+</span>
                <span className={styles.statLabel}>anos em tecnologia</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>ERP</span>
                <span className={styles.statLabel}>automação comercial</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNum}>Delphi</span>
                <span className={styles.statLabel}>7 · 10 · 12</span>
              </div>
            </div>
          </div>

          {/* Coluna visual: janela de IDE (assinatura) */}
          <div data-aos="fade-left" data-aos-delay="120">
            <div className={styles.window}>
              <div className={styles.windowBar}>
                <span className={`${styles.dot} ${styles.dotR}`} />
                <span className={`${styles.dot} ${styles.dotY}`} />
                <span className={`${styles.dot} ${styles.dotG}`} />
                <span className={styles.windowFile}>wolfgang.dev</span>
              </div>

              <div className={styles.windowBody}>
                <div className={styles.portraitWrap}>
                  {/* Substitua por /person.png (arquivo em /public) */}
                  <img
                    className={styles.portrait}
                    src="person.png"
                    alt="Retrato de Wolfgang Carneiro"
                    loading="eager"
                  />
                  <span className={styles.portraitTag}>
                    <b>~/</b> dev-jr
                  </span>
                </div>
              </div>

              <div className={styles.floatChip}>
                <i className="bx bx-terminal" />
                firebird · running
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------------------
 *  Sub-componente: Sobre
 * ------------------------------------------------------------------------- */
const About: FC = () => (
  <section id="sobre" className={styles.section}>
    <div className={styles.container}>
      <SectionHead
        eyebrow="quem_sou.md"
        title={<>Da operação ao <span className={styles.gradText}>código</span></>}
      />

      <div className={styles.aboutGrid}>
        <div className={styles.aboutText} data-aos="fade-up">
          <p>
            Sou <strong>Desenvolvedor Delphi Jr.</strong>,
            atuando no desenvolvimento de sistemas ERP para o varejo. Trabalho
            diariamente com <strong>Delphi 7, 10 e 12</strong>, modelando e
            otimizando bancos <strong>Firebird</strong> e integrando aplicações
            através de <strong>APIs REST</strong>.
          </p>
          <p>
            Minha trajetória começou no <strong>suporte técnico</strong> e passou
            pela <strong>liderança de equipes</strong> — experiência que me deu
            leitura afiada das regras de negócio, capacidade analítica e sangue-frio
            para resolver problemas complexos. Conheço a dor do cliente antes de
            escrever a solução.
          </p>
          <p>
            Formado em <strong>Análise e Desenvolvimento de Sistemas</strong> pela
            UNINASSAU, sigo aprofundando conhecimentos em <strong>ACBr</strong>,{' '}
            <strong>FastReport</strong> e boas práticas de engenharia de software.
          </p>
        </div>

        <div className={styles.aboutCards}>
          <div className={styles.infoCard} data-aos="fade-up" data-aos-delay="60">
            <span className={styles.infoIcon}><i className="bx bx-map" /></span>
            <div>
              <h4>Localização</h4>
              <p>Recife, Pernambuco — Brasil</p>
            </div>
          </div>
          <div className={styles.infoCard} data-aos="fade-up" data-aos-delay="120">
            <span className={styles.infoIcon}><i className="bx bx-briefcase-alt" /></span>
            <div>
              <h4>Foco atual</h4>
              <p>ERP, NF-e, estoque e PDV para automação comercial.</p>
            </div>
          </div>
          <div className={styles.infoCard} data-aos="fade-up" data-aos-delay="180">
            <span className={styles.infoIcon}><i className="bx bx-message-rounded-dots" /></span>
            <div>
              <h4>Idiomas</h4>
              <p>Português (nativo) · Inglês (A2 básico)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Linha do tempo profissional */}
      <div className={styles.timeline} data-aos="fade-up">
        {EXPERIENCE.map((exp) => (
          <div className={styles.tlItem} key={`${exp.period}-${exp.role}`}>
            <span className={styles.tlDate}>{exp.period}</span>
            <h3 className={styles.tlRole}>{exp.role}</h3>
            <p className={styles.tlCompany}>{exp.company}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ---------------------------------------------------------------------------
 *  Sub-componente: Habilidades
 * ------------------------------------------------------------------------- */
const Skills: FC = () => {
  // Micro-interação: brilho segue o cursor sobre o card
  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  }, []);

  return (
    <section id="habilidades" className={styles.section}>
      <div className={styles.container}>
        <SectionHead
          eyebrow="stack.config"
          title={<>Tecnologias & <span className={styles.gradText}>ferramentas</span></>}
          lead="Ferramentas que uso no dia a dia para construir sistemas robustos de automação comercial."
        />

        <div className={styles.skillsGrid}>
          {SKILLS.map((skill, i) => (
            <div
              key={skill.title}
              className={styles.skillCard}
              onMouseMove={handleMove}
              data-aos="zoom-in"
              data-aos-delay={(i % 4) * 60}
            >
              <div className={styles.skillHead}>
                <i className={skill.icon} />
                <h3>{skill.title}</h3>
              </div>
              <div className={styles.skillTags}>
                {skill.tags.map((tag) => (
                  <span className={styles.tag} key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------------------
 *  Sub-componente: card de projeto
 * ------------------------------------------------------------------------- */
interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard: FC<ProjectCardProps> = ({ project, index }) => (
  <article
    className={`${styles.projCard} ${project.featured ? styles.projFeatured : ''}`}
    data-aos="fade-up"
    data-aos-delay={(index % 2) * 80}
  >
    <div className={styles.projInner}>
      <div className={styles.projMedia}>
        {/* Placeholder — troque por print real do projeto (/public ou URL) */}
        <img className={styles.projImg} src={project.image} alt={project.title} loading="lazy" />

        {project.featured ? (
          <span className={styles.projBadge}>
            <i className="bx bx-star" /> Destaque
          </span>
        ) : null}

        <div className={styles.projStack}>
          {project.stack.map((tech) => (
            <span className={styles.stackPill} key={tech}>{tech}</span>
          ))}
        </div>
      </div>

      <div className={styles.projInfo}>
        <h3 className={styles.projTitle}>
          {project.featured ? <i className="bx bx-terminal" /> : null}
          {project.title}
        </h3>
        <p className={styles.projDesc}>{project.description}</p>

        <div className={styles.projActions}>
          <a
            className={`${styles.btn} ${styles.btnPrimary} ${styles.btnSm}`}
            href={project.deployUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bx bx-link-external" /> Deploy
          </a>
          <a
            className={`${styles.btn} ${styles.btnGhost} ${styles.btnSm}`}
            href={project.gitUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="bx bxl-github" /> Git
          </a>
        </div>
      </div>
    </div>
  </article>
);

/* ---------------------------------------------------------------------------
 *  Sub-componente: Projetos
 * ------------------------------------------------------------------------- */
const Projects: FC = () => {
  // Destaque primeiro, depois os demais
  const ordered = [...PROJECTS].sort(
    (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
  );

  return (
    <section id="projetos" className={styles.section}>
      <div className={styles.container}>
        <SectionHead
          eyebrow="projetos/"
          title={<>Coisas que eu <span className={styles.gradText}>construí</span></>}
          lead="Uma seleção de projetos desktop e web — do Delphi ao front-end."
        />

        <div className={styles.projGrid}>
          {ordered.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------------------
 *  Sub-componente: Contato
 * ------------------------------------------------------------------------- */
interface ContactProps {
  notyf: Notyf | null;
}

const Contact: FC<ContactProps> = ({ notyf }) => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const update = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const isValidEmail = (value: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      notyf?.error('Preencha nome, e-mail e mensagem.');
      return;
    }
    if (!isValidEmail(form.email)) {
      notyf?.error('Informe um e-mail válido.');
      return;
    }

    setSending(true);
    try {
      // Envio real via EmailJS. As chaves ficam no topo do arquivo.
      // Os nomes abaixo devem bater com as variáveis do seu template.
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          subject: form.subject || '(sem assunto)',
          message: form.message,
        },
        { publicKey: EMAILJS_PUBLIC_KEY },
      );
      notyf?.success('Mensagem enviada! Retorno em breve.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error('Falha no envio (EmailJS):', err);
      notyf?.error('Não foi possível enviar. Tente novamente ou use o e-mail direto.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contato" className={styles.section}>
      <div className={styles.container}>
        <SectionHead
          eyebrow="contato.init()"
          title={<>Vamos <span className={styles.gradText}>conversar</span></>}
          lead="Aberto a oportunidades, colaborações e projetos. Escolha o canal ou mande uma mensagem direta."
        />

        <div className={styles.contactGrid}>
          <aside className={styles.contactAside} data-aos="fade-up">
            <a className={styles.contactItem} href="mailto:wolfgang.alexandre15@gmail.com">
              <i className="bx bx-envelope" />
              <div>
                <div className={styles.lbl}>e-mail</div>
                <div className={styles.val}>wolfgang.alexandre15@gmail.com</div>
              </div>
            </a>
            <a className={styles.contactItem} href="tel:+5581973432910">
              <i className="bx bx-phone" />
              <div>
                <div className={styles.lbl}>telefone</div>
                <div className={styles.val}>(81) 97343-2910</div>
              </div>
            </a>
            <div className={styles.contactItem}>
              <i className="bx bx-map-pin" />
              <div>
                <div className={styles.lbl}>localização</div>
                <div className={styles.val}>Recife, Pernambuco — BR</div>
              </div>
            </div>
          </aside>

          <form className={styles.form} onSubmit={handleSubmit} noValidate data-aos="fade-up" data-aos-delay="80">
            <div className={styles.formRow}>
              <div className={styles.field}>
                <label htmlFor="name">Nome</label>
                <input
                  id="name"
                  className={styles.input}
                  type="text"
                  placeholder="Seu nome"
                  value={form.name}
                  onChange={update('name')}
                  autoComplete="name"
                />
              </div>
              <div className={styles.field}>
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  className={styles.input}
                  type="email"
                  placeholder="voce@email.com"
                  value={form.email}
                  onChange={update('email')}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="subject">Assunto</label>
              <input
                id="subject"
                className={styles.input}
                type="text"
                placeholder="Sobre o que quer falar?"
                value={form.subject}
                onChange={update('subject')}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="message">Mensagem</label>
              <textarea
                id="message"
                className={styles.textarea}
                placeholder="Escreva sua mensagem..."
                value={form.message}
                onChange={update('message')}
              />
            </div>

            <button
              type="submit"
              className={`${styles.btn} ${styles.btnPrimary} ${styles.formSubmit}`}
              disabled={sending}
            >
              <i className={sending ? 'bx bx-loader-alt bx-spin' : 'bx bx-send'} />
              {sending ? 'Enviando...' : 'Enviar mensagem'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------------------------------
 *  Sub-componente: Botão Flutuante do WhatsApp
 *  Link dinâmico (saudação conforme o horário) + efeito de pulso em CSS.
 * ------------------------------------------------------------------------- */
const WhatsAppButton: FC = () => {
  // useState garante que o link seja calculado uma vez por sessão de visita,
  // evitando recomputar a saudação a cada re-render do App.
  const [href] = useState<string>(buildWhatsappLink);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsappBtn}
      aria-label="Conversar no WhatsApp"
      title="Fale comigo no WhatsApp"
    >
      <span className={styles.whatsappPulse} aria-hidden="true" />
      <span className={styles.whatsappPulse2} aria-hidden="true" />
      <i className="bx bxl-whatsapp" />
    </a>
  );
};

/* ---------------------------------------------------------------------------
 *  Sub-componente: Footer
 * ------------------------------------------------------------------------- */
const Footer: FC = () => (
  <footer className={styles.footer}>
    <div className={`${styles.container} ${styles.footerInner}`}>
      <div className={styles.footerLeft}>
        <span className={styles.logo}>
          <span className={styles.logoBracket}>&lt;</span>
          <span className={styles.logoName}>Wolfgang</span>
          <span className={styles.logoBracket}>/&gt;</span>
        </span>
        <span className={styles.footerCopy}>
          © {new Date().getFullYear()} · Construído com React + CSS puro
        </span>
      </div>

      <div className={styles.footerSocials}>
        <a className={styles.footerSocial} href="https://github.com/" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
          <i className="bx bxl-github" />
        </a>
        <a className={styles.footerSocial} href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <i className="bx bxl-linkedin" />
        </a>
        <a className={styles.footerSocial} href="mailto:wolfgang.alexandre15@gmail.com" aria-label="E-mail">
          <i className="bx bx-envelope" />
        </a>
      </div>
    </div>
  </footer>
);

/* ---------------------------------------------------------------------------
 *  Componente raiz
 * ------------------------------------------------------------------------- */
const App: FC = () => {
  const [theme, setTheme] = useState<Theme>('dark');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const notyfRef = useRef<Notyf | null>(null);

  // Inicialização de AOS e Notyf (uma vez)
  useEffect(() => {
    AOS.init({ duration: 750, once: true, easing: 'ease-out-cubic', offset: 90 });
    notyfRef.current = new Notyf({
      duration: 3200,
      position: { x: 'right', y: 'top' },
      types: [
        { type: 'success', background: 'linear-gradient(135deg,#8b5cf6,#06e7f7)' },
        { type: 'error', background: '#ef4444' },
      ],
    });
  }, []);

  // Aplica o tema no elemento raiz do documento
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // Listener de scroll (navbar + botão "voltar ao topo")
  useEffect(() => {
    const onScroll = (): void => {
      setScrolled(window.scrollY > 24);
      setShowTop(window.scrollY > 520);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Trava o scroll do body quando o menu mobile está aberto + fecha no ESC
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    [],
  );

  const scrollTop = useCallback(
    () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    [],
  );

  return (
    <div className={styles.app}>
      <div className={styles.ambient} aria-hidden="true" />

      <Navbar
        theme={theme}
        scrolled={scrolled}
        onToggleTheme={toggleTheme}
        onOpenMenu={() => setMenuOpen(true)}
      />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact notyf={notyfRef.current} />
      </main>

      <Footer />

      <WhatsAppButton />

      <button
        type="button"
        className={`${styles.toTop} ${showTop ? styles.toTopShow : ''}`}
        onClick={scrollTop}
        aria-label="Voltar ao topo"
      >
        <i className="bx bx-chevron-up" />
      </button>
    </div>
  );
};

export default App;