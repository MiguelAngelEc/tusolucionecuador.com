const nextJest = require("next/jest");

// Proporciona la ruta a tu aplicación Next.js para cargar next.config.js y archivos .env en tu entorno de prueba
const createJestConfig = nextJest({
  dir: "./",
});

// Configuración personalizada de Jest
const customJestConfig = {
  // Directorio donde Jest debe almacenar información de caché
  cacheDirectory: ".jest-cache",

  // Indica si la información de cobertura debe recopilarse mientras se ejecuta la prueba
  collectCoverage: false,

  // Array de patrones glob utilizados para detectar archivos de cobertura
  collectCoverageFrom: [
    "lib/gsap/**/*.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/*.test.{js,jsx,ts,tsx}",
    "!**/*.spec.{js,jsx,ts,tsx}",
    "!**/__tests__/**",
    "!**/__mocks__/**",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!**/jest.config.js",
  ],

  // Directorio donde Jest debe generar archivos de cobertura
  coverageDirectory: "coverage",

  // Proveedores de cobertura
  coverageProvider: "v8",

  // Umbrales mínimos de cobertura
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
    "lib/gsap/animations/heroAnimations.ts": {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },

  // Entorno de prueba que se utilizará
  testEnvironment: "jsdom",

  // Opciones que se pasarán al entorno de prueba
  testEnvironmentOptions: {
    customExportConditions: [""],
  },

  // Patrones de archivos de prueba - Solo archivos con .test. o .spec. en el nombre
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],

  // Patrones para ignorar en las pruebas
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/coverage/", "/dist/"],

  // Transformadores de archivos
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "@swc/jest",
      {
        jsc: {
          transform: {
            react: {
              runtime: "automatic",
            },
          },
        },
      },
    ],
  },

  // Patrones para ignorar transformaciones
  transformIgnorePatterns: [
    "/node_modules/(?!(@gsap)/)",
    "^.+\\.module\\.(css|sass|scss)$",
  ],

  // Mapeo de módulos
  moduleNameMapper: {
    // Alias de rutas (debe coincidir con tsconfig.json)
    "^@/(.*)$": "<rootDir>/$1",
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/lib/(.*)$": "<rootDir>/lib/$1",

    // Mocks de Next.js
    "^next/image$": "<rootDir>/__mocks__/next/image.tsx",
    "^next/link$": "<rootDir>/__mocks__/next/link.tsx",
    "^next/navigation$": "<rootDir>/__mocks__/next/navigation.ts",

    // Mocks de archivos estáticos
    "^.+\\.(css|sass|scss)$": "identity-obj-proxy",
    "^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$":
      "<rootDir>/__mocks__/fileMock.js",
  },

  // Directorios de módulos
  moduleDirectories: ["node_modules", "<rootDir>/"],

  // Extensiones de archivos
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  // Archivos de configuración de prueba
  setupFilesAfterEnv: ["<rootDir>/lib/gsap/__tests__/setup.ts", "<rootDir>/jest.setup.components.ts"],

  // Tiempo máximo de espera para cada prueba
  testTimeout: 10000,

  // Mostrar resultados individuales de cada prueba
  verbose: true,

  // Reiniciar mocks entre pruebas
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,

  // Globals
  globals: {
    "ts-jest": {
      tsconfig: {
        jsx: "react",
        esModuleInterop: true,
      },
    },
  },

  // Reporters personalizados
  reporters: [
    "default",
    [
      "jest-html-reporters",
      {
        publicPath: "./coverage/html-report",
        filename: "test-report.html",
        openReport: false,
        expand: true,
      },
    ],
  ],
  setupFiles: ["<rootDir>/jest.setup.ts"],

  testEnvironmentOptions: {
    customExportConditions: [""],
  },
};

// createJestConfig exporta una función async, esto es necesario para que Next.js pueda cargar la configuración de Next.js y los archivos .env
module.exports = createJestConfig(customJestConfig);
