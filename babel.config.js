module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.android.js',
          '.android.tsx',
          '.ios.js',
          '.ios.tsx',
          '.png',
          '.jpg',
          '.jepg',
          '.svg'
        ],
        alias: {
          "@components": "./saluhud/components",
          "@styles": "./saluhud/styles",
          "@screens": "./saluhud/screens",
          "@resources": "./saluhud/resources"
        }
      }
    ]
  ]
};
