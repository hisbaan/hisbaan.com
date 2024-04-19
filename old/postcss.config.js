module.exports = {
  plugins: [
    require("autoprefixer"),
    ...(process.env.JEKYLL_ENV == "production"
      ? [require("cssnano")({ preset: "default" })]
      : [])
  ]
};
