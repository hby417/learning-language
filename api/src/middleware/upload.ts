import multer from 'multer'
import path from 'node:path'
// Dosya yükleme için multer yapılandırması
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'))
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  }
})
// Sadece belirli dosya türlerine izin ver
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'audio/mpeg', 'audio/wav', 'audio/ogg']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })