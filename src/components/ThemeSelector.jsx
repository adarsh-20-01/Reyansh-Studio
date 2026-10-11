import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Palette, Check, Sparkles } from 'lucide-react'

export const THEMES = [
  {
    id: 'dark',
    name: 'Classic Gold',
    label: 'Gold',
    desc: 'Signature obsidian & warm gold luxury',
    color: '#c9a96e',
    bg: '#0a0a0a',
    cardBg: '#141414',
    border: 'rgba(201,169,110,0.5)',
  },
  {
    id: 'skyblue',
    name: 'Sky Blue',
    label: 'Sky Blue',
    desc: 'Radiant azure & deep midnight navy',
    color: '#38bdf8',
    bg: '#080e1a',
    cardBg: '#0f172a',
    border: 'rgba(56,189,248,0.5)',
  },
  {
    id: 'grey',
    name: 'Slate Grey',
    label: 'Slate Grey',
    desc: 'Modern titanium & minimalist charcoal',
    color: '#cbd5e1',
    bg: '#131417',
    cardBg: '#1a1c22',
    border: 'rgba(203,213,225,0.5)',
  },
  {
    id: 'light',
    name: 'Warm Light',
    label: 'Light',
    desc: 'Ivory cream & champagne daylight',
    color: '#b8954f',
    bg: '#faf8f5',
    cardBg: '#ffffff',
    border: 'rgba(184,149,79,0.5)',
  },
]

export default function ThemeSelector({ currentTheme, onSelectTheme, variant = 'dropdown' }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const activeThemeObj = THEMES.find((t) => t.id === currentTheme) || THEMES[0]

  // Inline variant for mobile menu
  if (variant === 'inline') {
    return (
      <div style={{ padding: '12px 0', borderTop: '1px solid var(--border-light)', marginTop: 8 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: '0.8rem',
            color: 'var(--text-muted-light)',
            textTransform: 'uppercase',
            letterSpacing: '1.5px',
            marginBottom: 12,
            fontWeight: 600,
          }}
        >
          <Palette size={15} color="var(--gold)" />
          <span>Color Theme</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {THEMES.map((theme) => {
            const isSelected = currentTheme === theme.id
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => onSelectTheme(theme.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '9px 12px',
                  borderRadius: 10,
                  background: isSelected ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                  border: isSelected ? `1.5px solid ${theme.color}` : '1px solid var(--border-light)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    background: theme.color,
                    boxShadow: isSelected ? `0 0 10px ${theme.color}` : 'none',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-light)', lineHeight: 1.2 }}>
                    {theme.label}
                  </div>
                </div>
                {isSelected && <Check size={14} color={theme.color} />}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Dropdown variant for Desktop Navbar
  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button
        id="theme-selector-btn"
        type="button"
        className="theme-toggle"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen((prev) => !prev)
        }}
        aria-label="Select theme palette"
        title={`Theme: ${activeThemeObj.name} (Click to change)`}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Palette size={19} />
        {/* Active theme dot indicator */}
        <span
          style={{
            position: 'absolute',
            bottom: 6,
            right: 6,
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: activeThemeObj.color,
            boxShadow: `0 0 6px ${activeThemeObj.color}`,
            border: '1.5px solid var(--bg-dark)',
          }}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="theme-dropdown-menu"
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 14px)',
              right: 0,
              width: 270,
              background: 'var(--bg-card, #141414)',
              border: '1px solid var(--border-gold)',
              borderRadius: 16,
              padding: '16px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.6), 0 0 20px var(--border-gold)',
              zIndex: 1100,
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
                paddingBottom: 10,
                borderBottom: '1px solid var(--border-light)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Sparkles size={14} color="var(--gold)" />
                <span
                  style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1.2px',
                    fontWeight: 700,
                    color: 'var(--text-light)',
                  }}
                >
                  Theme Palette
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 600 }}>
                {activeThemeObj.label}
              </span>
            </div>

            {/* Themes List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {THEMES.map((theme) => {
                const isSelected = currentTheme === theme.id
                return (
                  <button
                    id={`theme-opt-${theme.id}`}
                    key={theme.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onSelectTheme(theme.id)
                      setIsOpen(false)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: 10,
                      background: isSelected
                        ? 'rgba(255,255,255,0.08)'
                        : 'transparent',
                      border: isSelected
                        ? `1.5px solid ${theme.color}`
                        : '1px solid transparent',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.background = 'transparent'
                      }
                    }}
                  >
                    {/* Swatch circle preview */}
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: '50%',
                        background: theme.bg,
                        border: `2px solid ${theme.color}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: isSelected ? `0 0 10px ${theme.color}` : 'none',
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: theme.color,
                        }}
                      />
                    </div>

                    {/* Title and description */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: '0.86rem',
                          fontWeight: 600,
                          color: isSelected ? theme.color : 'var(--text-light)',
                          lineHeight: 1.2,
                        }}
                      >
                        {theme.name}
                      </div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.3,
                          marginTop: 2,
                        }}
                      >
                        {theme.desc}
                      </div>
                    </div>

                    {/* Checkmark */}
                    {isSelected && (
                      <Check size={16} color={theme.color} style={{ flexShrink: 0 }} />
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
