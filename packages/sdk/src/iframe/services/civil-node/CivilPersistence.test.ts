import { CivilPersistence } from "./CivilPersistence";
import { Key } from "../keys/Key";
describe("CivilPersistence", () => {
  let civil: CivilPersistence;
  let key: Key;
  beforeEach(async () => {
    fetchMock.resetMocks();
    civil = new CivilPersistence("http://localhost:8080");
    key = await Key.generate();
  });
  it("should store and retrieve using HTTP", async () => {
    const retrieveResponse = { data: "12345" };
    fetchMock.mockResponse(JSON.stringify(retrieveResponse));
    const objectID = "test";
    const data = { iv: "foo", ciphertext: "bar" };
    const pub = key.getPublicKey();
    const signature = await key.sign(objectID);

    await civil.store(pub, signature, objectID, data);
    const retrieve = await civil.retrieve(pub, signature, objectID);

    expect(retrieve).toEqual(retrieveResponse);
  });
});
