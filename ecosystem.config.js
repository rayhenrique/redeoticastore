module.exports = {
  apps: [
    {
      name: "redeoticastore",
      cwd: __dirname,
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3009,
      },
    },
  ],
};
