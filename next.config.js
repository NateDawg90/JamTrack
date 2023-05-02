/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = /** @type {import('next').NextConfig} */ {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  webpack(config) {
    // To support normal svg import and svgr style import
    // See this: https://stackoverflow.com/a/75124839 for more information

    let defaultSvgLoader = config.module.rules.find(
      (rule) => typeof rule?.test?.test === "function" && rule.test.test(".svg")
    );
    // Duplicate the loader options since we'll modify this
    defaultSvgLoader = { ...defaultSvgLoader };

    // svgr rule
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      // only use svgr to load svg if path ends with *.svg?svgr
      resourceQuery: /svgr/,
      use: ["@svgr/webpack"],
    });

    // Normal svg rule
    defaultSvgLoader.test = /\.svg$/i;
    // Ignore this rule if the path ends with *.svg?svgr
    defaultSvgLoader.resourceQuery = { not: [/svgr/] };
    config.module.rules.push(defaultSvgLoader);

    return config;
  },

  images: {
    domains: [
      "localhost",
      "s3.fuseignited.com",
      "staging.fuseignited.com",
      "portal.fuseignited.com",
    ],
  },
};
