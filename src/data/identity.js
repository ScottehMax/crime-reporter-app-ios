import Realm from 'realm';

class Identity {};
Identity.schema = {
  name: 'Identity',
  primaryKey: 'name',
  properties: {
    name: 'string'
    data: { type: 'string' }
  }
}
