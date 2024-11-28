import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type User = {
  id: number
  name: string 
  email: string
}

export default async function Home() {
  const users: User[] = await prisma.user.findMany()

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name ?? 'No Name'} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  )
}
