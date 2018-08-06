function send_images(){
	//alert("sendImages");
	var images = document.getElementById("images");
	var processed = [];
	for (i=0;i<images.childElementCount;i++){
		params = {
			'InvNr'	: parseInt(document.getElementById("invnr").value),
			'SrNr'	: document.getElementById("srnr").value,
			'Info'	: document.getElementById("info").value,
			'Image'	: images.children[i].src,
			'id'	: images.children[i].id
		}
		callAjax(params);
	}
	document.getElementById("invnr").value = 0;
	document.getElementById("srnr").value = "";
	document.getElementById("info").value = "";
	document.getElementById("cameraInput").value = "";
	
}

function callAjax(params) {
	var r = new XMLHttpRequest();
	r.open("POST", "/", true);
	r.setRequestHeader("Content-Type","application/json; charset=utf-8");
	r.onreadystatechange = function () {
		if (r.readyState==4 && r.status==200) {
			data = JSON.parse(r.responseText);
			if (data.error == 0) {
				//console.log("image " + params.id + " Send");
				document.getElementById(params.id).remove();
			}
		return
		};
	};
	r.send(JSON.stringify(params));
}


function ImageSelected(evt){
	var tgt = evt.target || window.event.srcElement,
        files = tgt.files;
	console.log(files);

    	// FileReader support
    	if (FileReader && files && files.length) {
        	var fr = new FileReader();
        	fr.onload = function () {
		appendImage(fr.result);
        }
        fr.readAsDataURL(files[0]);
    }

    // Not supported
    else {
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }
}

function appendImage(imgsrc) {
	elem = document.createElement("img");
	elem.setAttribute("src", imgsrc);
	elem.setAttribute("id", generateID());
	var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	elem.setAttribute("width", width / 3);
	document.getElementById("images").appendChild(elem);
}

function generateID() {
	return '_' + Math.random().toString(36).substr(2, 9);
}

function decodeBarcode(img, callback) {
	Quagga.decodeSingle({
		decoder: {
			readers: [
				"code_128_reader",
				"ean_reader",
				"ean_8_reader",
				"code_39_reader",
				"code_39_vin_reader",
				"codabar_reader",
				"upc_reader",
				"upc_e_reader",
				"i2of5_reader",
				"2of5_reader",
				"code_93_reader"
			],
			multiple: false
		},
		locate: true,
		locator: {
			patchSize: "medium",
			halfSample: true
		},
		numOfWorkers: 2,
		frequency: 10,
		src: img
	}, callback)
}

function InvSelected(e) {
	var tgt = e.target || window.event.srcElement;
	files = tgt.files;
	if (files && files.length) {
		decodeBarcode(URL.createObjectURL(files[0]),function(result){
			rawinvnr = result.codeResult.code;
			var numb = rawinvnr.match(/\d/g);
			numb = numb.join("");
			document.getElementById('invnr').value = numb;
		});
	}
	document.getElementById('cameraInv').value = "";
}

function SrSelected(e) {
	var tgt = e.target || window.event.srcElement;
	files = tgt.files;
	if (files && files.length) {
		decodeBarcode(URL.createObjectURL(files[0]),function(result){
			document.getElementById('srnr').value = result.codeResult.code;
		});
	}
	document.getElementById('cameraSr').value = "";
}
