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