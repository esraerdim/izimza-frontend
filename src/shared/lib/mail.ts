
export const openWebMailCompose = (subject: string, body: string, recipient = '') => {
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    recipient,
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  window.open(gmailUrl, '_blank', 'noopener,noreferrer')
}
