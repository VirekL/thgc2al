export default {
  async fetch(request: Request): Promise<Response> {
    return new Response("Hello, World!", {
      headers: { "content-type": "text/plain" },
    });
  },
};
