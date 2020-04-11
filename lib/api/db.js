import { nanoid } from 'nanoid'
/**
 * This DB is a mock and will only work for the life of the serverless function that's using it.
 * In a real application use a real DB instead
 */
export default {
  carts: new Map(),
  async getSession(id) {
    return this.carts.get(id)
  },
  async createSession() {
    const id = nanoid()
    const session = { id, products: [] }

    this.carts.set(id, session)

    return session
  },
  async updateSession(id, session) {
    this.carts.set(id, session)
    return session
  }
}