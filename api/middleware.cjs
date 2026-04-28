const fs = require('node:fs')
const path = require('node:path')
const multer = require('multer')

const DB_PATH = path.join(process.cwd(), 'db.json')
const MOCK_FILES_DIR = path.join(process.cwd(), 'public', 'mock-files')

const readDb = () => {
  const raw = fs.readFileSync(DB_PATH, 'utf-8')
  return JSON.parse(raw)
}

const writeDb = (db) => {
  fs.writeFileSync(DB_PATH, `${JSON.stringify(db, null, 2)}\n`, 'utf-8')
}

const sanitizeFileName = (name) =>
  String(name ?? 'document')
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

const saveUploadedFile = ({ fileName, fileContentBase64 }) => {
  if (!fileContentBase64 || !fileContentBase64.startsWith('data:')) {
    return null
  }

  const matches = fileContentBase64.match(/^data:([^;]+);base64,(.+)$/)
  if (!matches) return null

  const baseName = path.parse(fileName).name || 'document'
  const ext = path.extname(fileName) || '.bin'
  const safeBaseName = sanitizeFileName(baseName)
  const storedFileName = `${Date.now()}-${safeBaseName}${ext}`
  const targetPath = path.join(MOCK_FILES_DIR, storedFileName)

  fs.mkdirSync(MOCK_FILES_DIR, { recursive: true })
  fs.writeFileSync(targetPath, Buffer.from(matches[2], 'base64'))

  return `/mock-files/${storedFileName}`
}

const createStoredFileName = (originalName) => {
  const baseName = path.parse(originalName).name || 'document'
  const ext = path.extname(originalName) || '.bin'
  const safeBaseName = sanitizeFileName(baseName)
  return `${Date.now()}-${safeBaseName}${ext}`
}

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => {
      fs.mkdirSync(MOCK_FILES_DIR, { recursive: true })
      cb(null, MOCK_FILES_DIR)
    },
    filename: (_req, file, cb) => {
      cb(null, createStoredFileName(file.originalname))
    },
  }),
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
})

const sanitizeUser = (user) => {
  if (!user) return null
  //password kısmını ayırmak için
  const { password, ...safeUser } = user
  return safeUser
}

const SESSION_COOKIE_NAME = 'izimza_session'

const createSessionValue = (userId) => `fake-session-user-${userId}`

const parseCookies = (cookieHeader) => {
  if (!cookieHeader) return {}
  return cookieHeader.split(';').reduce((acc, part) => {
    const [key, ...valueParts] = part.trim().split('=')
    if (!key) return acc
    acc[key] = decodeURIComponent(valueParts.join('='))
    return acc
  }, {})
}

const getUserIdFromSessionCookie = (cookieHeader) => {
  const cookies = parseCookies(cookieHeader)
  const sessionValue = cookies[SESSION_COOKIE_NAME]
  if (!sessionValue) return null
  if (!sessionValue.startsWith('fake-session-user-')) return null
  const userId = Number(sessionValue.replace('fake-session-user-', ''))
  return Number.isNaN(userId) ? null : userId
}

const sendJson = (res, statusCode, payload) => {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

const requireAuth = (req, res) => {
  const userId = getUserIdFromSessionCookie(req.headers.cookie)
  if (!userId) {
    sendJson(res, 401, {
      message: 'Bu islem icin yetki gerekiyor.',
    })
    return null
  }
  return userId
}

const createUploadedDocument = ({ fileName, fileSizeMb, previewUrl }) => {
  const db = readDb()
  const nextDocId = db.documents.length ? Math.max(...db.documents.map((d) => d.id)) + 1 : 1
  const nextActivityId = db.activities.length ? Math.max(...db.activities.map((a) => a.id)) + 1 : 1
  const createdAt = new Date().toISOString()

  const document = {
    id: nextDocId,
    name: fileName,
    sizeMb: Number(fileSizeMb),
    action: 'uploaded',
    createdAt,
    previewUrl,
  }

  db.documents.unshift(document)
  db.activities.unshift({
    id: nextActivityId,
    title: `${fileName} yuklendi`,
    createdAt,
  })
  writeDb(db)

  return document
}

const deleteDocumentById = (documentId) => {
  const db = readDb()
  const existingDoc = db.documents.find((item) => item.id === documentId)
  if (!existingDoc) return false

  db.documents = db.documents.filter((item) => item.id !== documentId)
  db.activities.unshift({
    id: db.activities.length ? Math.max(...db.activities.map((a) => a.id)) + 1 : 1,
    title: `${existingDoc.name} silindi`,
    createdAt: new Date().toISOString(),
  })
  writeDb(db)

  if (existingDoc.previewUrl?.startsWith('/mock-files/')) {
    const relativePreviewPath = existingDoc.previewUrl.replace(/^\//, '')
    const targetPath = path.join(process.cwd(), 'public', relativePreviewPath)
    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath)
    }
  }

  return true
}

