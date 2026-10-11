import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import ThemeSelector from './ThemeSelector'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/projects', label: 'Projects' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    if (saved && ['dark', 'skyblue', 'grey', 'light'].includes(saved)) {
      return saved
    }
    return 'dark'
  })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleSelectTheme = (newTheme) => {
    setTheme(newTheme)
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo">
          <span className="logo-main">REYANSH</span>
          <span className="logo-sub">STUDIO</span>
        </Link>
        <div className="nav-links">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'}>
              {l.label}
            </NavLink>
          ))}
        </div>
        <div className="nav-actions">
          <ThemeSelector
            currentTheme={theme}
            onSelectTheme={handleSelectTheme}
            variant="dropdown"
          />
          <Link to="/contact" className="nav-cta">Get a Quote</Link>
        </div>
        <div className="nav-mobile-actions">
          <button className={`hamburger ${open ? 'open' : ''}`} onClick={() => setOpen(!open)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>
      <div className={`mobile-menu ${open ? 'open' : ''}`}>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}>
            {l.label}
          </NavLink>
        ))}
        <ThemeSelector
          currentTheme={theme}
          onSelectTheme={(t) => {
            handleSelectTheme(t)
            setOpen(false)
          }}
          variant="inline"
        />
      </div>
    </>
  )
}

