
const STORAGE_KEYS = {
  AUDITS: 'a11ylens_audits',
  ISSUES: 'a11ylens_issues',
  CHECKLIST: 'a11ylens_checklist',
  SETTINGS: 'a11ylens_settings',
}

const VALID_ISSUE_STATUSES = [
  'Open',
  'In Progress',
  'Resolved',
]

// Notify components when local storage data changes.
function notifyStorageUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new Event('a11ylens:storage-updated'),
    )
  }
}

function readArray(key) {
  try {
    const storedData = localStorage.getItem(key)

    if (!storedData) return []

    const parsedData = JSON.parse(storedData)

    return Array.isArray(parsedData) ? parsedData : []
  } catch {
    return []
  }
}

function writeStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))

    notifyStorageUpdated()

    return true
  } catch {
    return false
  }
}

// ========================================
// AUDIT RECORDS
// ========================================

export function getAuditRecords() {
  return readArray(STORAGE_KEYS.AUDITS)
}

// ========================================
// ISSUE MANAGEMENT
// ========================================

export function getIssueStatuses() {
  return readArray(STORAGE_KEYS.ISSUES)
}

/**
 * Save a successful audit and synchronize issues.
 *
 * Rules:
 * - New issues receive Open status.
 * - Re-detected In Progress issues retain their status.
 * - Re-detected Resolved issues become Open.
 * - Last detected time is updated whenever an issue is detected.
 * - Status updated time changes only when the status changes.
 * - Existing issues are not automatically deleted.
 * - Existing audit records are preserved.
 */
export function saveAuditAndSyncIssues(auditRecord) {
  let previousAudits
  let previousIssues

  try {
    if (
      !auditRecord ||
      !auditRecord.id ||
      !auditRecord.demoPageId ||
      !Array.isArray(auditRecord.findings)
    ) {
      return false
    }

    // Save previous data for rollback.
    previousAudits = localStorage.getItem(
      STORAGE_KEYS.AUDITS,
    )

    previousIssues = localStorage.getItem(
      STORAGE_KEYS.ISSUES,
    )

    const audits = readArray(STORAGE_KEYS.AUDITS)
    const issues = readArray(STORAGE_KEYS.ISSUES)

    // Prevent duplicate audit records.
    const duplicateAudit = audits.some(
      (record) => record.id === auditRecord.id,
    )

    if (duplicateAudit) {
      return false
    }

    const issueMap = new Map(
      issues.map((issue) => [issue.id, issue]),
    )

    // Synchronize findings from the latest audit.
    auditRecord.findings.forEach((finding) => {
      if (!finding || !finding.ruleId) {
        return
      }

      const issueId =
        `${auditRecord.demoPageId}::${finding.ruleId}`

      const existingIssue = issueMap.get(issueId)

      if (!existingIssue) {
        // Create a new issue.
        issueMap.set(issueId, {
          id: issueId,
          demoPageId: auditRecord.demoPageId,
          ruleId: finding.ruleId,

          status: 'Open',

          // Time when the issue was first detected.
          lastDetectedAt: auditRecord.timestamp,

          // Time when the status was initially assigned.
          statusUpdatedAt: auditRecord.timestamp,

          // Keep for backward compatibility.
          updatedAt: auditRecord.timestamp,
        })
      } else {
        // Check whether the existing issue was resolved.
        const shouldReopen =
          existingIssue.status === 'Resolved'

        const updatedIssue = {
          ...existingIssue,

          // Reopen resolved issues when detected again.
          status: shouldReopen
            ? 'Open'
            : existingIssue.status,

          // Update whenever the issue is detected.
          lastDetectedAt: auditRecord.timestamp,

          // Update status timestamp only when status changes.
          statusUpdatedAt: shouldReopen
            ? auditRecord.timestamp
            : (
                existingIssue.statusUpdatedAt ||
                existingIssue.updatedAt ||
                existingIssue.lastDetectedAt ||
                auditRecord.timestamp
              ),

          // Alias for backward compatibility.
          updatedAt: shouldReopen
            ? auditRecord.timestamp
            : (
                existingIssue.statusUpdatedAt ||
                existingIssue.updatedAt ||
                existingIssue.lastDetectedAt ||
                auditRecord.timestamp
              ),
        }

        issueMap.set(issueId, updatedIssue)
      }
    })

    const updatedIssues = Array.from(
      issueMap.values(),
    )

    const updatedAudits = [
      auditRecord,
      ...audits,
    ]

    // Save issues and audits.
    localStorage.setItem(
      STORAGE_KEYS.ISSUES,
      JSON.stringify(updatedIssues),
    )

    localStorage.setItem(
      STORAGE_KEYS.AUDITS,
      JSON.stringify(updatedAudits),
    )

    // Notify components after both writes succeed.
    notifyStorageUpdated()

    return true
  } catch {
    // Rollback if saving fails.
    try {
      if (
        previousAudits === null ||
        previousAudits === undefined
      ) {
        localStorage.removeItem(STORAGE_KEYS.AUDITS)
      } else {
        localStorage.setItem(
          STORAGE_KEYS.AUDITS,
          previousAudits,
        )
      }

      if (
        previousIssues === null ||
        previousIssues === undefined
      ) {
        localStorage.removeItem(STORAGE_KEYS.ISSUES)
      } else {
        localStorage.setItem(
          STORAGE_KEYS.ISSUES,
          previousIssues,
        )
      }
    } catch {
      // Rollback may also fail if storage is unavailable.
    }

    return false
  }
}

/**
 * Update the global status of an issue.
 * Audit records are not modified.
 */
export function updateIssueStatus(issueId, newStatus) {
  if (!VALID_ISSUE_STATUSES.includes(newStatus)) {
    return false
  }

  const issues = getIssueStatuses()

  const issueIndex = issues.findIndex(
    (issue) => issue.id === issueId,
  )

  if (issueIndex === -1) {
    return false
  }

  const updatedIssues = [...issues]

  const now = new Date().toISOString()

  updatedIssues[issueIndex] = {
    ...updatedIssues[issueIndex],

    status: newStatus,

    // Update only when the issue status changes.
    statusUpdatedAt: now,

    // Alias for backward compatibility.
    updatedAt: now,
  }

  return writeStorage(
    STORAGE_KEYS.ISSUES,
    updatedIssues,
  )
}

// ========================================
// WCAG CHECKLIST
// ========================================

export function getChecklist() {
  return readArray(STORAGE_KEYS.CHECKLIST)
}

export function saveChecklist(checklist) {
  if (!Array.isArray(checklist)) {
    return false
  }

  return writeStorage(
    STORAGE_KEYS.CHECKLIST,
    checklist,
  )
}
