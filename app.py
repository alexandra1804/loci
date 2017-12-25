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
    output.append({'id' : id, 'label' : note['label'], 'descr' : note['descr'], 'link' : note['link']})
  jsonify({'result' : output})
  return render_template('list.html', notes=output)

@app.route('/add-default', methods=['GET'])
def add_default():
  notes = mongo.db.notes
  notes.insert({'label': 'About rabbits', 'descr': 'Rabbits are small mammals in the family Leporidae of the order Lagomorpha, found in several parts of the world. There are eight different genera in the family classified as rabbits, including the European rabbit (Oryctolagus cuniculus), cottontail rabbits (genus Sylvilagus; 13 species), and the Amami rabbit (Pentalagus furnessi, an endangered species on Amami Ōshima, Japan). There are many other species of rabbit, and these, along with pikas and hares, make up the order Lagomorpha. The male is called a buck and the female is a doe; a young rabbit is a kitten or kit.', 'link' : 'https://en.wikipedia.org/wiki/Rabbit'})
  notes.insert({'label': 'Material Icons', 'descr': 'Source of icons used in UI deveopment provided by Google.', 'link' : 'https://material.io/icons/'})
  return redirect('/')

@app.route('/edit', methods=['GET'])
def showEdit():
  id = request.args.get('id')
  output = []
  if id:
    notes = mongo.db.notes
    note = notes.find_one({'_id' : ObjectId(id)})
    if note:
      output = {'id' : id, 'label' : note['label'], 'descr' : note['descr'], 'link' : note['link']}
    else:
      output = "No such note"
  jsonify({'result' : output})
  return render_template('edit.html', note=output)

@app.route('/save', methods=['POST'])
def save_note():
  notes = mongo.db.notes
  label = request.form['label']
  descr = request.form['descr']
  link = request.form['link']
  id = request.args.get('id')
  if id:
    notes.update({'_id' : ObjectId(id)}, {'$set': {'label': label, 'descr': descr, 'link' : link}})
  else:
    notes.insert({'label': label, 'descr': descr, 'link' : link})
  return redirect('/')

@app.route('/delete', methods=['GET'])
def deleteNote():
  notes = mongo.db.notes
  id = request.args.get('id')
  notes.remove({'_id': ObjectId(id)})
  return redirect('/')

if __name__ == '__main__':
    app.run(debug=True)