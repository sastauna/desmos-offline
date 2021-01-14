const electron = _require('electron');
const fs = _require('fs');
const path = _require('path');
const { dialog, BrowserWindow, nativeImage } = electron.remote;

let calculator = null;
let module = {
	config: {
		isModule: false,
		moduleLetter: null,
		get name() {
			return document.getElementById("ds-name").value;
		}
	},
	saveState: null,
	isSaved() {
		return module.saveState == getSaveState();
	},
	fileName: null,
	filePath: null,
	fileDirectory: electron.remote.app.getPath("documents"),
	getDefaultFileName() {
		return module.config.name.replace(/[^0-9a-z]+/gi,"-") + ".dsms";
	},
	setName(name) {
		document.getElementById("ds-name").value = name;
	}
};

function onkeydown(evt) {
	if(evt.ctrlKey && !evt.shiftKey && !evt.altKey) {
		if(evt.key == "s") save();
		if(evt.key == "o") openFile();
		if(evt.key == "i") importModule();
		if(evt.key == "n") newModule();
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

function getSaveObjFromFilePath(filePath) {
	return JSON.parse(fs.readFileSync(filePath).toString());
}

async function warnSave() {
	let willCancel = false;
	if(!module.isSaved()) {
		const thisWindow = BrowserWindow.getFocusedWindow();
		let result = await dialog.showMessageBox(thisWindow, {
			title: "Warning - Unsaved work",
			buttons: ["Go Back", "Continue"],
			message: "You have unsaved work. Do you want to continue, which will erase unsaved changes?"
		});
		console.log(result);
		willCancel = result == 0;
	}
	return { willCancel };
}

async function openFile() {
	if(!module.isSaved) {
		if((await warnSave()).willCancel) return;
	}
	let result = await dialog.showOpenDialog({ properties: ['openFile'] });
	console.log(result);
	if(result.canceled) return;
	let saveObj = getSaveObjFromFilePath(result.filePaths[0]);
	let config = saveObj.config;
	module.setName(config.name);
	setIsModule(config.isModule);
	if(config.isModule) {
		declareModule(config.moduleLetter)
	}
	calculator.setState(saveObj.state);
}

function importModule() {
	
	
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

function declareModule(moduleLetter) {
	module.config.isModule = true;
	module.config.moduleLetter = moduleLetter;
}

function setIsModule(isModule) {
	document.getElementById("ds-is-module").checked = isModule;
	module.config.isModule = isModule;
	document.getElementById("ds-module-letter-container").hidden = !isModule;
	document.getElementById("ds-project-or-module").innerHTML = isModule ? "Module" : "Project";
}

function getSaveState() {
	let state = calculator.getState();
	let saveObj = {
		state,
		config: module.config
	};
	return JSON.stringify(saveObj);
}

async function _save() {
	module.saveState = getSaveState();
	await fs.writeFile(module.filePath, module.saveState, () => {});
}

async function saveAs(){
	if(module.filePath == null) {
		module.filePath = await path.resolve(module.fileDirectory, module.getDefaultFileName());
	}
	console.log()
	let userChosenPath = await dialog.showSaveDialog({ defaultPath: module.filePath });
	if(!userChosenPath.canceled){
		module.filePath = userChosenPath.filePath;
		module.fileDirectory = path.dirname(module.filePath);
		module.fileName = path.basename(module.filePath);
		await _save();
	} else {
		module.filePath = null;
	}
}

async function save() {
	if(module.filePath == null) await saveAs();
	else await _save();
}

function onload() {
	document.body.addEventListener("keydown", onkeydown);
	let elem = document.getElementById("calculator");
	elem.innerHTML = "";
	calculator = Desmos.Calculator(elem);
	module.saveState = JSON.stringify(getSaveState());
}
