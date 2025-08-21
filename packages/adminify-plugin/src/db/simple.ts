import fs from 'fs'

interface User {
  id: number
  email: string
  passwordHash: string
  createdAt: Date
}

class SimpleDB {
  private users: User[] = []
  private nextId = 1
  private dbFile = './adminify-users.json'

  constructor() {
    this.loadFromFile()
  }

  private loadFromFile() {
    try {
      if (fs.existsSync(this.dbFile)) {
        const data = JSON.parse(fs.readFileSync(this.dbFile, 'utf8'))
        this.users = data.users || []
        this.nextId = data.nextId || 1
      }
    } catch (error) {
      console.error('Error loading database:', error)
    }
  }

  private saveToFile() {
    try {
      fs.writeFileSync(this.dbFile, JSON.stringify({
        users: this.users,
        nextId: this.nextId
      }, null, 2))
    } catch (error) {
      console.error('Error saving database:', error)
    }
  }

  createUser(email: string, passwordHash: string): User {
    const existingUser = this.users.find(u => u.email === email)
    if (existingUser) {
      throw new Error('User already exists')
    }

    const user: User = {
      id: this.nextId++,
      email,
      passwordHash,
      createdAt: new Date()
    }

    this.users.push(user)
    this.saveToFile()
    return user
  }

  findUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email)
  }

  findUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id)
  }
}

export const simpleDB = new SimpleDB()