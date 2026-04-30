import { describe, expect, it } from 'vitest'
import { useRecipientDialog } from '../useRecipientDialog'

describe('useRecipientDialog', () => {
  it('starts closed with an empty draft', () => {
    const dialog = useRecipientDialog()
    expect(dialog.isOpen.value).toBe(false)
    expect(dialog.draft.value).toBe('')
  })

  it('opens with a fresh draft and closes cleanly', () => {
    const dialog = useRecipientDialog()
    dialog.draft.value = 'leftover'
    dialog.open()
    expect(dialog.isOpen.value).toBe(true)
    expect(dialog.draft.value).toBe('')

    dialog.draft.value = 'me@izimza.com'
    dialog.close()
    expect(dialog.isOpen.value).toBe(false)
    expect(dialog.draft.value).toBe('')
  })

  it('validates email and trims whitespace', () => {
    const dialog = useRecipientDialog()
    dialog.draft.value = '   not-an-email   '
    expect(dialog.isValid()).toBe(false)
    dialog.draft.value = '   me@izimza.com  '
    expect(dialog.isValid()).toBe(true)
    expect(dialog.trimmedRecipient()).toBe('me@izimza.com')
  })
})
