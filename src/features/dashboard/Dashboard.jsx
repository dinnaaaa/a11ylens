
import { useEffect, useState } from 'react'
import './Dashboard.css'

const STORAGE_KEYS = {
  AUDITS: 'a11ylens_audits',
  ISSUES: 'a11ylens_issues',
}

const severityItems = [
  { label: 'Critical', key: 'critical', className: 'critical' },
  { label: 'Serious', key: 'serious', className: 'serious' },
  { label: 'Moderate', key: 'moderate', className: 'moderate' },
  { label: 'Minor', key: 'minor', className: 'minor' },
  { label: 'Unrated', key: 'unrated', className: 'unrated' },
]

const statusItems = [
  { label: 'Open', key: 'Open', className: 'open' },
  { label: 'In Progress', key: 'In Progress', className: 'in-progress' },
  { label: 'Resolved', key: 'Resolved', className: 'resolved' },
]

function readStorage(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key))
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function formatDate(timestamp) {
  if (!timestamp) return '—'

  const parsedDate = new Date(timestamp)

  if (Number.isNaN(parsedDate.getTime())) {
    return '—'
  }

  return parsedDate.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getSeverity(finding) {
  const severity = (
    finding?.impact ||
    finding?.severity ||
    'unrated'
  ).toLowerCase()

  return ['critical', 'serious', 'moderate', 'minor'].includes(severity)
    ? severity
    : 'unrated'
}

function getIssueStatusCounts(audits, issueStatuses) {
  const statusMap = new Map(
    issueStatuses.map((issue) => [issue.id, issue]),
  )

  const issueMap = new Map()

  const sortedAudits = [...audits].sort(
    (a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp),
  )

  sortedAudits.forEach((audit) => {
    if (!Array.isArray(audit.findings)) return

    audit.findings.forEach((finding) => {
      const issueId = `${audit.demoPageId}::${finding.ruleId}`

      if (!issueMap.has(issueId)) {
        const issueStatus = statusMap.get(issueId)
        const status = issueStatus?.status || 'Open'

        issueMap.set(issueId, status)
      }
    })
  })

  const counts = {
    Open: 0,
    'In Progress': 0,
    Resolved: 0,
  }

  issueMap.forEach((status) => {
    if (Object.prototype.hasOwnProperty.call(counts, status)) {
      counts[status] += 1
    }
  })

  return counts
}

function MetricCard({ label, value, description, className }) {
  return (
    <article className="dashboard-metric-card">
      <div className="dashboard-metric-top">
        <span className="dashboard-metric-label">{label}</span>
        <span
          className={`dashboard-metric-indicator ${className}`}
          aria-hidden="true"
        />
      </div>

      <div className="dashboard-metric-value">{value}</div>

      <p className="dashboard-metric-description">{description}</p>
    </article>
  )
}

function Dashboard() {
  const [audits, setAudits] = useState([])
  const [issues, setIssues] = useState([])

  useEffect(() => {
    function loadDashboardData() {
      setAudits(readStorage(STORAGE_KEYS.AUDITS))
      setIssues(readStorage(STORAGE_KEYS.ISSUES))
    }

    loadDashboardData()

    window.addEventListener('storage', loadDashboardData)
    window.addEventListener('focus', loadDashboardData)
    window.addEventListener('a11ylens:storage-updated', loadDashboardData)

    return () => {
      window.removeEventListener('storage', loadDashboardData)
      window.removeEventListener('focus', loadDashboardData)
      window.removeEventListener('a11ylens:storage-updated', loadDashboardData)
    }
  }, [])

  const hasAudit = audits.length > 0
  const latestAudit = hasAudit ? audits[0] : null
  const recentAudits = audits.slice(0, 5)

  const accessibilityScore = latestAudit
    ? latestAudit.score
    : '—'

  const totalIssues = latestAudit
    ? latestAudit.totalViolations
    : '—'

  const latestFindings = latestAudit?.findings || []

  const severityCounts = {
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
    unrated: 0,
  }

  latestFindings.forEach((finding) => {
    severityCounts[getSeverity(finding)] += 1
  })

  const statusCounts = getIssueStatusCounts(audits, issues)
  const hasIssues = Object.values(statusCounts).some(
    (count) => count > 0,
  )

  return (
    <section className="dashboard-page">
      <header className="dashboard-page-header">
        <div>
          <span className="dashboard-eyebrow">
            A11YLENS WORKSPACE
          </span>

          <h1 className="dashboard-title">
            Dashboard Overview
          </h1>

          <p className="dashboard-subtitle">
            Overview of accessibility audits and website quality.
          </p>
        </div>
      </header>

      {/* Summary Metrics */}
      <section
        className="dashboard-metrics"
        aria-label="Accessibility summary"
      >
        <MetricCard
          label="Accessibility Score"
          value={accessibilityScore === '—'
            ? '—'
            : `${accessibilityScore}/100`}
          description="Based on the latest audit"
          className="score-indicator"
        />

        <MetricCard
          label="Total Issues"
          value={totalIssues}
          description="Accessibility findings from latest audit"
          className="issues-indicator"
        />
      </section>

      {/* Severity and Status Overview */}
      <section className="dashboard-overview-grid">
        {/* Severity Breakdown */}
        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Severity Breakdown</h2>
              <p>Accessibility findings by severity</p>
            </div>
          </div>

          <div className="dashboard-list">
            {severityItems.map((item) => (
              <div
                className="dashboard-list-item"
                key={item.key}
              >
                <div className="dashboard-list-label">
                  <span
                    className={`dashboard-severity-dot ${item.className}`}
                    aria-hidden="true"
                  />

                  <span>{item.label}</span>
                </div>

                <span className="dashboard-list-value">
                  {hasAudit ? severityCounts[item.key] : '—'}
                </span>
              </div>
            ))}
          </div>
        </article>

        {/* Issue Status Overview */}
        <article className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <h2>Issue Status Overview</h2>
              <p>Progress of accessibility remediation</p>
            </div>
          </div>

          <div className="dashboard-list">
            {statusItems.map((item) => (
              <div
                className="dashboard-list-item"
                key={item.key}
              >
                <div className="dashboard-list-label">
                  <span
                    className={`dashboard-status-dot ${item.className}`}
                    aria-hidden="true"
                  />

                  <span>{item.label}</span>
                </div>

                <span className="dashboard-list-value">
                  {hasIssues ? statusCounts[item.key] : '0'}
                </span>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* Recent Audits */}
      <section className="dashboard-panel dashboard-recent-panel">
        <div className="dashboard-panel-header">
          <div>
            <h2>Recent Audits</h2>
            <p>Your latest accessibility audit records</p>
          </div>
        </div>

        {recentAudits.length > 0 ? (
          <div className="dashboard-recent-list">
            {recentAudits.map((audit) => (
              <div
                className="dashboard-list-item"
                key={audit.id}
              >
                <div className="dashboard-list-label">
                  <div>
                    <strong>{audit.demoPageName}</strong>

                    <p className="dashboard-metric-description">
                      {formatDate(audit.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="dashboard-recent-result">
                  <span className="dashboard-list-value">
                    {audit.score}/100
                  </span>

                  <span className="dashboard-metric-description">
                    {audit.totalViolations} violations
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dashboard-empty-state">
            <div
              className="dashboard-empty-icon"
              aria-hidden="true"
            >
              A
            </div>

            <h3>No audit records yet</h3>

            <p>
              Your recent accessibility audits will appear here
              after you complete your first audit.
            </p>
          </div>
        )}
      </section>
    </section>
  )
}

export default Dashboard
