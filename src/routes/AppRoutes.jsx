
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'

import AppLayout from '../components/layout/AppLayout'

import Dashboard from '../features/dashboard/Dashboard'
import AuditHistory from '../features/audit-history/AuditHistory'
import IssueManagement from '../features/issue-management/IssueManagement'
import ContrastChecker from '../features/contrast-checker/ContrastChecker'
import WCAGChecklist from '../features/wcag-checklist/WCAGChecklist'

import FormDemo from '../demo-pages/pages/FormDemo'

// Lazy Loading untuk Accessibility Audit
const AccessibilityAudit = lazy(
  () => import('../features/accessibility-audit/AccessibilityAudit')
)

// Placeholder untuk halaman yang belum diimplementasikan
function PagePlaceholder({ title, description }) {
  return (
    <section className="page-placeholder">
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">
            A11YLENS WORKSPACE
          </span>

          <h2>{title}</h2>

          <p>{description}</p>
        </div>
      </div>

      <div className="placeholder-panel">
        <div className="placeholder-icon" aria-hidden="true">
          â—‡
        </div>

        <h3>{title}</h3>

        <p>
          The page structure is ready. The module implementation will be
          added in its planned development step.
        </p>
      </div>
    </section>
  )
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Demo Pages - tanpa sidebar aplikasi */}
        <Route
          path="/demo/form"
          element={<FormDemo />}
        />

        {/* Main Application */}
        <Route element={<AppLayout />}>

          {/* Dashboard Overview */}
          <Route
            index
            element={<Dashboard />}
          />

          {/* Accessibility Audit */}
          <Route
            path="audit"
            element={
              <Suspense
                fallback={
                  <div className="text-center p-4" role="status">
                    Loading Accessibility Audit...
                  </div>
                }
              >
                <AccessibilityAudit />
              </Suspense>
            }
          />

          {/* Contrast Checker */}
          <Route
            path="contrast-checker"
            element={<ContrastChecker />}
          />

          {/* Issue Management */}
          <Route
            path="issues"
            element={<IssueManagement />}
          />

          {/* WCAG Checklist */}
          <Route
            path="wcag-checklist"
            element={<WCAGChecklist />}
          />

          {/* Audit History & Reports */}
          <Route
            path="audit-history"
            element={<AuditHistory />}
          />

        </Route>

        {/* Page Not Found */}
        <Route
          path="*"
          element={
            <PagePlaceholder
              title="Page Not Found"
              description="The requested page could not be found."
            />
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
