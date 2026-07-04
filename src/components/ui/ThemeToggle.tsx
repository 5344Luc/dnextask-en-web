import { useState, useRef, useEffect } from 'react';
import { useThemeStore, THEME_OPTIONS } from '../../stores/themeStore';

const THEME_ICONS: Record<string, { icon: string; bg: string }> = {
  light:     { icon: 'fi fi-rr-brightness',   bg: '#ffffff' },
  dark:      { icon: 'fi fi-br-moon',          bg: '#1d232a' },
  corporate: { icon: 'fi fi-rr-corporate-alt', bg: '#ffffff' },
  bumblebee: { icon: 'fi fi-tr-bee',           bg: '#ffffff' },
  emerald:   { icon: 'fi fi-tr-diamond',       bg: '#ffffff' },
  garden:    { icon: 'fi fi-tr-hand-holding-seeding',         bg: '#e9e7e7' },
  lemonade:  { icon: 'fi fi-rr-glass-citrus',  bg: '#f8fdef' },
  sunset:    { icon: 'fi fi-tr-sunset',        bg: '#121c22' },
  winter:    { icon: 'fi fi-tr-snow-blowing',  bg: '#ffffff' },
};

const LIGHT_BG_THEMES = ['light', 'winter', 'bumblebee', 'corporate', 'emerald', 'garden', 'lemonade'];

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeLabel = THEME_OPTIONS.find((t) => t.value === theme)?.label ?? 'Theme';
  const activeIcon = THEME_ICONS[theme];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
        style={{
          backgroundColor: 'var(--color-base-200)',
          color: 'var(--color-base-content)',
          border: '1px solid var(--color-border)',
        }}
      >
        <span
          className="h-5 w-5 rounded-full flex items-center justify-center shrink-0"
          style={{
            backgroundColor: activeIcon?.bg ?? '#999',
            border: '1px solid var(--color-border)',
          }}
        >
          <i
            className={activeIcon?.icon}
            style={{
              fontSize: '11px',
              color: LIGHT_BG_THEMES.includes(theme) ? '#18181b' : '#ffffff',
            }}
          />
        </span>
        {activeLabel}
      </button>

      {open && (
        <div
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl shadow-lg"
          style={{
            backgroundColor: 'var(--color-base-100)',
            border: '1px solid var(--color-border)',
          }}
        >
          {THEME_OPTIONS.map((opt) => {
            const iconData = THEME_ICONS[opt.value];
            const isLight = LIGHT_BG_THEMES.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between px-3 py-2.5 text-sm transition-colors"
                style={{
                  backgroundColor:
                    theme === opt.value ? 'var(--color-base-200)' : 'transparent',
                  color: 'var(--color-base-content)',
                }}
                onMouseEnter={(e) => {
                  if (theme !== opt.value) {
                    e.currentTarget.style.backgroundColor = 'var(--color-base-200)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (theme !== opt.value) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="h-6 w-6 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: iconData?.bg ?? '#999',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <i
                      className={iconData?.icon}
                      style={{ fontSize: '12px', color: isLight ? '#18181b' : '#ffffff' }}
                    />
                  </span>
                  {opt.label}
                </span>
                {theme === opt.value && (
                  <i className="fi fi-rr-check text-[var(--color-primary)]" style={{ fontSize: '13px' }} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
