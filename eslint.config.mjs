import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const config = [
  {
    ignores: ['.open-next/**', '.next/**', 'dist/**', 'node_modules/**'],
  },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      '@next/next/no-img-element': 'off',
    },
  },
];

export default config;

