const fs = require('fs');
const path = require('path');
const datafire = require('datafire');
const DESTINATION = __dirname + '/../integrations/generated';

const TYPES = ['rss', 'openapi', 'raml', 'wadl', 'api_blueprint'];

module.exports = (args, callback=()=>{}) => {
  args.name = args.name.toLowerCase().replace(/\W+/g, '_');
  args.destination = DESTINATION;
  let type = TYPES.filter(t => args[t])[0];
  datafire.commands.integrate(args).then(spec => {
    let pkg = JSON.parse(JSON.stringify(require('../package-template.json')))
    let packageFile = path.join(args.destination, args.name, 'package.json');
    pkg.name = '@datafire/' + args.name;
    pkg.description = "DataFire integration for " + (spec.info.title || args.name);
    pkg.datafire = pkg.datafire || {};
    pkg.datafire.origin = args[type];
    pkg.datafire.type = type;
    fs.writeFileSync(packageFile, JSON.stringify(pkg, null, 2));
    callback();
  })
}

if (require.main === module) {
  let args = require('yargs').argv;
  module.exports(args);
}
