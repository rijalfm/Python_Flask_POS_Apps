from flask import Flask, jsonify
from datetime import datetime
from pymongo import MongoClient

my_client = MongoClient('mongodb://127.0.0.1:27017')
db = my_client['pos_db']
coll = db['db_barang']
category = db['category']
transaction_db = db['transaction']

class Transaction:

	def __init__(self,Data):
		data = Data['Data']
		self.transaction_id = data['ID']
		self.date = datetime.strptime(data['date'], "%d/%m/%Y %H.%M.%S")
		self.items = data['items']
		self.total = data['total']
		self.data = {'_id': self.transaction_id,
								'date': self.date,
								'total': self.total,
								'item_count': len(self.items),
								'items': self.items}
		
		transaction_db.insert_one(self.data)
		self.update_db()

		print(self.data, '\nSaved to database')

	def update_db(self):
		for item_id in self.items.keys():
			item = self.items[item_id]
			last_stock = item['stock']
			count = item['count']
			new_stock = last_stock - count

			coll.update_one({'_id': item_id}, {'$set': {'stock': new_stock}})


class History:
	def transaction(self, since=None, until=None, _id=None):
		if _id:
			transaction_history = transaction_db.find_one({'_id': _id})
		
		else:
			transaction_history = transaction_db.find({}).sort('date', -1)
			transaction_history = [x for x in transaction_history]

		return transaction_history


	def summary(self):
		test = transaction_db.aggregate([{ "$project": {
								"y": {"$year":"$date"},
								"m": {"$month":"$date"},
								"d": {"$dayOfMonth":"$date"},
								"total": "$total"}
							},
							{ "$group": {
								"_id": {"year":"$y","month":"$m","day":"$d"},
								"total": {"$sum": "$total"}
							}},
							{ "$sort": {"_id": 1}}
						])

		dataset = {}
		for x in test:
			dt = x['_id']
			dt = f'{dt["year"]}-{dt["month"]}-{dt["day"]}'
			# dt = datetime.strptime(dt, "%d-%m-%Y")

			dataset[dt] = x['total']

		return jsonify(dataset), 200



class data_barang:

	def Category(self):
		return [x['category'] for x in category.find({}).sort('category', 1)]

	def Cari(self, _id):
		if _id:
			db_barang = coll.find({'_id': {'$regex': f'.*{_id}.*'}})
			db_barang = [x for x in db_barang]
			if len(db_barang)>0:
				return jsonify(db_barang), 200
			else:
				err = {'error': 'Tidak ada barang'}
				return jsonify(err), 404

		else:
			err = {'error': 'Tidak ada barang'}
			return jsonify(err), 404

	def Item(self, _id):
		if _id:
			db_barang = coll.find_one({'_id': {'$regex': f'.*{_id}.*'}})
			if db_barang:
				return jsonify(db_barang), 200
			else:
				err = {'error': 'Tidak ada barang'}
				return jsonify(err), 404

		else:
			err = {'error': 'Tidak ada barang'}
			return jsonify(err), 404

	def Barang(self,data):
		if data:
			filter_by = data.get('category')
			filtered = coll.find({'category': filter_by})
			filtered = [x for x in filtered]
			return jsonify(filtered), 200

		else:
			barang = coll.find({}).sort('_id', 1)
			barang = [x for x in barang]
			return jsonify(barang), 200


	def AddItem(self,dataForm):
		if dataForm:
			_id = dataForm['id-barang']
			name = dataForm['nama']
			category = dataForm['category']
			stock = int(dataForm['stock'])
			buy = int(dataForm['beli'])
			sell = int(dataForm['jual'])
			discount = int(dataForm['discount'])

			db_add_item = {
				'_id': _id,
				'name': name,
				'stock': stock,
				'buy': buy,
				'sell': sell,
				'discount': discount,
				'category': category
			}

			if coll.find_one({'_id': _id}):
				err = {'error': 'ID barang telah tersedia'}
				return jsonify(err), 404
			else:
				coll.insert_one(db_add_item)
				return jsonify({'success': f'{_id} berhasil ditambahkan'}), 201

		return jsonify({'error':'Tidak ada data yang dimasukkan!'}), 400

	def EditItem(self,dataForm):
		if dataForm:
			_id = dataForm['id-barang']
			name = dataForm['nama']
			category = dataForm['category']
			stock = int(dataForm['stock'])
			buy = int(dataForm['beli'])
			sell = int(dataForm['jual'])
			discount = int(dataForm['discount'])

			db_add_item = {
				'_id': _id,
				'name': name,
				'stock': stock,
				'buy': buy,
				'sell': sell,
				'discount': discount,
				'category': category
			}
			
			coll.update_one({'_id': _id}, {'$set': db_add_item})
			return jsonify({'success': f'{_id} berhasil diperbarui'}), 201

		return jsonify({'error':'Tidak ada data yang dimasukkan!'}), 400

	def DeleteItem(self, _id):
		if _id:
			coll.delete_one({'_id': _id})
			return jsonify({'success': 'Berhasil menghapus barang'}), 201
		else:
			err = {'error': 'Tidak ada barang'}
			return jsonify(err), 404