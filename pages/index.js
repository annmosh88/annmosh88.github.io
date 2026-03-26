import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [navOpen, setNavOpen] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formState, setFormState] = useState('idle') // idle | loading | success | error
  const [formMsg, setFormMsg] = useState('')
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const mx = useRef(0), my = useRef(0)
  const rx = useRef(0), ry = useRef(0)
  const rafRef = useRef(null)

  // Custom cursor
  useEffect(() => {
    const move = (e) => {
      mx.current = e.clientX
      my.current = e.clientY
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px'
        cursorRef.current.style.top = e.clientY + 'px'
      }
    }
    window.addEventListener('mousemove', move)
    const animate = () => {
      rx.current += (mx.current - rx.current) * 0.12
      ry.current += (my.current - ry.current) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = rx.current + 'px'
        ringRef.current.style.top = ry.current + 'px'
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    animate()
    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const cursorGrow = () => {
    if (cursorRef.current) cursorRef.current.style.transform = 'translate(-50%,-50%) scale(2)'
    if (ringRef.current) { ringRef.current.style.transform = 'translate(-50%,-50%) scale(1.5)'; ringRef.current.style.borderColor = 'rgba(200,134,10,0.7)' }
  }
  const cursorShrink = () => {
    if (cursorRef.current) cursorRef.current.style.transform = 'translate(-50%,-50%) scale(1)'
    if (ringRef.current) { ringRef.current.style.transform = 'translate(-50%,-50%) scale(1)'; ringRef.current.style.borderColor = 'rgba(200,134,10,0.4)' }
  }

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left')
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), i * 80)
      })
    }, { threshold: 0.1 })
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  // Close nav on scroll
  useEffect(() => {
    const close = () => setNavOpen(false)
    window.addEventListener('scroll', close)
    return () => window.removeEventListener('scroll', close)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormState('loading')
    setFormMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (res.ok) {
        setFormState('success')
        setFormMsg('Message sent! I\'ll get back to you soon.')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setFormState('error')
        setFormMsg(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setFormState('error')
      setFormMsg('Network error. Please try again.')
    }
    setTimeout(() => setFormState('idle'), 5000)
  }

  const marqueeItems = ['Frontend Development', 'UI/UX Design', 'Java & SQL', 'React', 'Nairobi, Kenya', 'Open to Work']

  return (
    <>
      <Head>
        <title>Ann Muchiri — Software Developer</title>
        <meta name="description" content="Ann Muchiri — Software Developer & UI/UX Designer based in Nairobi, Kenya. Building real-world applications with Java, SQL and modern web technologies." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Ann Muchiri — Software Developer" />
        <meta property="og:description" content="Software Developer & UI/UX Designer based in Nairobi, Kenya." />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Cursor */}
      <div className="cursor" ref={cursorRef} />
      <div className="cursor-ring" ref={ringRef} />

      {/* NAV */}
      <nav>
        <div className="logo">Ann <em>Muchiri</em></div>
        <ul className={`nav-links${navOpen ? ' open' : ''}`}>
          {['home','expertise','work','experience','contact'].map(s => (
            <li key={s}>
              <a href={`#${s === 'home' ? 'hero' : s}`}
                onClick={() => setNavOpen(false)}
                onMouseEnter={cursorGrow} onMouseLeave={cursorShrink}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </a>
            </li>
          ))}
        </ul>
        <button className="hamburger" onClick={() => setNavOpen(v => !v)} aria-label="Menu">
          <span style={{ transform: navOpen ? 'rotate(45deg) translate(4px,4px)' : '' }} />
          <span style={{ opacity: navOpen ? 0 : 1 }} />
          <span style={{ transform: navOpen ? 'rotate(-45deg) translate(4px,-4px)' : '' }} />
        </button>
      </nav>

      {/* HERO */}
      <section id="hero" className="hero">
        <div className="hero-left">
          <div className="hero-index">Software Developer &amp; UI/UX Designer</div>
          <h1 className="hero-name">
            Ann
            <span className="last">Muchiri.</span>
          </h1>
          <div className="hero-rule" />
          <p className="hero-desc">
            I build real-world applications with Java, SQL and modern web technologies.
            Passionate about crafting interfaces that solve problems and feel effortless to use.
            Based in Nairobi, Kenya — open to opportunities worldwide.
          </p>
          <div className="hero-role">BSc IT · Kisii University &nbsp;·&nbsp; Nairobi, Kenya</div>
          <div className="hero-actions">
            <a href="#work" className="btn-main" onMouseEnter={cursorGrow} onMouseLeave={cursorShrink}>View My Work</a>
            <a href="#contact" className="btn-ghost" onMouseEnter={cursorGrow} onMouseLeave={cursorShrink}>Get in touch</a>
          </div>
        </div>
        <div className="hero-right">
          <img src="/ann.jpeg" alt="Ann Muchiri" />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-bar">
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      {/* EXPERTISE */}
      <section id="expertise" className="expertise">
        <div className="s-inner">
          <div className="s-header reveal">
            <div>
              <div className="s-num">02 — Expertise</div>
              <h2 className="s-title">What I <em>Do</em></h2>
            </div>
            <p className="s-sub">Blending technical skill with design thinking</p>
          </div>
          <div className="exp-grid">
            {[
              { num: '01', icon: '◈', title: 'Frontend Development', desc: 'Building responsive, pixel-perfect web interfaces using modern web technologies. Every interaction is considered, every layout intentional.', tags: ['html','css','javascript','react'] },
              { num: '02', icon: '◉', title: 'UI/UX Design', desc: 'Designing interfaces with intention. From graphic composition to interactive prototypes — I create experiences that guide and delight users.', tags: ['figma','graphic design','prototyping'] },
              { num: '03', icon: '◎', title: 'Software Development', desc: 'Writing clean, maintainable code in Java and SQL. Problem-first thinking applied to build applications that work at scale.', tags: ['java','sql','git','laravel'] },
            ].map((item, i) => (
              <div className="exp-item reveal" key={i} onMouseEnter={cursorGrow} onMouseLeave={cursorShrink}>
                <span className="exp-big-num">{item.num}</span>
                <span className="exp-icon">{item.icon}</span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div className="exp-tags">
                  {item.tags.map(t => <span className="exp-tag" key={t}>{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="work">
        <div className="s-inner">
          <div className="s-header reveal">
            <div>
              <div className="s-num">03 — Selected Work</div>
              <h2 className="s-title">Projects &amp; <em>Builds</em></h2>
            </div>
            <p className="s-sub">Collaborative &amp; independent projects</p>
          </div>
          <div className="work-list">
            {[
              { num: '01', title: 'AgriConnect Hub', desc: 'A smart agricultural platform bridging the gap between Kenyan farmers and digital tools — connecting them with market insights, expert resources, and community support.', cats: ['Web Development','AgriTech'], collab: 'Team Project', link: 'https://github.com/Ayuoyi/agri-connect-hub-87' },
              { num: '02', title: 'Asili Connect', desc: 'A cross-platform mobile application built with React Native and Expo, connecting communities and celebrating local culture through a seamless, accessible mobile experience.', cats: ['Mobile App','React Native'], collab: 'Team Project', link: 'https://github.com/Ayuoyi/Asili-Connect' },
              { num: '03', title: 'KSUCU-MC Website', desc: 'The official full-stack web platform for Kisii University Christian Union — featuring authentication, content management, and community tools for a large student organization.', cats: ['Full Stack','Laravel'], collab: 'Live · Team Project', link: 'https://ksucu-mc.co.ke' },
            ].map((p, i) => (
              <a href={p.link} target="_blank" rel="noopener noreferrer"
                className="work-item reveal" key={i}
                onMouseEnter={cursorGrow} onMouseLeave={cursorShrink}>
                <div className="work-num">{p.num}</div>
                <div className="work-body">
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="work-meta">
                    {p.cats.map(c => <span className="work-cat" key={c}>{c}</span>)}
                    <span className="work-collab">— {p.collab}</span>
                  </div>
                </div>
                <div className="work-right"><span className="work-arrow">↗</span></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="experience">
        <div className="s-inner">
          <div className="s-header reveal">
            <div>
              <div className="s-num">04 — Background</div>
              <h2 className="s-title">Education &amp; <em>Growth</em></h2>
            </div>
            <p className="s-sub">Building foundations, one skill at a time</p>
          </div>
          <div className="exp-education">
            <div className="edu-col reveal-left">
              <div className="col-label">Education</div>
              <div className="edu-item">
                <div className="edu-date">2023 — Present</div>
                <h3>BSc Information Technology</h3>
                <div className="org">Kisii University — Kisii, Kenya</div>
                <p>Studying software development, databases, and systems design. Actively involved in collaborative tech projects and campus developer communities.</p>
              </div>
              <div className="edu-item">
                <div className="edu-date">Certificate</div>
                <h3>Graphic Design</h3>
                <div className="org">Petanns Technical College — Nakuru, Kenya</div>
                <p>Professional training in visual communication, layout design, and creative tools — a foundation that directly informs my UI/UX design practice.</p>
              </div>
            </div>
            <div className="exp-col reveal">
              <div className="col-label">Skills &amp; Contributions</div>
              <div className="edu-item">
                <div className="edu-date">Ongoing</div>
                <h3>Open Source Contributor</h3>
                <div className="org">GitHub — annmosh88</div>
                <p>Collaborating on real-world projects spanning web platforms, mobile apps, and community tools. Bridging design and engineering in every contribution.</p>
              </div>
              <div className="edu-item">
                <div className="edu-date">Core Stack</div>
                <h3>Technologies I Work With</h3>
                <div className="org">Languages &amp; Frameworks</div>
                <p>Java · SQL · HTML · CSS · JavaScript · React · React Native · Laravel · PHP · Figma · Git</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact">
        <div className="s-inner">
          <div className="s-header reveal">
            <div>
              <div className="s-num">05 — Contact</div>
              <h2 className="s-title">Let's <em>Talk</em></h2>
            </div>
            <p className="s-sub">Open to select opportunities</p>
          </div>
          <div className="contact-layout">
            <div className="contact-left reveal-left">
              <h3>Have a project or<br /><em>opportunity</em> in mind?</h3>
              <p>Whether you want to collaborate, hire, or just say hello — I'd love to hear from you. Every great project starts with a conversation.</p>
              <div className="c-links">
                {[
                  { label: 'Email', val: 'amuchiri040@gmail.com', href: 'mailto:amuchiri040@gmail.com' },
                  { label: 'LinkedIn', val: 'ann-muchiri-770a40390', href: 'https://www.linkedin.com/in/ann-muchiri-770a40390' },
                  { label: 'GitHub', val: 'annmosh88', href: 'https://github.com/annmosh88' },
                ].map(l => (
                  <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer" className="c-link" key={l.label}
                    onMouseEnter={cursorGrow} onMouseLeave={cursorShrink}>
                    <div className="c-link-left">
                      <span className="c-link-label">{l.label}</span>
                      <span className="c-link-val">{l.val}</span>
                    </div>
                    <span className="c-arr">↗</span>
                  </a>
                ))}
              </div>
            </div>
            <div className="reveal">
              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="f-group">
                  <label htmlFor="name">Your Name</label>
                  <input id="name" type="text" placeholder="Jane Doe" required
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="f-group">
                  <label htmlFor="email">Email Address</label>
                  <input id="email" type="email" placeholder="jane@example.com" required
                    value={formData.email}
                    onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} />
                </div>
                <div className="f-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" placeholder="Hey Ann, I'd love to discuss..." required
                    value={formData.message}
                    onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} />
                </div>
                {formState === 'success' && <div className="form-success">✓ &nbsp;{formMsg}</div>}
                {formState === 'error' && <div className="form-error">✕ &nbsp;{formMsg}</div>}
                <div className="f-submit">
                  <button type="submit" className="btn-main"
                    disabled={formState === 'loading'}
                    onMouseEnter={cursorGrow} onMouseLeave={cursorShrink}>
                    {formState === 'loading' ? 'Sending...' : 'Send Message →'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p className="footer-copy">© 2025 <span>Ann Muchiri</span> — Nairobi, Kenya 🇰🇪</p>
        <div className="footer-socials">
          <a href="mailto:amuchiri040@gmail.com" onMouseEnter={cursorGrow} onMouseLeave={cursorShrink}>Email</a>
          <a href="https://github.com/annmosh88" target="_blank" rel="noopener noreferrer" onMouseEnter={cursorGrow} onMouseLeave={cursorShrink}>GitHub</a>
          <a href="https://www.linkedin.com/in/ann-muchiri-770a40390" target="_blank" rel="noopener noreferrer" onMouseEnter={cursorGrow} onMouseLeave={cursorShrink}>LinkedIn</a>
        </div>
      </footer>
    </>
  )
}
