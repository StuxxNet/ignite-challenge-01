export class BodyParser {
  #req = {};

  constructor(req) {
    this.#req = req;
  }

  async extractBodyInJson() {
    const buffers = [];
    for await (const chunk of this.#req) {
      buffers.push(chunk);
    }

    try {
      this.#req.body = JSON.parse(Buffer.concat(buffers).toString());
    } catch {
      this.#req.body = null;
    }

    return this.#req;
  }
}
