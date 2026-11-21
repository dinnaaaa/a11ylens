
import { useState } from 'react'
import { runAxeAudit } from '../../services/accessibility/axeAudit'
import { saveAuditAndSyncIssues } from '../../services/storage/localStorage'

const DEMO_PAGE = {
  id: 'form',
  name: 'Contact Form Demo',
  url: '/demo/form',
}

const SEVERITY_PENALTIES = {
  critical: 15,
  serious: 10,
  moderate: 5,
  minor: 2,
}

function getSeverity(impact) {
  if (!impact) return 'Unrated'

  return impact.charAt(0).toUpperCase() + impact.slice(1)
}

function getSeverityClass(impact) {
  const classes = {
    critical: 'danger',
    serious: 'warning',
    moderate: 'info',
    minor: 'secondary',
  }

  return classes[impact] || 'secondary'
}

function generateAuditId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `audit-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function calculateAccessibilityScore(violations) {
  const totalPenalty = violations.reduce((total, violation) => {
    const penalty = SEVERITY_PENALTIES[violation.impact] ?? 0

    return total + penalty
  }, 0)

  return Math.max(0, 100 - totalPenalty)
}

function getSeveritySummary(violations) {
  return {
    critical: violations.filter(
      (item) => item.impact === 'critical',
    ).length,

    serious: violations.filter(
      (item) => item.impact === 'serious',
    ).length,

    moderate: violations.filter(
      (item) => item.impact === 'moderate',
    ).length,

    minor: violations.filter(
      (item) => item.impact === 'minor',
    ).length,

    unrated: violations.filter(
      (item) => !item.impact,
    ).length,
  }
}

function createAuditRecord(results) {
  const violations = results.violations ?? []
  const severitySummary = getSeveritySummary(violations)

  const totalAffectedNodes = violations.reduce(
    (total, violation) => total + violation.nodes.length,
    0,
  )

  // Count every detected violation, including unrated violations.
  const totalViolations = violations.length

  const findings = violations.map((violation) => ({
    ruleId: violation.id,
    description: violation.description,
    help: violation.help,
    helpUrl: violation.helpUrl,
    impact: violation.impact,
    affectedNodes: violation.nodes.map((node) => ({
      target: node.target,
      failureSummary: node.failureSummary || '',
    })),
    tags: violation.tags ?? [],
  }))

  return {
    id: generateAuditId(),
    demoPageId: DEMO_PAGE.id,
    demoPageName: DEMO_PAGE.name,
    timestamp: new Date().toISOString(),
    score: calculateAccessibilityScore(violations),
    totalViolations,
    totalAffectedNodes,
    severitySummary,
    findings,
  }
}

function AccessibilityAudit() {
  const [isFrameLoaded, setIsFrameLoaded] = useState(false)
  const [isAuditing, setIsAuditing] = useState(false)
  const [auditResults, setAuditResults] = useState(null)
  const [auditRecord, setAuditRecord] = useState(null)
  const [error, setError] = useState('')
  const [iframeElement, setIframeElement] = useState(null)

  async function handleRunAudit() {
    if (!iframeElement || !isFrameLoaded) {
      setError('Demo page is not ready. Please wait for it to load.')
      return
    }

    setIsAuditing(true)
    setError('')
    setAuditResults(null)
    setAuditRecord(null)

    try {
      // Run axe-core accessibility audit.
      const results = await runAxeAudit(iframeElement)

      // Create an immutable audit snapshot.
      const record = createAuditRecord(results)

      // Save audit and synchronize issue statuses.
      const isSaved = saveAuditAndSyncIssues(record)

      if (!isSaved) {
        throw new Error(
          'Unable to save audit results. Please check your browser storage.',
        )
      }

      // Display results only after saving succeeds.
      setAuditResults(results)
      setAuditRecord(record)
    } catch (auditError) {
      setError(
        auditError instanceof Error
          ? auditError.message
          : 'An unexpected error occurred during the audit.',
      )
    } finally {
      setIsAuditing(false)
    }
  }

  const violations = auditResults?.violations ?? []
  const severityCounts = getSeveritySummary(violations)

  return (
    <section className="page-placeholder">
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">A11YLENS WORKSPACE</span>

          <h2>Accessibility Audit</h2>

          <p>
            Evaluate accessibility issues on the selected demo page.
          </p>
        </div>
      </div>

      {/* Demo Page Selection */}
      <div className="placeholder-panel mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
          <div>
            <h3 className="h5 mb-1">Select Demo Page</h3>

            <p className="text-secondary mb-0">
              Choose a page to evaluate its accessibility.
            </p>
          </div>

          <span className="badge text-bg-light border">
            1 Demo Page Available
          </span>
        </div>

        <label
          htmlFor="demo-page"
          className="form-label fw-semibold"
        >
          Demo Page
        </label>

        <select
          id="demo-page"
          className="form-select mb-3"
          value={DEMO_PAGE.id}
          disabled
          aria-describedby="demo-page-description"
        >
          <option value={DEMO_PAGE.id}>
            {DEMO_PAGE.name}
          </option>
        </select>

        <p
          id="demo-page-description"
          className="small text-secondary mb-3"
        >
          The selected page will be inspected using axe-core.
        </p>

        <div className="d-flex flex-wrap align-items-center gap-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleRunAudit}
            disabled={!isFrameLoaded || isAuditing}
          >
            {isAuditing
              ? 'Running Audit...'
              : 'Run Accessibility Audit'}
          </button>

          <span
            className="small text-secondary"
            role="status"
            aria-live="polite"
          >
            {isAuditing
              ? 'Analyzing demo page...'
              : isFrameLoaded
                ? 'Demo page is ready'
                : 'Loading demo page...'}
          </span>
        </div>
      </div>

      {/* Demo Page Preview */}
      <div className="placeholder-panel mb-4">
        <h3 className="h5 mb-3">Demo Page Preview</h3>

        <iframe
          ref={setIframeElement}
          src={DEMO_PAGE.url}
          title="Contact Form Demo preview"
          onLoad={() => setIsFrameLoaded(true)}
          className="w-100 border rounded"
          style={{
            height: '480px',
            backgroundColor: '#ffffff',
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          <strong>Audit Failed:</strong> {error}
        </div>
      )}

      {/* Audit Results */}
      {auditResults && auditRecord && (
        <div className="placeholder-panel">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
            <div>
              <h3 className="h5 mb-1">Audit Results</h3>

              <p className="text-secondary mb-0 small">
                Results from {DEMO_PAGE.name}
              </p>
            </div>

            <span className="badge text-bg-success">
              Audit Saved Successfully
            </span>
          </div>

          {/* Accessibility Score */}
          <div className="border rounded p-3 mb-4">
            <p className="text-secondary small mb-1">
              Accessibility Score
            </p>

            <h2 className="mb-1">
              {auditRecord.score}
              <span className="fs-6 text-secondary"> / 100</span>
            </h2>

            <p className="small text-secondary mb-0">
              Internal A11yLens indicator based on violation severity.
            </p>
          </div>

          {/* Audit Summary */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <div className="border rounded p-3 h-100">
                <p className="text-secondary small mb-1">
                  Total Violations
                </p>

                <h3 className="mb-0">
                  {auditRecord.totalViolations}
                </h3>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="border rounded p-3 h-100">
                <p className="text-secondary small mb-1">
                  Affected Nodes
                </p>

                <h3 className="mb-0">
                  {auditRecord.totalAffectedNodes}
                </h3>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="border rounded p-3 h-100">
                <p className="text-secondary small mb-1">
                  Passed Checks
                </p>

                <h3 className="mb-0">
                  {auditResults.passes.length}
                </h3>
              </div>
            </div>
          </div>

          {/* Severity Breakdown */}
          <h4 className="h6 mb-3">
            Severity Breakdown
          </h4>

          <div className="row g-2 mb-4">
            {Object.entries(severityCounts).map(
              ([severity, count]) => (
                <div
                  className="col-6 col-md"
                  key={severity}
                >
                  <div className="border rounded p-3 h-100">
                    <p className="small text-secondary mb-1">
                      {severity.charAt(0).toUpperCase() +
                        severity.slice(1)}
                    </p>

                    <strong>{count}</strong>
                  </div>
                </div>
              ),
            )}
          </div>

          {/* Accessibility Findings */}
          <h4 className="h6 mb-3">
            Accessibility Findings
          </h4>

          {violations.length === 0 ? (
            <div className="alert alert-success mb-0">
              No accessibility violations were detected by axe-core
              for the configured WCAG tags.
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {violations.map((violation) => (
                <article
                  key={violation.id}
                  className="border rounded p-3"
                >
                  <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                    <h5 className="h6 mb-0">
                      {violation.help}
                    </h5>

                    <span
                      className={`badge text-bg-${getSeverityClass(
                        violation.impact,
                      )}`}
                    >
                      {getSeverity(violation.impact)}
                    </span>
                  </div>

                  <p className="small text-secondary mb-2">
                    {violation.description}
                  </p>

                  <p className="small mb-2">
                    <strong>Rule ID:</strong> {violation.id}
                  </p>

                  <p className="small mb-2">
                    <strong>Affected Nodes:</strong>{' '}
                    {violation.nodes.length}
                  </p>

                  <a
                    href={violation.helpUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="small"
                  >
                    Learn how to fix this issue
                  </a>

                  <details className="mt-3">
                    <summary className="small fw-semibold">
                      View affected elements
                    </summary>

                    <ul className="mt-2 mb-0">
                      {violation.nodes.map((node, index) => (
                        <li
                          key={`${violation.id}-${index}`}
                          className="mb-2"
                        >
                          <code className="text-break">
                            {node.target.join(', ')}
                          </code>

                          <p className="small text-secondary mb-0 mt-1">
                            {node.failureSummary ||
                              'No additional failure summary available.'}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </details>
                </article>
              ))}
            </div>
          )}

          <p className="small text-secondary mt-4 mb-0">
            Automated audit results do not represent complete WCAG
            conformance. Manual accessibility evaluation is also required.
          </p>
        </div>
      )}
    </section>
  )
}

export default AccessibilityAudit
