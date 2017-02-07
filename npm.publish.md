Getting Started with NPM (as a developer)
===

If you haven't already set your NPM author info, now you should:

    npm set init.author.name "Your Name"
    npm set init.author.email "you@example.com"
    npm set init.author.url "http://yourblog.com"

    npm adduser

Then create a `package.json` and publish it:

    cd /path/to/your-project
    npm init

    npm install -g pakmanager
    # this shows you dependencies as you `require`d them
    pakmanager deps
    # now edit `package.json` and add any deps you forgot about

    npm publish ./

Beta and Release versions
---

If you don't want something to install by default

```bash
npm publish ./ --tag beta
```

If you published a bugfix as v1.0.7 and need to set v1.1.3 back to latest

```bash
git checkout v1.0.7
npm publish ./

git checkout v1.1.3
npm tag foobar@1.1.3 latest
```

More Info
---

  * http://npmjs.org/doc/json.html
  * http://npmjs.org/doc/developers.html
  * http://blog.izs.me/post/1675072029/10-cool-things-you-probably-didnt-realize-npm-could-do
