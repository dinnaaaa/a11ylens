# A11yLens Workspace

A11yLens Workspace is a web-based accessibility evaluation workspace designed to help users evaluate web accessibility, check color contrast, manage accessibility issues, and monitor audit results based on Web Content Accessibility Guidelines (WCAG).

This project was developed as a personal portfolio project to demonstrate frontend development, accessibility evaluation, data management, and testing skills.

## Features

A11yLens Workspace consists of six main modules:

### 1. Dashboard Overview
Provides an overview of accessibility activities, audit summaries, and tracked issues.

### 2. Accessibility Audit
Evaluates the accessibility of the available demo page using axe-core and displays detected accessibility violations with their severity and affected elements.

### 3. Contrast Checker
Calculates the contrast ratio between foreground and background colors and evaluates the results against WCAG AA and AAA requirements for normal and large text.

### 4. Issue Management
Allows users to review detected accessibility issues, inspect issue details, and manage their statuses.

### 5. WCAG Checklist
Provides a manual checklist based on WCAG 2.2 Level A and AA success criteria, with progress tracking.

### 6. Audit History & Reports
Displays previously recorded accessibility audit results for reviewing past evaluations.

## Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React 19, JavaScript |
| Routing | React Router 8 |
| UI Framework | Bootstrap 5 |
| Accessibility Testing | axe-core |
| Build Tool | Vite |
| Data Storage | Browser Local Storage |
| Unit Testing | Vitest, React Testing Library, jsdom |
| End-to-End Testing | Playwright |
| Code Quality | ESLint |
| Version Control | Git |

## Getting Started

### Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- Git

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:

   ```bash
   cd a11ylens
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open the local URL provided by Vite in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Run unit tests |
| `npm run test:e2e` | Run Playwright end-to-end tests |

## Testing

A11yLens uses automated testing tools to verify application functionality and code quality.

### Unit Testing

Run:

```bash
npm run test:run
```

Current test results:

- 10 tests passed.
- 1 test file passed.
- Tests cover HEX color validation, color normalization, and contrast ratio calculations.

### End-to-End Testing

Run:

```bash
npm run test:e2e
```

Current test results:

- 3 tests passed.
- Tests cover the main application layout, navigation between all six pages, and active navigation states.
- Executed using Playwright with Chromium.

### Code Quality Check

Run:

```bash
npm run lint
```

ESLint is used to check code quality and identify potential code issues.

### Production Build

Run:

```bash
npm run build
```

The generated production files are available in the `dist` directory.

To preview the production build locally:

```bash
npm run preview
```

## Project Scope & Limitations

A11yLens Workspace focuses on:

- Web accessibility evaluation using axe-core.
- Color contrast validation based on WCAG requirements.
- Accessibility issue tracking and status management.
- Manual WCAG 2.2 Level A and AA checklist evaluation.
- Accessibility audit history and result monitoring.

**Current limitations:**

- Accessibility Audit evaluates the demo page available within the application.
- WCAG Checklist is a manual evaluation tool and does not automatically determine complete WCAG compliance.
- Application data is stored in browser Local Storage and is not synchronized across different browsers or devices.
- Automated test coverage currently focuses on Contrast Checker utility functions and application navigation. Other module workflows have also been checked through manual functional testing.

## License

This project was developed as a personal portfolio project.