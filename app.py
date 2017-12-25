from flask import Flask,render_template
from flask import jsonify
from flask import request
from flask_pymongo import PyMongo

app = Flask(__name__)

app.config['MONGO_DBNAME'] = 'memodb'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/memodb'

mongo = PyMongo(app)

def renderEditPage(note):
	return render_template('edit.html', note)

@app.route('/', methods=['GET'])
def showList():
  notes = mongo.db.notes
  output = []
  for note in notes.find():
	  output.append({'label' : note['label'], 'descr' : note['descr']})
  jsonify({'result' : output})
  return render_template('list.html', notes=output)

@app.route('/edit', methods=['GET'])
def showEdit(label):
  notes = mongo.db.notes
  note = notes.find_one({'label' : label})
  if note:
    output = {'label' : note['label'], 'descr' : note['descr']}
  else:
    output = "No such note"
  jsonify({'result' : output})
  return renderEditPage(note=output)

@app.route('/edit', methods=['POST'])
def add_note():
  notes = mongo.db.notes
  label = request.json['label']
  descr = request.json['descr']
  note_id = notes.insert({'label': label, 'descr': descr})
  new_note = notes.find_one({'_id': note_id })
  output = {'label' : new_star['label'], 'descr' : new_star['descr']}
  jsonify({'result' : output})
  showList()

if __name__ == '__main__':
    app.run(debug=True)