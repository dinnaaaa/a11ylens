
import { useState } from 'react'
import { getAuditRecords } from '../../services/storage/localStorage'

function formatDate(timestamp) {
  if (!timestamp) return '-'

  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(date)
}

function getScoreClass(score) {
  if (score >= 90) return 'success'
  if (score >= 70) return 'warning'
  return 'danger'
}

function formatDifference(value) {
  if (value > 0) return `+${value}`
  return String(value)
}

function AuditHistory() {
  const [auditRecords, setAuditRecords] = useState(() =>
    getAuditRecords(),
  )

  const [selectedAuditId, setSelectedAuditId] = useState('')
  const [firstAuditId, setFirstAuditId] = useState('')
  const [secondAuditId, setSecondAuditId] = useState('')

  const selectedAudit = auditRecords.find(
    (record) => record.id === selectedAuditId,
  )

  const firstAudit = auditRecords.find(
    (record) => record.id === firstAuditId,
  )

  const secondAudit = auditRecords.find(
    (record) => record.id === secondAuditId,
  )

  const comparableAudits = firstAudit
    ? auditRecords.filter(
        (record) =>
          record.demoPageId === firstAudit.demoPageId &&
          record.id !== firstAudit.id,
      )
    : []

  const canCompare =
    firstAudit &&
    secondAudit &&
    firstAudit.demoPageId === secondAudit.demoPageId

  function handleRefresh() {
    setAuditRecords(getAuditRecords())
    setSelectedAuditId('')
    setFirstAuditId('')
    setSecondAuditId('')
  }

  function handleFirstAuditChange(event) {
    setFirstAuditId(event.target.value)
    setSecondAuditId('')
  }

  const scoreDifference = canCompare
    ? secondAudit.score - firstAudit.score
    : 0

  const violationDifference = canCompare
    ? secondAudit.totalViolations - firstAudit.totalViolations
    : 0

  return (
    <section className="page-placeholder">
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">
            A11YLENS WORKSPACE
          </span>

          <h2>Audit History & Reports</h2>

          <p>
            Review and compare previous accessibility audit records.
          </p>
        </div>
      </div>

      {/* Audit Summary */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="placeholder-panel h-100">
            <p className="small text-secondary mb-1">
              Total Audit Records
            </p>

            <h3 className="mb-0">
              {auditRecords.length}
            </h3>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="placeholder-panel h-100">
            <p className="small text-secondary mb-1">
              Demo Pages Audited
            </p>

            <h3 className="mb-0">
              {
                new Set(
                  auditRecords.map((record) => record.demoPageId),
                ).size
              }
            </h3>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="placeholder-panel h-100">
            <p className="small text-secondary mb-1">
              Latest Audit Score
            </p>

            <h3 className="mb-0">
              {auditRecords.length > 0
                ? `${auditRecords[0].score}/100`
                : '-'}
            </h3>
          </div>
        </div>
      </div>

      {/* Audit History */}
      <div className="placeholder-panel mb-4">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <div>
            <h3 className="h5 mb-1">
              Audit Records
            </h3>

            <p className="small text-secondary mb-0">
              All successfully saved accessibility audits.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline-primary"
            onClick={handleRefresh}
          >
            Refresh History
          </button>
        </div>

        {auditRecords.length === 0 ? (
          <div className="text-center py-5">
            <h4 className="h6">
              No Audit Records Yet
            </h4>

            <p className="text-secondary mb-0">
              Run an accessibility audit to see its results here.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th scope="col">Demo Page</th>
                  <th scope="col">Audit Date</th>
                  <th scope="col">Score</th>
                  <th scope="col">Violations</th>
                  <th scope="col">Affected Nodes</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>

              <tbody>
                {auditRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <strong>
                        {record.demoPageName}
                      </strong>
                    </td>

                    <td>
                      {formatDate(record.timestamp)}
                    </td>

                    <td>
                      <span
                        className={`badge text-bg-${getScoreClass(
                          record.score,
                        )}`}
                      >
                        {record.score}/100
                      </span>
                    </td>

                    <td>
                      {record.totalViolations}
                    </td>

                    <td>
                      {record.totalAffectedNodes}
                    </td>

                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          setSelectedAuditId(record.id)
                        }
                        aria-label={`View audit details for ${record.demoPageName}`}
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
      </div>

      {/* Audit Details */}
      {selectedAudit && (
        <div className="placeholder-panel mb-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
            <div>
              <h3 className="h5 mb-1">
                Audit Details
              </h3>

              <p className="small text-secondary mb-0">
                {selectedAudit.demoPageName}
              </p>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setSelectedAuditId('')}
            >
              Close Details
            </button>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <div className="border rounded p-3 h-100">
                <p className="small text-secondary mb-1">
                  Accessibility Score
                </p>

                <h3 className="mb-0">
                  {selectedAudit.score}/100
                </h3>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="border rounded p-3 h-100">
                <p className="small text-secondary mb-1">
                  Total Violations
                </p>

                <h3 className="mb-0">
                  {selectedAudit.totalViolations}
                </h3>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="border rounded p-3 h-100">
                <p className="small text-secondary mb-1">
                  Affected Nodes
                </p>

                <h3 className="mb-0">
                  {selectedAudit.totalAffectedNodes}
                </h3>
              </div>
            </div>
          </div>

          <p className="small text-secondary">
            Audit Date: {formatDate(selectedAudit.timestamp)}
          </p>

          <h4 className="h6 mb-3">
            Severity Breakdown
          </h4>

          <div className="row g-2 mb-4">
            {Object.entries(
              selectedAudit.severitySummary || {},
            ).map(([severity, count]) => (
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
            ))}
          </div>

          <h4 className="h6 mb-3">
            Accessibility Findings
          </h4>

          {!selectedAudit.findings ||
          selectedAudit.findings.length === 0 ? (
            <p className="text-secondary">
              No findings were recorded for this audit.
            </p>
          ) : (
            <div className="d-flex flex-column gap-3">
              {selectedAudit.findings.map((finding) => (
                <article
                  key={finding.ruleId}
                  className="border rounded p-3"
                >
                  <h5 className="h6">
                    {finding.help}
                  </h5>

                  <p className="small text-secondary">
                    {finding.description}
                  </p>

                  <p className="small mb-2">
                    <strong>Rule ID:</strong> {finding.ruleId}
                  </p>

                  <p className="small mb-2">
                    <strong>Impact:</strong>{' '}
                    {finding.impact || 'Unrated'}
                  </p>

                  <p className="small mb-2">
                    <strong>Affected Nodes:</strong>{' '}
                    {finding.affectedNodes?.length || 0}
                  </p>

                  {finding.helpUrl && (
                    <a
                      href={finding.helpUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="small"
                    >
                      Learn how to fix this issue
                    </a>
                  )}
                </article>
              ))}
            </div>
          )}

          <p className="small text-secondary mt-4 mb-0">
            This audit record is an immutable snapshot of the
            results at the time the audit was performed.
          </p>
        </div>
      )}

      {/* Audit Comparison */}
      <div className="placeholder-panel">
        <h3 className="h5 mb-1">
          Audit Comparison
        </h3>

        <p className="small text-secondary mb-4">
          Compare two audit records from the same demo page.
        </p>

        {auditRecords.length < 2 ? (
          <div className="alert alert-info mb-0">
            At least two audit records are required to compare results.
          </div>
        ) : (
          <>
            <div className="row g-3 mb-4">
              <div className="col-12 col-md-6">
                <label
                  htmlFor="first-audit"
                  className="form-label fw-semibold"
                >
                  First Audit
                </label>

                <select
                  id="first-audit"
                  className="form-select"
                  value={firstAuditId}
                  onChange={handleFirstAuditChange}
                >
                  <option value="">
                    Select first audit
                  </option>

                  {auditRecords.map((record) => (
                    <option
                      key={record.id}
                      value={record.id}
                    >
                      {record.demoPageName} - {formatDate(record.timestamp)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label
                  htmlFor="second-audit"
                  className="form-label fw-semibold"
                >
                  Second Audit
                </label>

                <select
                  id="second-audit"
                  className="form-select"
                  value={secondAuditId}
                  onChange={(event) =>
                    setSecondAuditId(event.target.value)
                  }
                  disabled={!firstAudit}
                >
                  <option value="">
                    Select second audit
                  </option>

                  {comparableAudits.map((record) => (
                    <option
                      key={record.id}
                      value={record.id}
                    >
                      {record.demoPageName} - {formatDate(record.timestamp)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {firstAudit && comparableAudits.length === 0 && (
              <div className="alert alert-info">
                No other audit records are available for this demo page.
              </div>
            )}

            {canCompare && (
              <div>
                <h4 className="h6 mb-3">
                  Comparison Results
                </h4>

                <div className="table-responsive">
                  <table className="table table-bordered align-middle">
                    <thead>
                      <tr>
                        <th scope="col">Metric</th>
                        <th scope="col">First Audit</th>
                        <th scope="col">Second Audit</th>
                        <th scope="col">Difference</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr>
                        <th scope="row">
                          Accessibility Score
                        </th>

                        <td>
                          {firstAudit.score}/100
                        </td>

                        <td>
                          {secondAudit.score}/100
                        </td>

                        <td>
                          {formatDifference(scoreDifference)}
                        </td>
                      </tr>

                      <tr>
                        <th scope="row">
                          Total Violations
                        </th>

                        <td>
                          {firstAudit.totalViolations}
                        </td>

                        <td>
                          {secondAudit.totalViolations}
                        </td>

                        <td>
                          {formatDifference(violationDifference)}
                        </td>
                      </tr>

                      <tr>
                        <th scope="row">
                          Affected Nodes
                        </th>

                        <td>
                          {firstAudit.totalAffectedNodes}
                        </td>

                        <td>
                          {secondAudit.totalAffectedNodes}
                        </td>

                        <td>
                          {formatDifference(
                            secondAudit.totalAffectedNodes -
                              firstAudit.totalAffectedNodes,
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="small text-secondary mb-0">
                  Positive score difference means the score increased.
                  Negative violation difference means fewer violations
                  were detected in the second audit.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <p className="small text-secondary mt-4 mb-0">
        Automated audit results do not represent complete WCAG
        conformance. Manual accessibility evaluation is also required.
      </p>
    </section>
  )
}

export default AuditHistory
