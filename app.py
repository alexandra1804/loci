from flask import Flask,render_template,flash,redirect,request,jsonify
from bson import ObjectId
from flask_pymongo import PyMongo

app = Flask(__name__)

# User needs to have Mondo database called 'memodb'
# TODO: add scripts for clean start and migration

app.config['MONGO_DBNAME'] = 'memodb'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/memodb'

mongo = PyMongo(app)

@app.route('/', methods=['GET'])
def showList():
  notes = mongo.db.notes
  output = []
  for note in notes.find():
    id = str(note['_id'])
    output.append({'id' : id, 'label' : note['label'], 'descr' : note['descr']})
  jsonify({'result' : output})
  return render_template('list.html', notes=output)

@app.route('/edit', methods=['GET'])
def showEdit():
  id = request.args.get('id')
  output = []
  if id:
    oid = ObjectId(id)
    notes = mongo.db.notes
    note = notes.find_one({'_id' : ObjectId(id)})
    if note:
      output = {'label' : note['label'], 'descr' : note['descr']}
    else:
      output = "No such note"
  jsonify({'result' : output})
  return render_template('edit.html', note=output)

# @app.route('/edit', methods=['POST'])
# def add_note():
#   notes = mongo.db.notes
#   label = request.json['label']
#   descr = request.json['descr']
#   note_id = notes.insert({'label': label, 'descr': descr})
#   new_note = notes.find_one({'_id': note_id })
#   output = {'label' : new_star['label'], 'descr' : new_star['descr']}
#   jsonify({'result' : output})
#   showList()

@app.route('/add', methods=['POST'])
def add_note():
    notes = mongo.db.notes
    label = request.form['label']
    descr = request.form['descr']
    notes.insert({'label': label, 'descr': descr})
    return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)