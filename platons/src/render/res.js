import { objLoader } from "../prim/objloader.js";

class _resources {
    static setup(gl, completeHandler) {
        _resources.gl = gl;
        _resources.onComplete = completeHandler;

        return this;
    }

    static start(usePromise) {
        if (_resources.Queue.length > 0)
            if (usePromise == true)
                return new Promise(function (resolve, reject) {
                    _resources.PromiseResolve = resolve;
                    _resources.PromiseReject = reject;
                    _resources.loadNextItem();
                });
            else _resources.loadNextItem();

        return null;
    }

    static loadTexture(name, src) {
        for (let i = 0; i < arguments.length; i += 2) {
            _resources.Queue.push({
                type: "img",
                name: arguments[i],
                src: arguments[i + 1]
            });
        }
        
        return this;
    }
    static loadVideoTexture(name, src) {
        for (let i = 0; i < arguments.length; i += 2) {
            _resources.Queue.push({
                type: "vid",
                name: arguments[i],
                src: arguments[i + 1]
            });
        }
        
        return this;
    }
    static loadObj(name, src) {
        for (let i = 0; i < arguments.length; i += 2) {
            _resources.Queue.push({
                type: "obj",
                name: arguments[i],
                src: arguments[i + 1]
            });
        }

        return this;
    }

    static loadNextItem() {
        if (_resources.Queue.length == 0) {
            if (_resources.PromiseResolve) _resources.PromiseResolve();
            else if (_resources.onComplete != null) _resources.onComplete();
            else console.log("Resource Download Queue Complete");
            return;
        }

        let itm = _resources.Queue.pop();
        switch (itm.type) {
            case "obj":
                let req = new XMLHttpRequest();
                req.fObjName = itm.name;
                req.open("GET", itm.src);
                req.onreadystatechange = _resources.onDownloadXHR;
                req.send();
                break;
            case "img":
                let img = new Image();
                img.queueData = itm;
                img.onload = _resources.onDownloadSuccess;
                img.onabort = img.onerror = _resources.onDownloadError;
                img.src = itm.src;
                break;
            case "vid":
                let vid = document.createElement("video");
                vid.style.display = "none";
                document.body.appendChild(vid);

                vid.queueData = itm;
                vid.addEventListener("loadeddata", _resources.onDownloadSuccess, false);
                vid.onabort = vid.onerror = _resources.onDownloadError;
                vid.autoplay = true;
                vid.loop = true;
                vid.src = itm.src;
                vid.load();
                vid.play();

                _resources.Videos[itm.name] = vid;
                break;
        }
    }

    static onDownloadXHR() {
        if (this.readyState === XMLHttpRequest.DONE) {
            let d = objLoader.parseObjText(this.responseText, false);
            let mesh = gl.сreateMeshVAO(this.fObjName, d[0], d[1], d[2], d[3], 3);

            _resources.loadNextItem();
        }
    }

    static onDownloadSuccess() {
        if (this instanceof Image || this.tagName == "VIDEO") {
            let dat = this.queueData;
            _resources.gl.LoadTexture(dat.name, this);
        }
        _resources.loadNextItem();
    }

    static onDownloadError() {
        console.log("Error getting ", this);
        _resources.loadNextItem();
    }
}

_resources.Queue = [];
_resources.onComplete = null;
_resources.gl = null;
_resources.PromiseResolve = null;
_resources.PromiseReject = null;

_resources.Images = [];
_resources.Videos = [];

export function resources(...arg) {
    return new _resources(...arg);
}