import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                surface: 'rgb(var(--darkbg) / <alpha-value>)',
            },
            fontFamily: {
                sans: ['Urbanist', 'sans-serif'],
            },
        },
    },
    plugins: [require('tailwind-scrollbar'),       // ✅ Add this
        , require('tailwind-scrollbar-hide')
    ],
};

export default config;