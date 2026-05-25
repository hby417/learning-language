import { Request, Response, NextFunction } from 'express'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  console.log('Authorization header:', authHeader?.substring(0, 30))

  if (!authHeader?.startsWith('Bearer ')) {
    console.log('Token eksik veya yanlış format')
    res.status(401).json({ error: 'Token eksik' })
    return
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = await getAuth().verifyIdToken(token)
    console.log('Token doğrulandı, uid:', decoded.uid)
    ;(req as any).user = decoded
    next()
  } catch (err) {
    console.error('Token doğrulama hatası:', err)
    res.status(401).json({ error: 'Geçersiz token' })
  }
}