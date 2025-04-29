import fastify from 'fastify'
import fastifyMultipart from '@fastify/multipart'
import fs from 'node:fs'
import path from 'node:path'
import { pipeline } from 'node:stream/promises'
import fastifyStatic from '@fastify/static'
import cors from '@fastify/cors'

const app = fastify()

app.register(cors, {
    origin: '*'
})
app.register(fastifyMultipart)
app.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'uploads'),
    prefix: '/uploads'
})

app.get('/', async (request, reply) => {
    return reply.send('Hello World')
})

app.post('/upload', async (request, reply) => {
    const data = await request.file()

    if (!data) {
        return reply.status(400).send({ message: 'Please provide a file' })
    }

    const uploadPath = path.join(__dirname, '..', 'uploads', data.filename)

    await pipeline(data.file, fs.createWriteStream(uploadPath))

    return reply.send({ message: 'File saved' })
})

app.get('/download/:fileName', async (request, reply) => {
    const { fileName } = request.params

    return reply.download(fileName)
})

app.listen({ port: 3333 }, () => {
    console.log('HTP Server Running!')
})