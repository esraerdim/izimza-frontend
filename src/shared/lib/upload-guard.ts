type UploadGuardInput = {
  file: File
  remainingCredits: number
  maxUploadSizeMb: number
  bytesPerMb: number
}

export type UploadGuardResult =
  | { ok: true; fileSizeMb: number }
  | { ok: false; error: 'noCredits' | 'fileTooLarge'; fileSizeMb: number }

export const getFileSizeMb = (file: File, bytesPerMb: number) =>
  Number((file.size / bytesPerMb).toFixed(2))

export const validateUploadGuard = ({
  file,
  remainingCredits,
  maxUploadSizeMb,
  bytesPerMb,
}: UploadGuardInput): UploadGuardResult => {
  const fileSizeMb = getFileSizeMb(file, bytesPerMb)
  if (remainingCredits <= 0) {
    return { ok: false, error: 'noCredits', fileSizeMb }
  }
  if (fileSizeMb > maxUploadSizeMb) {
    return { ok: false, error: 'fileTooLarge', fileSizeMb }
  }
  return { ok: true, fileSizeMb }
}
