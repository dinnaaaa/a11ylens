
import axe from 'axe-core'

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
    throw new Error(
      'Unable to access the demo page. Make sure the iframe has finished loading and uses the same origin.',
    )
  }

  try {
    // Load axe-core into the iframe's own JavaScript context.
    if (!frameWindow.axe) {
      const script = frameDocument.createElement('script')

      script.id = 'a11ylens-axe-core'
      script.textContent = axe.source

      frameDocument.head.appendChild(script)
    }

    if (
      !frameWindow.axe ||
      typeof frameWindow.axe.run !== 'function'
    ) {
      throw new Error(
        'Unable to initialize axe-core inside the demo page iframe.',
      )
    }

    // Run the audit using the iframe's own axe-core instance.
    const results = await frameWindow.axe.run({
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
