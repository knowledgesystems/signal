const shell = require("shelljs");

shell.cp("-R", "packages/msk-insight-client/build/", "packages/msk-insight-server/dist/reactapp/");
