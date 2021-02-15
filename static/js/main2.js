$(document).ready(function() {

	function clock() {
		var clock = new Date();

		var hours = clock.getHours();
		var minutes = clock.getMinutes();
		var seconds = clock.getSeconds();

		if (hours < 10) {
			hours = '0' + hours;
		}
		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		if (seconds < 10) {
			seconds = '0' + seconds;
		}

		var clockString = `${hours}:${minutes}:${seconds}`;

		$('#clock')[0].innerHTML=clockString;
	}

	function displayCard(category) {
		if (category != 'all') {
			var url = `http://127.0.0.1:5000/api/barang?category=${category}`;
		} else {
			var url = 'http://127.0.0.1:5000/api/barang';
		}
		$.ajax({
			url: url,
			method: 'GET',
			dataType: 'JSON',
			success: function(data) {
				$('.item-list').empty();
				var cardHTML;
				for (var x of data) {
					cardHTML = `<div class="mb-3"> <div class="card">
							      <div class="card-header">
							        <i class="fas fa-archive mr-2"></i> - ID Barang [ ${x._id} ]
							      </div>
							      <div class="card-body">
							        <table class="table table-hover table-sm table-borderless">
							          <tbody>
							            <tr>
							              <th width="150">Nama Barang</th>
							              <td width="20">:</td>
							              <td> ${x.name} </td>
							            </tr>
							            <tr>
							              <th width="150">Kategori</th>
							              <td width="20">:</td>
							              <td>${x.category}</td>
							            </tr>
							            <tr>
							              <th width="150">Harga Beli</th>
							              <td width="20">:</td>
							              <td>Rp. ${x.buy.toLocaleString()}</td>
							            </tr>
							            <tr>
							              <th width="150">Harga Jual</th>
							              <td width="20">:</td>
							              <td>Rp. ${x.sell.toLocaleString()}</td>
							            </tr>
							            <tr>
							              <th width="150">Diskon</th>
							              <td width="20">:</td>
							              <td>${x.discount}%</td>
							            </tr>
							            <tr>
							              <th width="150">Stok</th>
							              <td width="20">:</td>
							              <td>${x.stock}</td>
							            </tr>
							          </tbody>
							        </table>
							        <button data-value="${x._id}" data-bs-toggle="modal" data-bs-target="#editBarang" type="button" class="edit-barang m-1 btn btn-sm btn-primary"><i class="fas fa-edit"></i></button>
							        <button data-value="${x._id}"type="button" class="hapus-barang m-1 btn btn-sm btn-danger"><i class="fas fa-trash-alt"></i></button>
							      </div>
							    </div></div>`;

	    		$('.item-list').append(cardHTML);
				}
			},
			error: function(data) {
				console.log(data);
			}
		})

		setTimeout(function() {
		$('.hapus-barang').click(function(e) {
			var idBarang = $(this)[0].dataset.value;
			var url = `http://127.0.0.1:5000/api/delete-item?id=${idBarang}`;
			var confirmed = confirm(`Hapus barang dengan ID ${idBarang}?`);
			var $elem = $(this).parent().parent().parent();
			if (confirmed) {
				$.ajax({
					url: url,
					method: 'GET',
					dataType: 'JSON',
					success: function(data) {
						$elem.empty();
						var msg = `<div class="alert alert-success alert-dismissible fade show" role="alert">
	            Barang ${idBarang} berhasil dihapus
	            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>
	          </div>`;
						$('#info').append(msg);
					},
					error: function(data) {
						console.log(data);
					}
				})
			}
			e.stopImmediatePropagation();
		})


		$('.edit-barang').click(function(e) {
			var idBarang = $(this)[0].dataset.value;
			var url = `http://127.0.0.1:5000/api/item?id=${idBarang}`;
			console.log(url);
			e.stopImmediatePropagation();
			$('#edit-barang').empty();
			$.ajax({
				url: url,
				method: 'GET',
				dataType: 'JSON',
				success: function(data) {
					var htmlModal = `<div class="mb-2">
                <label for="id-barang" class="form-label">ID Barang</label>
                <input value="${data._id}" readonly type="number" class="form-control" id="id-barang" name="id-barang" required>
              </div>
              <div class="mb-2"> 
                <label for="nama" class="form-label">Nama Barang</label>
                <input value="${data.name}" type="text" class="form-control" id="nama" name="nama" required>
              </div>
              <div class="mb-2">
                <label for="category" class="form-label">Kategori</label>
                <input value="${data.category}" readonly type="text" class="form-control" id="category" name="category" required>
              </div>

              <div class="mb-2">
                <label for="stock" class="form-label">Stok</label>
                <input value="${data.stock}" type="number" class="form-control" id="stock" name="stock" required>
              </div>
              <div class="mb-2">
                <label for="beli" class="form-label">Harga Beli</label>
                <input value="${data.buy}" type="number" class="form-control" id="beli" name="beli" required>
              </div>
              <div class="mb-2">
                <label for="jual" class="form-label">Harga Jual</label>
                <input value="${data.sell}" type="number" class="form-control" id="jual" name="jual" required>
              </div>
              <div class="mb-2">
                <label for="discount" class="form-label">Diskon Harga</label>
                <input value="${data.discount}" type="number" class="form-control" id="discount" name="discount" required>
              </div>`;

           $('#edit-barang').append(htmlModal)
				},
				error: function(data) {
					console.log(data)
				}
			})
		})
	}, 2000);
	}

	// ==========================================================================================================

	function displayTable(category) {
		if (category != 'all') {
			var url = `http://127.0.0.1:5000/api/barang?category=${category}`;
		} else {
			var url = 'http://127.0.0.1:5000/api/barang';
		}
		$.ajax({
			url: url,
			method: 'GET',
			dataType: 'JSON',
			success: function(data) {
				$('.item-list').empty();
				var cardHTML;
				cardHTML = '<table id="items-table" class="table table-bordered table-sm table-striped table-hover">' +
										'<thead>' +
											'<th class="text-center">#ID Barang</th>' +
											'<th class="text-center">Nama Barang</th>' +
											'<th class="text-center">Kategori</th>' +
											'<th class="text-center">Harga Beli (Rp)</th>' +
											'<th class="text-center">Harga Jual (Rp)</th>' +
											'<th class="text-center">Diskon (%)</th>' +
											'<th class="text-center">Stok</th>' +
										'</thead>' +
										'<tbody>';

				for (var x of data) {
					cardHTML += '<tr>' +
												'<td scope="col">' + x._id + '</td>' +
												'<td scope="col">' + x.name + '</td>' +
												'<td scope="col">' + x.category + '</td>' +
												'<td scope="col" style="text-align: right;">' + x.buy + '</td>' +
												'<td scope="col" style="text-align: right;">' + x.sell + '</td>' +
												'<td scope="col" class="text-center">' + x.discount+ '</td>' +
												'<td scope="col" class="text-center">' + x.stock+ '</td>' +
											'</tr>';
				}
				cardHTML += '</tbody></table>';
	    	$('.item-list').append(cardHTML);
			},
			error: function(data) {
				console.log(data);
			}
		})
	}

	// ==============================================================================================================

	function formToJSON($form) {
		var formArray = $form.serializeArray();
		var formJSON = {};

		$.map(formArray, function(n, i) {
			if (n['value']) {
				formJSON[n['name']] = n['value'];
			}
		})

		return formJSON;
	}

	// =======================================================================================================

	// Initial Section
	$('#alert-tambah').hide();
	displayCard('all');

	setInterval(function(){
		clock();
	},500)

	//

	$('.close-button').click(function(e) {
		$(this).parent().hide();
		e.stopImmediatePropagation();
	})


	$('#tambah').click(function(e){
		var inputs = $(this).parent().parent()[0].querySelectorAll('input');
		var data = formToJSON($('#add-items'));
		var url = 'http://127.0.0.1:5000/api/add-item';

		if (Object.keys(data).length < 7) {
			$('#alert-tambah').show();
		} else {
			$.ajax({
				url: url,
				method: 'POST',
				data: data,
				success: function(data){
					$('#alert-tambah-success').show();
					for (const input of inputs) {
						input.value = "";
					}
				},
				error: function(data){
					console.log(data);
					$('#alert-tambah-failed').show();
				}
			})
		}
		e.preventDefault();
	})


	$('#perbarui').click(function(e){
		var data = formToJSON($('#edit-items'));
		var url = 'http://127.0.0.1:5000/api/edit-item';
		console.log(data);

		$.ajax({
			url: url,
			method: 'POST',
			data: data,
			success: function(data){
				// $('#alert-tambah-success').show();
				var msg = `<div class="alert alert-success alert-dismissible fade show" role="alert">
            Barang berhasil diperbarui
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>
          </div>`;
				$('#edit-barang').append(msg);
			},
			error: function(data){
				var msg = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
            Gagal memperbarui
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>
          </div>`;
				$('#edit-barang').append(msg);
				// $('#alert-tambah-failed').show();
			}
		})
		e.preventDefault();
	})

	// Display handle

	$('#display').change(function(){
		window.tableDisplay = $(this)[0].value;
		$('#category')[0].value = 'all'		

		if (window.tableDisplay == 'table') {
			displayTable('all');
		} else {
			displayCard('all');
		}
	})

	$('#category').change(function(){
		var category = $(this)[0].value;
		if (window.tableDisplay == 'table') {
			displayTable(category);
		} else {
			displayCard(category);
		}
	})

})