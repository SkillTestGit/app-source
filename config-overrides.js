const webpack = require("webpack");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  
  Object.assign(fallback, {
    "crypto": false,
    "stream": false,
    "assert": false,
    "http": false,
    "https": false,
    "os": false,
    "url": false,
    "zlib": false,
    "process": require.resolve("process/browser.js"),
    "buffer": require.resolve("buffer"),
  });
  
  config.resolve.fallback = fallback;
  config.ignoreWarnings = [/Failed to parse source map/];
  
  // Fix for ESM modules like framer-motion
  config.resolve.extensionAlias = {
    ".js": [".ts", ".tsx", ".js", ".jsx"],
    ".mjs": [".mts", ".mjs"]
  };
  
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser.js",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  
  return config;
};