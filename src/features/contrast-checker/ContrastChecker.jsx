
import { useState } from 'react'
import {
  normalizeHexColor,
  calculateContrastRatio,
} from './contrastUtils'

const DEFAULT_FOREGROUND = '#1F2937'
const DEFAULT_BACKGROUND = '#FFFFFF'

function getResultClass(isPassed) {
  return isPassed ? 'text-bg-success' : 'text-bg-danger'
}

function ContrastChecker() {
  const [foreground, setForeground] = useState(
    DEFAULT_FOREGROUND,
  )

  const [background, setBackground] = useState(
    DEFAULT_BACKGROUND,
  )

  const normalizedForeground = normalizeHexColor(foreground)
  const normalizedBackground = normalizeHexColor(background)

  const isValid =
    normalizedForeground !== null &&
    normalizedBackground !== null

  const contrastRatio = isValid
    ? calculateContrastRatio(foreground, background)
    : null

  const normalAA = contrastRatio !== null && contrastRatio >= 4.5
  const normalAAA = contrastRatio !== null && contrastRatio >= 7
  const largeAA = contrastRatio !== null && contrastRatio >= 3
  const largeAAA = contrastRatio !== null && contrastRatio >= 4.5

  function handleReset() {
    setForeground(DEFAULT_FOREGROUND)
    setBackground(DEFAULT_BACKGROUND)
  }

  return (
    <section className="page-placeholder">
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">
            A11YLENS WORKSPACE
          </span>

          <h2>Contrast Checker</h2>

          <p>
            Evaluate text and background color contrast
            against WCAG accessibility requirements.
          </p>
        </div>
      </div>

      {/* Color Inputs */}
      <div className="placeholder-panel mb-4">
        <div className="mb-3">
          <h3 className="h5 mb-1">Color Selection</h3>

          <p className="text-secondary mb-0">
            Select foreground and background colors
            to calculate their contrast ratio.
          </p>
        </div>

        <div className="row g-4">
          {/* Foreground */}
          <div className="col-12 col-md-6">
            <label
              htmlFor="foreground-color"
              className="form-label fw-semibold"
            >
              Foreground (Text Color)
            </label>

            <div className="d-flex gap-2">
              <input
                id="foreground-picker"
                type="color"
                className="form-control form-control-color"
                value={normalizedForeground || '#000000'}
                onChange={(event) =>
                  setForeground(event.target.value.toUpperCase())
                }
                aria-label="Choose foreground color"
              />

              <input
                id="foreground-color"
                type="text"
                className={`form-control ${
                  normalizedForeground ? '' : 'is-invalid'
                }`}
                value={foreground}
                onChange={(event) =>
                  setForeground(event.target.value)
                }
                placeholder="#1F2937"
                aria-invalid={!normalizedForeground}
                aria-describedby={
                  !normalizedForeground
                    ? 'foreground-error'
                    : undefined
                }
              />
            </div>

            {!normalizedForeground && (
              <div
                id="foreground-error"
                className="invalid-feedback d-block"
                role="alert"
              >
                Enter a valid HEX color, such as #1F2937.
              </div>
            )}
          </div>

          {/* Background */}
          <div className="col-12 col-md-6">
            <label
              htmlFor="background-color"
              className="form-label fw-semibold"
            >
              Background Color
            </label>

            <div className="d-flex gap-2">
              <input
                id="background-picker"
                type="color"
                className="form-control form-control-color"
                value={normalizedBackground || '#FFFFFF'}
                onChange={(event) =>
                  setBackground(event.target.value.toUpperCase())
                }
                aria-label="Choose background color"
              />

              <input
                id="background-color"
                type="text"
                className={`form-control ${
                  normalizedBackground ? '' : 'is-invalid'
                }`}
                value={background}
                onChange={(event) =>
                  setBackground(event.target.value)
                }
                placeholder="#FFFFFF"
                aria-invalid={!normalizedBackground}
                aria-describedby={
                  !normalizedBackground
                    ? 'background-error'
                    : undefined
                }
              />
            </div>

            {!normalizedBackground && (
              <div
                id="background-error"
                className="invalid-feedback d-block"
                role="alert"
              >
                Enter a valid HEX color, such as #FFFFFF.
              </div>
            )}
          </div>
        </div>

        <div className="mt-3">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={handleReset}
          >
            Reset Colors
          </button>
        </div>
      </div>

      {/* Color Preview */}
      <div className="placeholder-panel mb-4">
        <h3 className="h5 mb-3">Color Preview</h3>

        {isValid ? (
          <div
            className="border rounded p-4"
            style={{
              color: normalizedForeground,
              backgroundColor: normalizedBackground,
            }}
          >
            <h4 className="mb-3">
              Sample Heading
            </h4>

            <p className="mb-3">
              This is an example of normal text using
              the selected foreground and background colors.
            </p>

            <p className="fs-4 fw-bold mb-0">
              This is an example of large text.
            </p>
          </div>
        ) : (
          <div
            className="alert alert-warning mb-0"
            role="status"
          >
            Enter valid foreground and background HEX colors
            to display the preview.
          </div>
        )}
      </div>

      {/* Contrast Ratio */}
      <div className="placeholder-panel mb-4">
        <h3 className="h5 mb-3">
          Contrast Ratio
        </h3>

        {isValid ? (
          <>
            <div
              className="border rounded p-4 text-center"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className="text-secondary small mb-1">
                Calculated Contrast Ratio
              </p>

              <h2 className="mb-1">
                {contrastRatio.toFixed(2)}:1
              </h2>

              <p className="text-secondary small mb-0">
                Based on the selected foreground and
                background colors.
              </p>
            </div>

            {/* WCAG Evaluation */}
            <h3 className="h5 mt-4 mb-3">
              WCAG Compliance Results
            </h3>

            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th scope="col">Text Category</th>
                    <th scope="col">WCAG Level</th>
                    <th scope="col">Required Ratio</th>
                    <th scope="col">Result</th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <th scope="row" rowSpan={2}>
                      Normal Text
                    </th>

                    <td>AA</td>
                    <td>4.5:1</td>

                    <td>
                      <span
                        className={`badge ${getResultClass(normalAA)}`}
                      >
                        {normalAA ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>AAA</td>
                    <td>7:1</td>

                    <td>
                      <span
                        className={`badge ${getResultClass(normalAAA)}`}
                      >
                        {normalAAA ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <th scope="row" rowSpan={2}>
                      Large Text
                    </th>

                    <td>AA</td>
                    <td>3:1</td>

                    <td>
                      <span
                        className={`badge ${getResultClass(largeAA)}`}
                      >
                        {largeAA ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>AAA</td>
                    <td>4.5:1</td>

                    <td>
                      <span
                        className={`badge ${getResultClass(largeAAA)}`}
                      >
                        {largeAAA ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div
            className="alert alert-warning mb-0"
            role="alert"
          >
            Contrast ratio cannot be calculated.
            Please correct both color values.
          </div>
        )}
      </div>

      {/* WCAG Information */}
      <div className="alert alert-info mb-0">
        <strong>WCAG Large Text Definition</strong>

        <p className="mb-0 mt-2">
          Large text means at least 18pt (approximately 24px)
          or 14pt bold (approximately 18.67px).
          This checker evaluates color contrast only and
          does not represent complete WCAG conformance.
        </p>
      </div>
    </section>
  )
}

export default ContrastChecker
