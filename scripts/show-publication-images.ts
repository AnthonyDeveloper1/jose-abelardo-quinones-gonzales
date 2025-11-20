import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const publicaciones = await prisma.publication.findMany({
    select: {
      id: true,
      title: true,
      mainImage: true,
    },
  })

  console.log('Publicaciones:')
  publicaciones.forEach(pub => {
    console.log(`ID: ${pub.id} | Título: ${pub.title} | Imagen: ${pub.mainImage}`)
  })
}

main()
  .catch(e => {
    console.error(e)
  })
  .finally(() => {
    prisma.$disconnect()
  })
