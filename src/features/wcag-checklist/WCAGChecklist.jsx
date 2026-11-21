
import { useState } from 'react'
import wcagCriteria from './wcagCriteria'
import {
  getChecklist,
  saveChecklist,
} from '../../services/storage/localStorage'

function getValidCheckedCriteria() {
  const validIds = new Set(
    wcagCriteria.flatMap((group) =>
      group.criteria.map((criterion) => criterion[0]),
    ),
  )

  return [...new Set(getChecklist())].filter(
    (id) => typeof id === 'string' && validIds.has(id),
  )
}

const PRINCIPLE_DESCRIPTIONS = {
  Perceivable:
    'Information and user interface components must be presentable to users in ways they can perceive.',

  Operable:
    'User interface components and navigation must be operable.',

  Understandable:
    'Information and the operation of the user interface must be understandable.',

  Robust:
    'Content must be robust enough to be interpreted by a wide variety of user agents and assistive technologies.',
}

function WCAGChecklist() {
  const [checkedCriteria, setCheckedCriteria] = useState(
    getValidCheckedCriteria,
  )

  const [saveError, setSaveError] = useState('')

  const allCriteria = wcagCriteria.flatMap(
    (group) => group.criteria,
  )

  const totalCriteria = allCriteria.length

  const completedCount = checkedCriteria.length

  const progress = totalCriteria > 0
    ? Math.round((completedCount / totalCriteria) * 100)
    : 0

  const levelACount = allCriteria.filter(
    (item) => item[2] === 'A',
  ).length

  const levelAACount = allCriteria.filter(
    (item) => item[2] === 'AA',
  ).length

  function handleChecklistChange(criteriaId, isChecked) {
    const updatedCriteria = isChecked
      ? [...new Set([...checkedCriteria, criteriaId])]
      : checkedCriteria.filter(
          (item) => item !== criteriaId,
        )

    const saved = saveChecklist(updatedCriteria)

    if (!saved) {
      setSaveError(
        'Unable to save checklist. Please check browser storage.',
      )
      return
    }

    setCheckedCriteria(updatedCriteria)
    setSaveError('')
  }

  return (
    <section className="page-placeholder">
      {/* Page Heading */}
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">
            A11YLENS WORKSPACE
          </span>

          <h2>WCAG Checklist</h2>

          <p>
            Review WCAG 2.2 Level A and AA accessibility
            success criteria.
          </p>
        </div>
      </div>

      {/* Progress Summary */}
      <div className="placeholder-panel mb-4">
        <div className="w-100">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-3">
            <div>
              <h3 className="h5 mb-1">
                Checklist Progress
              </h3>

              <p className="text-secondary small mb-0">
                Your WCAG evaluation progress.
              </p>
            </div>

            <h3 className="text-primary mb-0">
              {progress}%
            </h3>
          </div>

          <div
            className="progress mb-3"
            role="progressbar"
            aria-label="WCAG checklist completion"
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ height: '12px' }}
          >
            <div
              className="progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="d-flex justify-content-between flex-wrap gap-2">
            <span className="small text-secondary">
              {completedCount} of {totalCriteria} criteria completed
            </span>

            <span className="small text-secondary">
              {totalCriteria - completedCount} remaining
            </span>
          </div>

          <hr className="my-4" />

          <div className="row g-3">
            <div className="col-12 col-md-4">
              <div className="border rounded p-3 h-100">
                <p className="small text-secondary mb-1">
                  Total Criteria
                </p>

                <h4 className="mb-0">
                  {totalCriteria}
                </h4>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="border rounded p-3 h-100">
                <p className="small text-secondary mb-1">
                  Level A
                </p>

                <h4 className="mb-0">
                  {levelACount}
                </h4>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="border rounded p-3 h-100">
                <p className="small text-secondary mb-1">
                  Level AA
                </p>

                <h4 className="mb-0">
                  {levelAACount}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Error */}
      {saveError && (
        <div className="alert alert-danger" role="alert">
          {saveError}
        </div>
      )}

      {/* WCAG Principles */}
      {wcagCriteria.map((group, groupIndex) => {
        const completedInGroup = group.criteria.filter(
          (item) => checkedCriteria.includes(item[0]),
        ).length

        return (
          <section
            key={group.principle}
            className="placeholder-panel mb-4"
            aria-labelledby={`principle-${groupIndex}`}
          >
            <div className="w-100">
              <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                <div>
                  <h3
                    id={`principle-${groupIndex}`}
                    className="h5 mb-1"
                  >
                    {groupIndex + 1}. {group.principle}
                  </h3>

                  <p className="text-secondary small mb-0">
                    {PRINCIPLE_DESCRIPTIONS[group.principle]}
                  </p>
                </div>

                <span className="badge text-bg-primary">
                  {completedInGroup}/{group.criteria.length} Completed
                </span>
              </div>

              <hr />

              <div className="d-flex flex-column gap-3">
                {group.criteria.map((item) => {
                  const [
                    id,
                    title,
                    level,
                    description,
                  ] = item

                  const isChecked =
                    checkedCriteria.includes(id)

                  return (
                    <article
                      key={id}
                      className="border rounded p-3"
                    >
                      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3">
                        <div className="flex-grow-1">
                          <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                            <strong>{id}</strong>

                            <span className="fw-semibold">
                              {title}
                            </span>

                            <span
                              className={`badge ${
                                level === 'A'
                                  ? 'text-bg-primary'
                                  : 'text-bg-info'
                              }`}
                            >
                              Level {level}
                            </span>
                          </div>

                          <p className="small text-secondary mb-0">
                            {description}
                          </p>
                        </div>

                        <div className="form-check">
                          <input
                            id={`check-${id}`}
                            type="checkbox"
                            className="form-check-input"
                            checked={isChecked}
                            onChange={(event) =>
                              handleChecklistChange(
                                id,
                                event.target.checked,
                              )
                            }
                          />

                          <label
                            htmlFor={`check-${id}`}
                            className="form-check-label small"
                          >
                            Checked
                          </label>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })}

      {/* Information */}
      <div className="alert alert-info mb-0">
        <strong>WCAG 2.2 Evaluation Information</strong>

        <p className="small mt-2 mb-0">
          This checklist records manual evaluation progress.
          Checking a criterion indicates that it has been
          reviewed by the evaluator. It does not automatically
          confirm WCAG compliance. A complete conformance
          assessment requires evaluating the applicable
          success criteria and conformance requirements.
        </p>
      </div>
    </section>
  )
}

export default WCAGChecklist
