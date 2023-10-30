import supertest from "supertest";
import index from '../routes/index';


test("Hello", () => {
    const res = await request(index).get("sdf").send();
})