var electron = _require('electron');
var fs = _require('fs');
var path = _require('path');



let calculator = null;
let package = {
	appendPackagesToFront: false,
	isPackage: false,
	letter: null,
	fileName: null,
	filePath: null,
	fileDirectory: electron.remote.app.getPath("documents"),
	getPackageName() {
		return document.getElementById("ds-name").value
	},
	getDefaultFileName() {
		return package.getPackageName().replace(/[^0-9a-z]+/gi,"-") + ".dsms";
	}
};

function onkeydown(evt) {
	if(evt.ctrlKey && !evt.shiftKey && !evt.altKey) {
		if(evt.key == "s") save();
		if(evt.key == "o") openFile();
		if(evt.key == "i") importPackage();
		if(evt.key == "n") newPackage();
	}
}

function createFolder(title, obj) {
	let state = calculator.getState();
	let exps = state.expressions.list;
	let id = (+exps[exps.length - 1].id + 1).toString();
	exps.push(Object.assign({
		id,
		title,
		type: "folder",
		memberIds: {},
		hidden: true,
		collapsed: true,
		secret: false,
	}, obj));
	calculator.setState(state);
}

// function moveExpression()

// function getNextId() {
// 	return calculator.getState().
// }
// function newExpression(obj) {
	
// }


function openFile() {
	
}

function importPackage() {
	
}

function newPackage() {
	
}

function clear() {
	
}

async function _save() {
	await fs.writeFile(package.filePath, calculator.getOutput(), () => {});
}

async function save() {
	if(!calculator.fileName) await saveAs();
	else await _save();
}


function onload() {
	document.body.addEventListener("keydown", onkeydown);
	
	let elem = document.getElementById("calculator");
	calculator = Desmos.Calculator(elem);
	calculator.createFolder = name => {
		
	};
}



async function saveAs(){
	if(package.filePath == null) {
		package.filePath = await path.resolve(package.fileDirectory, package.getDefaultFileName());
	}
	var userChosenPath = await electron.remote.dialog.showSaveDialog({ defaultPath: package.fileDirectory });
	if(userChosenPath){
		package.filePath = userChosenPath.filePath;
		package.fileDirectory = path.dirname(package.filePath);
		package.fileName = path.basename(package.filePath);
		await _save();
	}
}
