import fastify from 'fastify'

const app = fastify()

app.listen({ port: 3333 }, () => {
    console.log('HTP Server Running!')
})