
import axe from 'axe-core'

const WCAG_TAGS = [
  'wcag2a',
  'wcag2aa',
  'wcag21a',
  'wcag21aa',
  'wcag22aa',
]

/**
 * Run axe-core on a same-origin demo page iframe.
 *
 * @param {HTMLIFrameElement} iframe
 * @returns {Promise<object>}
 */
export async function runAxeAudit(iframe) {
  if (!iframe) {
    throw new Error('Demo page iframe was not provided.')
  }

  const frameDocument = iframe.contentDocument

  if (!frameDocument || !iframe.contentWindow) {
    throw new Error(
      'Unable to access demo page. Make sure the iframe uses the same origin.',
    )
  }

  if (!frameDocument.body) {
    throw new Error('Demo page has not finished loading.')
  }

  try {
    const results = await axe.run(frameDocument, {
      runOnly: {
        type: 'tag',
        values: WCAG_TAGS,
      },
    })

    return results
  } catch (error) {
    throw new Error(
      `Accessibility audit failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
      { cause: error },
    )
  }
}
