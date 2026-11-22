
const WCAG_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22aa',
]

/**
 * Run axe-core inside the same-origin demo page iframe.
 *
 * @param {HTMLIFrameElement} iframe
 * @returns {Promise<object>}
 */
export async function runAxeAudit(iframe) {
  if (!iframe) {
    throw new Error('Demo page iframe was not provided.')
  }

  const frameWindow = iframe.contentWindow
  const frameDocument = iframe.contentDocument

  if (!frameWindow || !frameDocument || !frameDocument.body) {
    throw new Error('Unable to access the demo page iframe.')
  }

  const frameAxe = frameWindow.axe

  if (!frameAxe || typeof frameAxe.run !== 'function') {
    throw new Error(
      'axe-core is not available inside the demo page iframe.',
    )
  }

  try {
    return await frameAxe.run({
      runOnly: {
        type: 'tag',
        values: WCAG_TAGS,
      },
    })
  } catch (error) {
    throw new Error(
      `Accessibility audit failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
      { cause: error },
    )
  }
}
