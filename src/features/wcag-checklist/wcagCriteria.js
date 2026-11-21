
const wcagCriteria = [
  // PERCEIVABLE
  {
    principle: 'Perceivable',
    criteria: [
      ['1.1.1', 'Non-text Content', 'A', 'Provide text alternatives for non-text content.'],
      ['1.2.1', 'Audio-only and Video-only (Prerecorded)', 'A', 'Provide alternatives for prerecorded audio-only and video-only content.'],
      ['1.2.2', 'Captions (Prerecorded)', 'A', 'Provide captions for prerecorded synchronized media.'],
      ['1.2.3', 'Audio Description or Media Alternative (Prerecorded)', 'A', 'Provide audio description or a media alternative for prerecorded video.'],
      ['1.2.4', 'Captions (Live)', 'AA', 'Provide captions for live synchronized media.'],
      ['1.2.5', 'Audio Description (Prerecorded)', 'AA', 'Provide audio description for prerecorded video content.'],
      ['1.3.1', 'Info and Relationships', 'A', 'Ensure information, structure, and relationships can be programmatically determined.'],
      ['1.3.2', 'Meaningful Sequence', 'A', 'Ensure the reading sequence preserves meaning.'],
      ['1.3.3', 'Sensory Characteristics', 'A', 'Do not rely only on shape, size, visual location, or sound to convey instructions.'],
      ['1.3.4', 'Orientation', 'AA', 'Support both portrait and landscape orientation unless a specific orientation is essential.'],
      ['1.3.5', 'Identify Input Purpose', 'AA', 'Identify the purpose of common user input fields programmatically.'],
      ['1.4.1', 'Use of Color', 'A', 'Do not use color as the only visual means of conveying information.'],
      ['1.4.2', 'Audio Control', 'A', 'Provide controls for audio that plays automatically for more than three seconds.'],
      ['1.4.3', 'Contrast (Minimum)', 'AA', 'Maintain at least 4.5:1 contrast for normal text and 3:1 for large text.'],
      ['1.4.4', 'Resize Text', 'AA', 'Allow text to be resized up to 200% without loss of content or functionality.'],
      ['1.4.5', 'Images of Text', 'AA', 'Use actual text instead of images of text except where essential or customizable.'],
      ['1.4.10', 'Reflow', 'AA', 'Support content reflow without two-dimensional scrolling at specified viewport sizes.'],
      ['1.4.11', 'Non-text Contrast', 'AA', 'Ensure visual information needed to identify controls and graphical objects has sufficient contrast.'],
      ['1.4.12', 'Text Spacing', 'AA', 'Support user-adjusted text spacing without loss of content or functionality.'],
      ['1.4.13', 'Content on Hover or Focus', 'AA', 'Make additional hover or focus content dismissible, hoverable, and persistent.'],
    ],
  },

  // OPERABLE
  {
    principle: 'Operable',
    criteria: [
      ['2.1.1', 'Keyboard', 'A', 'Make all functionality available through a keyboard interface.'],
      ['2.1.2', 'No Keyboard Trap', 'A', 'Ensure keyboard focus can move away from every component.'],
      ['2.1.4', 'Character Key Shortcuts', 'A', 'Allow single-character shortcuts to be turned off, remapped, or activated only on focus.'],
      ['2.2.1', 'Timing Adjustable', 'A', 'Allow users to turn off, adjust, or extend time limits where required.'],
      ['2.2.2', 'Pause, Stop, Hide', 'A', 'Provide controls for moving, blinking, scrolling, or auto-updating content.'],
      ['2.3.1', 'Three Flashes or Below Threshold', 'A', 'Ensure content does not flash more than three times in any one-second period unless below thresholds.'],
      ['2.4.1', 'Bypass Blocks', 'A', 'Provide a way to bypass repeated blocks of content.'],
      ['2.4.2', 'Page Titled', 'A', 'Provide descriptive titles for web pages.'],
      ['2.4.3', 'Focus Order', 'A', 'Ensure keyboard focus follows an order that preserves meaning and operability.'],
      ['2.4.4', 'Link Purpose (In Context)', 'A', 'Make the purpose of each link understandable from its text or context.'],
      ['2.4.5', 'Multiple Ways', 'AA', 'Provide more than one way to locate a web page within a website, where applicable.'],
      ['2.4.6', 'Headings and Labels', 'AA', 'Use headings and labels that describe their topic or purpose.'],
      ['2.4.7', 'Focus Visible', 'AA', 'Ensure keyboard focus indicators are visible.'],
      ['2.4.11', 'Focus Not Obscured (Minimum)', 'AA', 'Ensure focused components are not entirely hidden by author-created content.'],
      ['2.5.1', 'Pointer Gestures', 'A', 'Provide a simple pointer alternative for multipoint or path-based gestures.'],
      ['2.5.2', 'Pointer Cancellation', 'A', 'Allow pointer actions to be cancelled or reversed under the specified conditions.'],
      ['2.5.3', 'Label in Name', 'A', 'Ensure the accessible name includes the visible label text.'],
      ['2.5.4', 'Motion Actuation', 'A', 'Provide alternatives to functionality triggered by device motion.'],
      ['2.5.7', 'Dragging Movements', 'AA', 'Provide a single-pointer alternative to dragging movements.'],
      ['2.5.8', 'Target Size (Minimum)', 'AA', 'Ensure pointer targets meet the minimum size or spacing requirements.'],
    ],
  },

  // UNDERSTANDABLE
  {
    principle: 'Understandable',
    criteria: [
      ['3.1.1', 'Language of Page', 'A', 'Programmatically identify the default human language of each page.'],
      ['3.1.2', 'Language of Parts', 'AA', 'Programmatically identify the language of passages that differ from the page language.'],
      ['3.2.1', 'On Focus', 'A', 'Receiving focus must not automatically trigger a change of context.'],
      ['3.2.2', 'On Input', 'A', 'Changing a control setting must not automatically trigger an unexpected change of context.'],
      ['3.2.3', 'Consistent Navigation', 'AA', 'Keep repeated navigation mechanisms in a consistent relative order.'],
      ['3.2.4', 'Consistent Identification', 'AA', 'Identify components with the same functionality consistently.'],
      ['3.2.6', 'Consistent Help', 'A', 'Keep help mechanisms in a consistent relative location across pages where applicable.'],
      ['3.3.1', 'Error Identification', 'A', 'Identify input errors and describe them to users in text.'],
      ['3.3.2', 'Labels or Instructions', 'A', 'Provide labels or instructions when user input is required.'],
      ['3.3.3', 'Error Suggestion', 'AA', 'Provide suggestions for correcting input errors when known.'],
      ['3.3.4', 'Error Prevention (Legal, Financial, Data)', 'AA', 'Provide safeguards for important submissions involving legal, financial, or data changes.'],
      ['3.3.7', 'Redundant Entry', 'A', 'Do not require users to re-enter information already provided in the same process, where applicable.'],
      ['3.3.8', 'Accessible Authentication (Minimum)', 'AA', 'Avoid requiring cognitive function tests for authentication unless an allowed exception applies.'],
    ],
  },

  // ROBUST
  {
    principle: 'Robust',
    criteria: [
      ['4.1.2', 'Name, Role, Value', 'A', 'Ensure user interface components expose their name, role, and value programmatically.'],
      ['4.1.3', 'Status Messages', 'AA', 'Ensure status messages can be programmatically determined without receiving focus.'],
    ],
  },
]

export default wcagCriteria
