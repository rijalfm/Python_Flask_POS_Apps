from flask import render_template
from flask import Flask, request, jsonify
import os
from api.models import data_barang, Transaction, History

class Config(object):
	SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'

category = data_barang().Category()
app = Flask(__name__)

@app.route('/', methods=['GET','POST'])
def index():
	return render_template('index.html', datas=category)

@app.route('/tambah-barang', methods=['GET','POST'])
def tambah_barang():
	return render_template('add_items.html', datas=category)

@app.route('/data-barang', methods=['GET','POST'])
def data_barang1():
	return render_template('items.html',  datas=category)

@app.route('/riwayat-penjualan', methods=['GET','POST'])
def riwayat_penjualan():
	if request.args.get('id'):
		_id = request.args.get('id')
		data = History().transaction(_id=_id)
		print(data)
		return render_template('history.html', item = data)
	
	data = History().transaction()
	return render_template('history.html', datas = data)

@app.route('/grafik-penjualan', methods=['GET','POST'])
def grafik_penjualan():
	return render_template('graph.html')

# API Routes
@app.route('/api/barang')
def barang():
	if request.args:
		return data_barang().Barang(request.args)
	else:
		return data_barang().Barang(None)

@app.route('/api/add-item', methods=['GET','POST'])
def add_item():
	if request.form:
		return data_barang().AddItem(request.form)
	else:
		return data_barang().AddItem(None)

@app.route('/api/edit-item', methods=['GET','POST'])
def edit_item():
	if request.form:
		return data_barang().EditItem(request.form)
	else:
		return data_barang().EditItem(None)

@app.route('/api/delete-item', methods=['GET'])
def delete_item():
	if request.args:
		_id = request.args.get('id')
		return data_barang().DeleteItem(_id)
	else:
		return data_barang().DeleteItem(_id=None)

@app.route('/api/search', methods=['GET'])
def search():
	if request.args:
		_id = request.args.get('id')
		return data_barang().Cari(_id)
	else:
		return data_barang().Cari(_id=None)

@app.route('/api/item', methods=['GET'])
def item():
	if request.args:
		_id = request.args.get('id')
		return data_barang().Item(_id)
	else:
		return data_barang().Item(_id=None)



@app.route('/api/summary')
def summary():
	return History().summary()

@app.route('/api/transaction', methods=['POST'])
def transaction():
	Transaction(request.get_json())
	return "Transaction success"

if __name__ == '__main__':
	app.run(debug = True)