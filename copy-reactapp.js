const shell = require("shelljs");

shell.cp("-R", "client/build/", "server/dist/reactapp/");
