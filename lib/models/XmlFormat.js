"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.XmlFormat = void 0;
class XmlFormat {
    constructor() {
        this.type = "";
        this.summary = "<p>No description.</p>";
        this.returns = "";
        this.remarks = "";
        this.example = "";
        this.parameters = [];
        this.exceptions = [];
        this.typeParameters = [];
    }
    setTextContent(parameter, content) {
        switch (parameter) {
            case "summary":
                this.summary = content;
                break;
            case "returns":
                this.returns = content;
                break;
            case "remarks":
                this.remarks = content;
                break;
            case "example":
                this.example = content;
                break;
        }
    }
}
exports.XmlFormat = XmlFormat;