module.exports = (req, res, next) => {
  const requestOrigin = req.headers.origin || 'http://localhost:5173'
  res.setHeader('Access-Control-Allow-Origin', requestOrigin)
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,PUT,DELETE,OPTIONS')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    return res.end()
  }

  if (req.method === 'POST' && req.path === '/api/auth/login') {
    const { email, password } = req.body ?? {}
    const db = readDb()
    const user = db.users.find((item) => item.email === email && item.password === password)

    if (!user) {
      return sendJson(res, 401, { message: 'Email veya sifre hatali.' })
    }

    res.setHeader(
      'Set-Cookie',
      `${SESSION_COOKIE_NAME}=${createSessionValue(user.id)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400`,
    )

    return sendJson(res, 200, { user: sanitizeUser(user) })
  }

  if (req.method === 'POST' && req.path === '/api/auth/logout') {
    res.setHeader(
      'Set-Cookie',
      `${SESSION_COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`,
    )
    return sendJson(res, 200, { message: 'Cikis basarili.' })
  }

  if (req.path === '/api/auth/me') {
    const userId = requireAuth(req, res)
    if (!userId) return

    const db = readDb()
    const user = db.users.find((item) => item.id === userId)
    if (!user) {
      return sendJson(res, 401, { message: 'Oturum gecersiz veya suresi dolmus.' })
    }
    return sendJson(res, 200, sanitizeUser(user))
  }

  if (req.method === 'GET' && req.path === '/api/dashboard/stats') {
    const userId = requireAuth(req, res)
    if (!userId) return
    const db = readDb()
    return sendJson(res, 200, db.dashboardStats)
  }

  if (req.method === 'GET' && req.path === '/api/dashboard/pending-signatures') {
    const userId = requireAuth(req, res)
    if (!userId) return
    const db = readDb()
    const pendingCount = db.documents.filter(
      (item) => item.action === 'uploaded' || item.action === 'pending_signature',
    ).length
    return sendJson(res, 200, { pendingCount })
  }

  if (req.method === 'GET' && req.path === '/api/activities/list') {
    const userId = requireAuth(req, res)
    if (!userId) return
    const db = readDb()
    return sendJson(res, 200, db.activities)
  }

  if (req.method === 'GET' && req.path === '/api/documents/recent') {
    const userId = requireAuth(req, res)
    if (!userId) return
    const db = readDb()
    const recent = [...db.documents]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
    return sendJson(res, 200, recent)
  }

  if (req.method === 'POST' && req.path === '/api/documents/upload') {
    const userId = requireAuth(req, res)
    if (!userId) return

    if (req.headers['content-type']?.includes('multipart/form-data')) {
      return upload.single('file')(req, res, (error) => {
        if (error) {
          if (error.code === 'LIMIT_FILE_SIZE') {
            return sendJson(res, 413, { message: 'Dosya boyutu 50 MB limitini asamaz.' })
          }
          return sendJson(res, 400, { message: 'Dosya yukleme formati gecersiz.' })
        }

        if (!req.file) {
          return sendJson(res, 400, { message: 'file alani zorunludur.' })
        }

        const uploadedFileSizeMb = Number((req.file.size / (1024 * 1024)).toFixed(2))
        const previewUrl = `/mock-files/${req.file.filename}`
        const document = createUploadedDocument({
          fileName: req.file.originalname,
          fileSizeMb: uploadedFileSizeMb,
          previewUrl,
        })

        return sendJson(res, 201, {
          message: 'Belge yukleme basarili.',
          document,
        })
      })
    }

    const { fileName, fileSizeMb, fileContentBase64 } = req.body ?? {}
    if (!fileName || !fileSizeMb) {
      return sendJson(res, 400, { message: 'fileName ve fileSizeMb alanlari zorunludur.' })
    }

    const savedPreviewUrl = saveUploadedFile({ fileName, fileContentBase64 })
    const document = createUploadedDocument({
      fileName,
      fileSizeMb,
      previewUrl: savedPreviewUrl ?? '/mock-files/README.txt',
    })

    return sendJson(res, 201, {
      message: 'Belge yukleme basarili.',
      document,
    })
  }

  if (req.path === '/api/profile/me') {
    const userId = requireAuth(req, res)
    if (!userId) return

    const db = readDb()
    const userIndex = db.users.findIndex((item) => item.id === userId)
    if (userIndex === -1) {
      return sendJson(res, 404, { message: 'Profil kaydi bulunamadi.' })
    }

    if (req.method === 'GET') {
      return sendJson(res, 200, sanitizeUser(db.users[userIndex]))
    }

    if (req.method === 'PATCH') {
      db.users[userIndex] = { ...db.users[userIndex], ...req.body }
      writeDb(db)
      return sendJson(res, 200, sanitizeUser(db.users[userIndex]))
    }
  }

  if (req.method === 'DELETE' && /^\/api\/documents\/\d+$/.test(req.path)) {
    const userId = requireAuth(req, res)
    if (!userId) return

    const documentId = Number(req.path.split('/').pop())
    const isDeleted = deleteDocumentById(documentId)
    if (!isDeleted) {
      return sendJson(res, 404, { message: 'Belge bulunamadi.' })
    }

    return sendJson(res, 200, { message: 'Belge silindi.' })
  }

  if (req.method === 'POST' && req.path === '/api/timestamp/upload') {
    const userId = requireAuth(req, res)
    if (!userId) return

    const { fileName, fileSizeMb } = req.body ?? {}
    if (!fileName || !fileSizeMb) {
      return sendJson(res, 400, { message: 'fileName ve fileSizeMb alanlari zorunludur.' })
    }

    const db = readDb()
    const nextDocId = db.documents.length ? Math.max(...db.documents.map((d) => d.id)) + 1 : 1
    const nextActivityId = db.activities.length ? Math.max(...db.activities.map((a) => a.id)) + 1 : 1
    const createdAt = new Date().toISOString()

    const document = {
      id: nextDocId,
      name: fileName,
      sizeMb: Number(fileSizeMb),
      action: 'timestamped',
      createdAt,
      previewUrl: '/mock-files/README.txt',
    }

    db.documents.unshift(document)
    db.activities.unshift({
      id: nextActivityId,
      title: `${fileName} zaman damgalandi`,
      createdAt,
    })
    db.dashboardStats.totalTimestamped += 1
    db.dashboardStats.remainingCredits = Math.max(0, db.dashboardStats.remainingCredits - 1)
    writeDb(db)

    return sendJson(res, 201, {
      message: 'Zaman damgalama tamamlandi.',
      document,
    })
  }

  next()
}
