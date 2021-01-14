const electron = _require('electron');
const fs = _require('fs');
const path = _require('path');
const { dialog, BrowserWindow, nativeImage } = electron.remote;

let calculator = null;
let package = {
	config: {
		isPackage: false,
		letter: null,
		get name() {
			return document.getElementById("ds-name").value;
		}
	},
	previousState: null,
	isSaved: true,
	fileName: null,
	filePath: null,
	fileDirectory: electron.remote.app.getPath("documents"),
	getDefaultFileName() {
		return package.config.name.replace(/[^0-9a-z]+/gi,"-") + ".dsms";
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

// function getNextId() {
// 	return calculator.getState().
// }
// function newExpression(obj) {
	
// }

function getStateFromFilePath(filePath) {
	return JSON.parse(fs.readFileSync(filePath).toString());
}

async function warnSave() {
	const thisWindow = BrowserWindow.getFocusedWindow();
	let result = await dialog.showMessageBox(thisWindow, {
		title: "Warning - Unsaved work",
		buttons: ["Go Back", "Continue"],
		message: "You have unsaved work. Do you want to continue, which will erase unsaved changes?"
	});
	return {willCancel: result == 0};
}

async function openFile() {
	if(!package.isSaved) {
		if((await warnSave()).willCancel) return;
	}
	let result = await dialog.showOpenDialog({ properties: ['openFile'] });
	console.log(result);
	if(result.canceled) return;
	calculator.setState(getStateFromFilePath(result.filePaths[0]));
}

function importPackage() {
	
	
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

function newPackage() {
	
}

function clear() {
	
}

function getSaveState() {
	let state = calculator.getState();
	return JSON.stringify({
		state,
		config: package.config
	});
}

async function _save() {
	package.saveState = getSaveState();
	await fs.writeFile(package.filePath, package.saveState, () => {});
}

async function saveAs(){
	if(package.filePath == null) {
		package.filePath = await path.resolve(package.fileDirectory, package.getDefaultFileName());
	}
	console.log()
	let userChosenPath = await dialog.showSaveDialog({ defaultPath: package.filePath });
	if(!userChosenPath.canceled){
		package.filePath = userChosenPath.filePath;
		package.fileDirectory = path.dirname(package.filePath);
		package.fileName = path.basename(package.filePath);
		await _save();
	} else {
		package.filePath = null;
	}
}

async function save() {
	if(package.filePath == null) await saveAs();
	else await _save();
}

function onload() {
	document.body.addEventListener("keydown", onkeydown);
	
	let elem = document.getElementById("calculator");
	calculator = Desmos.Calculator(elem);
	package.savedState = JSON.stringify(calculator.getState());
}
