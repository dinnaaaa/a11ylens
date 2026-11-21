
import { useState } from 'react'
import {
  getAuditRecords,
  getIssueStatuses,
  updateIssueStatus,
} from '../../services/storage/localStorage'

function getSeverityClass(impact) {
  const classes = {
    critical: 'danger',
    serious: 'warning',
    moderate: 'info',
    minor: 'secondary',
  }

  return classes[impact] || 'secondary'
}

function getStatusClass(status) {
  const classes = {
    Open: 'danger',
    'In Progress': 'primary',
    Resolved: 'success',
  }

  return classes[status] || 'secondary'
}

function formatDate(date) {
  if (!date) return '-'

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return '-'
  }

  return parsedDate.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

function getIssueList(audits, issueStatuses) {
  const statusMap = new Map(
    issueStatuses.map((issue) => [issue.id, issue]),
  )

  const issueMap = new Map()

  // Urutkan audit dari yang terbaru.
  const sortedAudits = [...audits].sort(
    (a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp),
  )

  sortedAudits.forEach((audit) => {
    // Pastikan findings berbentuk array.
    if (!Array.isArray(audit.findings)) {
      return
    }

    audit.findings.forEach((finding) => {
      const issueId =
        `${audit.demoPageId}::${finding.ruleId}`

      // Ambil temuan terbaru untuk setiap issue.
      if (!issueMap.has(issueId)) {
        const issueStatus = statusMap.get(issueId)

        issueMap.set(issueId, {
          id: issueId,
          demoPageId: audit.demoPageId,
          demoPageName: audit.demoPageName,
          ruleId: finding.ruleId,
          description: finding.description,
          help: finding.help,
          helpUrl: finding.helpUrl,
          impact: finding.impact,
          affectedNodes: finding.affectedNodes || [],
          tags: finding.tags || [],

          // Waktu audit terbaru yang mendeteksi issue.
          lastDetected:
            issueStatus?.lastDetectedAt ||
            audit.timestamp,

          status: issueStatus?.status || 'Open',

          // Waktu perubahan status terakhir.
          // Fallback updatedAt untuk data Local Storage lama.
          statusUpdatedAt:
            issueStatus?.statusUpdatedAt ||
            issueStatus?.updatedAt ||
            audit.timestamp,
        })
      }
    })
  })

  return Array.from(issueMap.values())
}

