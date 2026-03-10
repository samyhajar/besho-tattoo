import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypeScript from 'eslint-config-next/typescript';

function promoteSeverity(value) {
  if (value === 'warn' || value === 1) {
    return 'error';
  }

  if (Array.isArray(value) && (value[0] === 'warn' || value[0] === 1)) {
    return ['error', ...value.slice(1)];
  }

  return value;
}

function promoteWarnings(configs) {
  return configs.map((config) => {
    if (!config.rules) {
      return config;
    }

    return {
      ...config,
      rules: Object.fromEntries(
        Object.entries(config.rules).map(([ruleName, ruleValue]) => [
          ruleName,
          promoteSeverity(ruleValue),
        ]),
      ),
    };
  });
}

const eslintConfig = [
  ...promoteWarnings(nextCoreWebVitals),
  ...promoteWarnings(nextTypeScript),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    rules: {
      'prefer-const': 'error',
      'no-var': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
];

export default eslintConfig;
