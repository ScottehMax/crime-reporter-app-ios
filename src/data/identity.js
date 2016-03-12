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

export default class IdentityManager {

  static db = new Realm({ schema: [ Identity ] });

  static write = (name, data, db_) => {
    let objs = db_.objects('Identity').filtered(`name = "${name}"`);
    let result;
    if (objs.length > 0) {
      objs[0]['data'] = data
      result = objs[0]
    } else {
      db_.write(() => {
        result = db_.create('Identity', {
          name: name,
          data: data
        })
      })
    }
    return result;
  };

  static retrieve = (name, db_) => {
    let objs = db_.objects('Identity').filtered(`name = "${name}"`);
    let result = null;
    if (objs.length > 0) {
      result = objs[0]
    }
    return result;
  };

  static delete = (name, db_) => {
    let objs = db_.objects('Identity').filtered(`name = "${name}"`);
    if (objs.length < 1) return
    db_.write(() => {
      db_.delete(objs);
    })
  };

};
