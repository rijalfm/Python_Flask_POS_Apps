$(document).ready(function() {

	function choices(array, k=1) {
    var result = '';
    for (var i = 0; i < k; i++) {
      var idx = Math.floor(Math.random() * array.length);
      result += array[idx]
    }
    return result 
	}

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

	function totalPrice(items) {
		var total = 0;
		var keys = Object.keys(items);
		for (const ids of keys) {
			total += items[ids].total;
		}

		return total;
	}

	function totalDiscount(items) {
		var total = 0;
		var keys = Object.keys(items);
		for (const ids of keys) {
			total += items[ids].discount;
		}

		return total;
	}

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


	var string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

	var transactionId = choices(string,16);
	$('#transaction-number')[0].innerHTML = transactionId;


	setInterval(function(){
		clock();
	},500)
	var search = document.getElementById('search');
	var res = document.getElementById('search-result');

	$('#form-search').submit(function(e) {
		e.preventDefault();
	})

	search.addEventListener('input', function(){
		
		res.style.visibility = 'visible';
		var _id = this.value;
		var url = 'http://127.0.0.1:5000/api/search?id=' + _id;
		$.ajax({
			url: url,
			method: 'GET',
			dataType: 'JSON',
			success: function(data) {
				$('.list-group').empty();
				for (var x of data) {
					var listHtml = '<a href="http://127.0.0.1:5000/api/item?id=' + x._id 
					+ '" class="list-group-item list-group-item-action list-group-item-light">['
					+ x._id + '] ' + x.name + ' - <strong>Rp. ' + x.sell.toLocaleString() + '</strong></a>';

					$('.list-group').append(listHtml);

					$('.list-group-item-action').click(function(e) {
						var url = $(this)[0].href;
						e.stopImmediatePropagation();
						e.preventDefault();
						res.style.visibility = 'hidden';
						search.value = '';

						$.ajax({
							url: url,
							method: 'GET',
							dataType: 'JSON',
							success: function(data) {

								$('#id-barang')[0].value = data._id;
								$('#nama')[0].value = data.name;
								$('#jual')[0].value = data.sell;
								$('#discount')[0].value = data.discount;
								$('#stock')[0].value = data.stock;
								$('#jumlah')[0].value = 1;
							}
						})
					})
				}
			},
			error: function(data) {
				$('.list-group').empty();
				$('.list-group').append('<p class="text-center pt-3">Tidak ada barang</p>');
			}
		});
	})

	search.addEventListener('blur', function(){
		if (!search.value) {
			res.style.visibility = 'hidden';
		} else {
			window.addEventListener('click', function(e) {
				for (const select of document.querySelectorAll('#search-result')) {
					if (!select.contains(e.target) && !search.contains(e.target)) {
						res.style.visibility = 'hidden';
						search.value = '';
					}
				}
			})
		}
	})

	var ids = [];
	var cart = {};

	$('#tambahKeranjang').click(function(e) {
		var item = formToJSON($('#item'));
		var price = Number(item.jual);
		var stock = Number(item.stock);
		var discount = Number(item.discount)*price/100;
		var total = 0;
		var itemHTML = '';

		if (Object.keys(item).length > 0 && stock > 0) {
			if (ids.includes(item['id-barang'])) {
				cart[item['id-barang']].count += Number(item.jumlah);
				
				if (cart[item['id-barang']].count > stock) {
					cart[item['id-barang']].count = stock;
				}

				cart[item['id-barang']].discount = discount*cart[item['id-barang']].count;
				total = (price - discount) * cart[item['id-barang']].count;
				cart[item['id-barang']].total = total;
				itemHTML = `<td scope="col">${item['id-barang']}</td>
												<td scope="col">${cart[item['id-barang']].name}</td>
												<td scope="col" style="text-align: right;">${cart[item['id-barang']].price}</td>
												<td scope="col" style="text-align: right;">${cart[item['id-barang']].count}</td>
												<td scope="col" style="text-align: right;">${cart[item['id-barang']].discount}</td>
												<td scope="col" style="text-align: right;">${cart[item['id-barang']].total}</td>`;

				$(`#${item['id-barang']}`).empty();
				$(`#${item['id-barang']}`).append(itemHTML);
				$('#total-price')[0].innerHTML = totalPrice(cart).toLocaleString();
				
			} else {
				ids.push(item['id-barang']);
				var count = Number(item.jumlah);

				if (count > stock) {
					count = stock;
				}

				total = (price - discount)*count;

				cart[item['id-barang']] = {name: item.nama, price: price, discount: discount*Number(item.jumlah), count: count, total: total, stock: Number(item.stock)};
				itemHTML = `<tr id="${item['id-barang']}">
												<td scope="col">${item['id-barang']}</td>
												<td scope="col">${cart[item['id-barang']].name}</td>
												<td scope="col" style="text-align: right;">${cart[item['id-barang']].price}</td>
												<td scope="col" style="text-align: right;">${cart[item['id-barang']].count}</td>
												<td scope="col" style="text-align: right;">${cart[item['id-barang']].discount}</td>
												<td scope="col" style="text-align: right;">${cart[item['id-barang']].total}</td>
											</tr>`;

				$('#cart').append(itemHTML);
				$('#total-price')[0].innerHTML = totalPrice(cart).toLocaleString();
			}
		}
		e.preventDefault();
		$('#total-bayar')[0].value = totalPrice(cart).toLocaleString();
	})

	$('#tunai').on("input", function(){
		var price = totalPrice(cart);
		$('#charge')[0].value = (Number($(this)[0].value) - price).toLocaleString();
	})


	$('#bayar').click(function() {
		if (Object.keys(cart).length > 0 && Number($('#charge')[0].value) >= 0) {
			var date = new Date();
			var data = {ID: transactionId, items: cart, date: date.toLocaleString(), total: totalPrice(cart)};
			var url = 'http://127.0.0.1:5000/api/transaction';
			$.ajax({
				url: url,
				method: 'POST',
				data: JSON.stringify({Data: data}),
				contentType: 'application/json; charset=utf-8',
				dataType: 'JSON',
				success: function(x) {
					console.log("Success");
				},
				error: function(x) {
					
				}
			})
			
			$(this).hide();
			$('#close-confirm').parent().show();
		}
	})



})