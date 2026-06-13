interface Env {
  DB: {
    prepare(query: string): {
      bind(...values: unknown[]): {
        run(): Promise<unknown>;
      };
    };
  };
}

export default {
  async scheduled(_controller: unknown, env: Env): Promise<void> {
    await env.DB.prepare('DELETE FROM inquiries WHERE expires_at < ?')
      .bind(new Date().toISOString())
      .run();
  },
};
