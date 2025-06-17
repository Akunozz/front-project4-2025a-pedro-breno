// tailwind.config.ts (na raiz do workspace)
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
    './src/app/**/*.{js,jsx,ts,tsx,html}',
    './src/components/**/*.{js,jsx,ts,tsx,html}',
    './src/pages/**/*.{js,jsx,ts,tsx,html}',
    './src/**/*.{mdx}',
  ],
  theme: { /* ... */ },
  plugins: [ /* ... */ ],
}

export default config
// Para máxima compatibilidade com o IntelliSense do Tailwind CSS, adicione também:
// module.exports = config
