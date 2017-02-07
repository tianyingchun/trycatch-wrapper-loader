# try-catch wrapper loader for webpack

support both es6, jsx

## install
```
npm install --save trycatch-wrapper-loader
```

## usage
```
module: {
		{
			test: /\.js|jsx$/,
			loader: 'babel-loader?presets[]=es2015!trycatch-wrapper-loader',
			exclude: /(node_modules|bower_components)/
		}
}

```

## catchHandler

pass function string to exceptionHandler porperty

```
module.exports = {
	entry: {
    'test': './test'
  },
  module: {
    rules: [
      // For testing purpose, use local loader :`loader: path.join(__dirname, 'index.js')`
      { test: /\.(js|jsx)$/, use: [{ loader: 'babel-loader', options: { presets: ["es2015"] } }, { loader: path.join(__dirname, 'index.js'), options: { exceptionHandler: 'console.error(e);windowsendError(e)' } }], exclude: /(node_modules|bower_components)/ }
    ]
  },

```

Note: ./test, gulp is used for testing purpose.
