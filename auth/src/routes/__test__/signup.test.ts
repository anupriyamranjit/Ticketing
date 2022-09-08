import request from "supertest"
import { app } from "../../app"

jest.setTimeout(10000)

it('returns a 201 on sucessful signup', async () => {
    const result = await request(app)
    .post('/api/users/signup')
    .send({
        email: 'test@test.com',
        password: 'password'
    })
    .expect(201)
    return result
})