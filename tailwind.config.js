/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 0.125rem)',
  			sm: 'calc(var(--radius) - 0.25rem)',
  			panel: 'var(--radius-panel)'
  		},
  		colors: {
  			brand: {
  				paper: 'var(--paper)',
  				ink: 'var(--ink)',
  				rule: 'var(--rule)',
  				terminal: 'var(--terminal)',
  				'terminal-ink': 'var(--terminal-ink)',
  				'terminal-dim': 'var(--terminal-dim)',
  				'orange-fill': 'var(--orange-fill)',
  				'orange-ink': 'var(--orange-ink)',
  				'orange-ink-hover': 'var(--orange-ink-hover)',
  				muted: 'var(--muted)',
  				wash: 'var(--wash)',
  				danger: 'var(--danger)'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted-bg))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'var(--rule)',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		fontFamily: {
  			sans: ['var(--font-sans)'],
  			heading: ['var(--font-display)'],
  			body: ['var(--font-sans)'],
  			display: ['var(--font-display)'],
  			mono: ['var(--font-mono)']
  		},
  		// Type scale: ratio 1.250 on a 17px body (see --step-* in index.css).
  		fontSize: {
  			xs: ['0.85rem', { lineHeight: '1.5' }],
  			sm: ['0.95rem', { lineHeight: '1.55' }],
  			base: ['1.0625rem', { lineHeight: '1.6' }],
  			lg: ['1.328rem', { lineHeight: '1.45' }],
  			xl: ['1.66rem', { lineHeight: '1.3' }],
  			'2xl': ['2.075rem', { lineHeight: '1.15' }],
  			'3xl': ['2.594rem', { lineHeight: '1.1' }],
  			'4xl': ['3.24rem', { lineHeight: '1.08' }],
  			'5xl': ['4.05rem', { lineHeight: '1.05' }],
  			'6xl': ['5.06rem', { lineHeight: '1.05' }],
  			'7xl': ['6.33rem', { lineHeight: '1.02' }],
  			'8xl': ['7.9rem', { lineHeight: '1' }],
  			'9xl': ['9.9rem', { lineHeight: '1' }]
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
}
