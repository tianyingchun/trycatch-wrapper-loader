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

pass function string to trycatchHandler porperty

```
module.exports = {
	entry: {
		app: path.join(__dirname, '/app/app.jsx'),
		react: ['react']
	},
	trycatchHandler: 'console.error(e);windowsendError(e)',
		
```

Note: ./src , gulp is used for testing purpose.
