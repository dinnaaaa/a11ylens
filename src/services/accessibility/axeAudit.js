
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

  const frameWindow = iframe.contentWindow
  const frameDocument = iframe.contentDocument

  if (!frameWindow || !frameDocument) {
    throw new Error(
      'Unable to access demo page. Make sure the iframe uses the same origin.',
    )
  }

  if (!frameDocument.body) {
    throw new Error('Demo page has not finished loading.')
  }

  try {
    // Inject axe-core into the demo page iframe.
    if (!frameWindow.axe) {
      const script = frameDocument.createElement('script')

      script.id = 'a11ylens-axe-core'
      script.textContent = axe.source

      frameDocument.head.appendChild(script)
    }

    if (!frameWindow.axe) {
      throw new Error(
        'Failed to initialize axe-core in the demo page.',
      )
    }

    const results = await frameWindow.axe.run(frameDocument, {
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