function IssueManagement() {
  const [audits, setAudits] = useState(
    () => getAuditRecords(),
  )

  const [issueStatuses, setIssueStatuses] = useState(
    () => getIssueStatuses(),
  )

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [severityFilter, setSeverityFilter] = useState('All')
  const [selectedIssueId, setSelectedIssueId] = useState(null)
  const [error, setError] = useState('')

  // Memuat ulang data dari Local Storage.
  function refreshIssues() {
    setAudits(getAuditRecords())
    setIssueStatuses(getIssueStatuses())
    setError('')
  }

  // Memperbarui status issue.
  function handleStatusChange(issueId, newStatus) {
    const isUpdated = updateIssueStatus(
      issueId,
      newStatus,
    )

    if (!isUpdated) {
      setError(
        'Unable to update issue status. Please check your browser storage.',
      )
      return
    }

    setIssueStatuses(getIssueStatuses())
    setError('')
  }

  const issues = getIssueList(
    audits,
    issueStatuses,
  )

  // Search dan filter.
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch = [
      issue.help,
      issue.description,
      issue.ruleId,
      issue.demoPageName,
    ]
      .join(' ')
      .toLowerCase()
      .includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' ||
      issue.status === statusFilter

    // Menangani severity yang tidak memiliki nilai impact.
    const issueSeverity = issue.impact || 'unrated'

    const matchesSeverity =
      severityFilter === 'All' ||
      issueSeverity === severityFilter

    return (
      matchesSearch &&
      matchesStatus &&
      matchesSeverity
    )
  })

  // Menghitung jumlah berdasarkan issue unik.
  const statusCounts = {
    Open: issues.filter(
      (issue) => issue.status === 'Open',
    ).length,

    'In Progress': issues.filter(
      (issue) => issue.status === 'In Progress',
    ).length,

    Resolved: issues.filter(
      (issue) => issue.status === 'Resolved',
    ).length,
  }

  const selectedIssue = issues.find(
    (issue) => issue.id === selectedIssueId,
  )

  return (
    <section className="page-placeholder">
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">
            A11YLENS WORKSPACE
          </span>

          <h2>Issue Management</h2>

          <p>
            Review and manage accessibility findings detected by axe-core.
          </p>
        </div>
      </div>

      {/* Issue Summary */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="placeholder-panel h-100">
            <p className="small text-secondary mb-1">
              Open Issues
            </p>

            <h3 className="mb-0">
              {statusCounts.Open}
            </h3>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="placeholder-panel h-100">
            <p className="small text-secondary mb-1">
              In Progress
            </p>

            <h3 className="mb-0">
              {statusCounts['In Progress']}
            </h3>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="placeholder-panel h-100">
            <p className="small text-secondary mb-1">
              Resolved Issues
            </p>

            <h3 className="mb-0">
              {statusCounts.Resolved}
            </h3>
          </div>
        </div>
      </div>

      {/* Issue List */}
      <div className="placeholder-panel">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h3 className="h5 mb-1">
              Accessibility Issues
            </h3>

            <p className="small text-secondary mb-0">
              Manage the status of detected accessibility findings.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={refreshIssues}
          >
            Refresh Issues
          </button>
        </div>

        {error && (
          <div
            className="alert alert-danger"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-lg-4">
            <label
              htmlFor="issue-search"
              className="form-label"
            >
              Search Issues
            </label>

            <input
              id="issue-search"
              type="search"
              className="form-control"
              placeholder="Search by rule, description, or demo page..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label
              htmlFor="status-filter"
              className="form-label"
            >
              Filter by Status
            </label>

            <select
              id="status-filter"
              className="form-select"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <label
              htmlFor="severity-filter"
              className="form-label"
            >
              Filter by Severity
            </label>

            <select
              id="severity-filter"
              className="form-select"
              value={severityFilter}
              onChange={(event) =>
                setSeverityFilter(event.target.value)
              }
            >
              <option value="All">All Severities</option>
              <option value="critical">Critical</option>
              <option value="serious">Serious</option>
              <option value="moderate">Moderate</option>
              <option value="minor">Minor</option>
              <option value="unrated">Unrated</option>
            </select>
          </div>
        </div>

        {/* Empty States */}
        {issues.length === 0 ? (
          <div className="alert alert-info mb-0">
            No accessibility issues are available yet. Run an
            accessibility audit to detect issues.
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="alert alert-light border mb-0">
            No issues match the selected search or filters.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">Issue</th>
                  <th scope="col">Demo Page</th>
                  <th scope="col">Severity</th>
                  <th scope="col">Affected Nodes</th>
                  <th scope="col">Status</th>
                  <th scope="col">Last Detected</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredIssues.map((issue) => (
                  <tr key={issue.id}>
                    <td>
                      <strong>{issue.help}</strong>

                      <div className="small text-secondary">
                        {issue.ruleId}
                      </div>
                    </td>

                    <td>{issue.demoPageName}</td>

                    <td>
                      <span
                        className={`badge text-bg-${getSeverityClass(
                          issue.impact,
                        )}`}
                      >
                        {issue.impact || 'Unrated'}
                      </span>
                    </td>

                    <td>
                      {issue.affectedNodes.length}
                    </td>

                    <td>
                      <span
                        className={`badge text-bg-${getStatusClass(
                          issue.status,
                        )}`}
                      >
                        {issue.status}
                      </span>
                    </td>

                    <td>
                      {formatDate(issue.lastDetected)}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() =>
                          setSelectedIssueId(issue.id)
                        }
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p className="small text-secondary mb-0 mt-3">
          Showing {filteredIssues.length} of {issues.length} issues.
          Issue statuses are stored locally and do not modify audit records.
        </p>
      </div>

      {/* Issue Details */}
      {selectedIssue && (
        <div className="placeholder-panel mt-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
            <h3 className="h5 mb-0">
              Issue Details
            </h3>

            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={() => setSelectedIssueId(null)}
            >
              Close Details
            </button>
          </div>

          <h4 className="h6">
            {selectedIssue.help}
          </h4>

          <p className="text-secondary">
            {selectedIssue.description}
          </p>

          <p>
            <strong>Rule ID:</strong>{' '}
            {selectedIssue.ruleId}
          </p>

          <p>
            <strong>Demo Page:</strong>{' '}
            {selectedIssue.demoPageName}
          </p>

          <p>
            <strong>Severity:</strong>{' '}
            {selectedIssue.impact || 'Unrated'}
          </p>

          <p>
            <strong>Last Detected:</strong>{' '}
            {formatDate(selectedIssue.lastDetected)}
          </p>

          <p>
            <strong>Last Status Update:</strong>{' '}
            {formatDate(selectedIssue.statusUpdatedAt)}
          </p>

          {selectedIssue.helpUrl && (
            <p>
              <a
                href={selectedIssue.helpUrl}
                target="_blank"
                rel="noreferrer"
              >
                Learn how to fix this issue
              </a>
            </p>
          )}

          <h5 className="h6 mt-4">
            Affected Elements
          </h5>

          {selectedIssue.affectedNodes.length === 0 ? (
            <p className="text-secondary">
              No affected element details are available.
            </p>
          ) : (
            <ul>
              {selectedIssue.affectedNodes.map(
                (node, index) => (
                  <li
                    key={`${selectedIssue.id}-${index}`}
                    className="mb-3"
                  >
                    <code className="text-break">
                      {Array.isArray(node.target)
                        ? node.target.join(', ')
                        : node.target}
                    </code>

                    {node.failureSummary && (
                      <p className="small text-secondary mt-1 mb-0">
                        {node.failureSummary}
                      </p>
                    )}
                  </li>
                ),
              )}
            </ul>
          )}

          {/* Update Issue Status */}
          <div className="mt-4">
            <label
              htmlFor="issue-status"
              className="form-label fw-semibold"
            >
              Update Issue Status
            </label>

            <select
              id="issue-status"
              className="form-select"
              value={selectedIssue.status}
              onChange={(event) =>
                handleStatusChange(
                  selectedIssue.id,
                  event.target.value,
                )
              }
            >
              <option value="Open">Open</option>
              <option value="In Progress">
                In Progress
              </option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      )}
    </section>
  )
}

export default IssueManagement
