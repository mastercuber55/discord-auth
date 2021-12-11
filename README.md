# discord-auth
## Note
You Must Install Package With
```sh
npm i BrinePlayz/discord-auth
```
## Example
```js
const express = require('express')
const app = express()
const auth = require('discord-auth')
const urls = {
  login:"/login",
  logout: "/logout",
  callback: "/callback",
  domain: "https://your-host.com"
}
const client = {
  id: 'Your Discord Application Id',
  secret: 'Your Client Auth Secret',
  scopes:['fill','this','array','with','scopes','you','want']
}
auth.setup(app,urls,client)
app.get('/', (res, req, next) => {
  auth.checkAuth(req,res,next,urls.login)
  res.json(req.user)// This Line Will Only Work While User Have Logged In So We Will Make User Login If He Have Not Yet.
})
app.listen(8000)//Do Not Provide 80
```
## Need Help?
### Free Feel To Join Our Discord Server 
### [Join](https://discord.gg/P3Mp2cJmgs)
