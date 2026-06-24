/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // UTM official brand colors — sourced from brand.utm.my/utm-flag/
        // Maroon: RGB(92,0,31) = #5C001F · Gold: RGB(248,190,23) = #F8BE17
        // Full tint/shade ramps derived from those two anchors (HLS lightness+saturation taper).
        // Steps 300–500 on maroon trend magenta at this hue and are intentionally
        // avoided in UI usage — stick to 50/100/200 (tints) and 600–900 (solid/dark).
        maroon: {
          50: '#FBF4F6',
          100: '#F7E3EA',
          200: '#F3C4D4',
          300: '#EE8BAC',
          400: '#EE2B6C',
          500: '#C70546',
          600: '#8A002E',
          700: '#5C001F', // official UTM maroon
          800: '#420016',
          900: '#29000E',
        },
        gold: {
          50: '#FBF9F4',
          100: '#F8F2E2',
          200: '#F7EAC5',
          300: '#F7DE97',
          400: '#F8CE54',
          500: '#F8BE17', // official UTM gold
          600: '#D19C05',
          700: '#9F7704',
          800: '#745806',
          900: '#554107',
        },
        // kept as an alias so any leftover `brand-*` usage during the rebrand
        // resolves to the maroon scale rather than silently falling back to nothing
        brand: {
          50: '#FBF4F6',
          100: '#F7E3EA',
          200: '#F3C4D4',
          400: '#8A002E',
          500: '#5C001F',
          600: '#5C001F',
          700: '#420016',
        },
      },
      boxShadow: {
        soft: '0 1px 2px 0 rgb(15 23 42 / 0.04), 0 1px 3px 0 rgb(15 23 42 / 0.06)',
        card: '0 4px 16px -4px rgb(92 0 31 / 0.10), 0 2px 6px -2px rgb(15 23 42 / 0.05)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
