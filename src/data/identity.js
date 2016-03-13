import Realm from 'realm';

class Identity {};
Identity.schema = {
  name: 'Identity',
  primaryKey: 'name',
  properties: {
    name: 'string',
    data: 'string'
  }
};

const db = new Realm({ schema: [ Identity ] });

export default db;
