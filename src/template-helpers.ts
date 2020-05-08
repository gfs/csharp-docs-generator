
// Models
import { FieldInfo, PropertyInfo, EventInfo, MethodInfo, QuickTypeInfo, ParameterInfo } from "./models/SharpChecker";
import { SidebarView, TemplateApiItems, ParameterNameDescription } from "./models/TemplateApi";
// External functionalities
import { readFile } from "./read-file";
import { createSystemLink, createInternalLink } from "./read-xml";
import * as Templates from "./template";
// External libraries
import ejs = require("ejs");

/**Capitalizes the given string, turning hello-world to Hello World.
 * @param val {string} - The value used to capitalize.
 * @returns Returns the capitalized string*/
export function capitalize(val : string) : string {
	return val.replace(/(?:^|\s|-)\w/g, function(v : string) {
		return v.toUpperCase();
	}).replace(/(\w)\-(\w)/g, "$1 $2");
}

/**Gets the id from the given details.
 * @param details {FieldInfo | PropertyInfo | EventInfo | MethodInfo} - The details to look into.
 * @returns Returns the id used for anchoring and referencing.*/
export function getIdFrom(details : (FieldInfo | PropertyInfo | EventInfo | MethodInfo)) : string {
	if((details as MethodInfo).returnType) {
		// Variables
		const method = details as MethodInfo;
		let parameters : string[] = [];
		
		method.parameters.forEach(function(parameter : ParameterInfo) {
			parameters.push(parameter.typeInfo.unlocalizedName);
		});
		
		return (
			method.name +
			(parameters.length > 0 ? `(${ parameters.join(',') })` : "")
		).replace(/`(\d+)/g, "-$1");
	}
	if((details as PropertyInfo).getSetDeclaration) {
		// Variables
		const property = details as PropertyInfo;
		let parameters : string[] = [];
		
		property.parameters.forEach(function(parameter : ParameterInfo) {
			parameters.push(parameter.typeInfo.unlocalizedName);
		});
		
		return (
			property.name +
			(parameters.length > 0 ? `(${ parameters.join(',') })` : "")
		).replace(/`(\d+)/g, "-$1");
	}
	
	return details.name;
}

/**Creates a partial using the type and location to the template file.
 * @param type {string} - The type to create from (type, field, property, event, method).
 * @param url {string} - The location of the template file to use.
 * @param context {any} - The context used to pass over to the next template.
 * @returns Returns the compiled template code.*/
export function createPartial(type : string, url : string, context : any = {}) : string {
	switch(type) {
		case "type": return Templates.compileType(url, context as string);
		case "field": return Templates.compileField(url, context as FieldInfo);
		case "property": return Templates.compilePropety(url, context as PropertyInfo);
		case "event": return Templates.compileEvent(url, context as EventInfo);
		case "method": return Templates.compileMethod(url, context as MethodInfo);
		case "header": return Templates.compileHeader(url);
		case "footer": return Templates.compileFooter(url);
	}
	
	return ejs.render(readFile(url), context);
}

/**Creates a internal or external link to the given type.
 * @param typePath {string} - The type path to create a link from.
 * @returns Returns an http(s) link to where the type is found.*/
export function createLinkToType(typePath : string) : string {
	return (typePath.startsWith("System") ?
		createSystemLink(typePath.replace(/`/g, '-').replace(/\//g, '.')) :
		createInternalLink(typePath)
	);
}

/**Creates an anchor tag to the type (includes using the type name).
 * @param typeInfo {QuickTypeInfo} - The quick look into the type to look into.
 * @returns Returns an anchor tag to the type with a link.*/
export function createAnchorToType(typeInfo : QuickTypeInfo, classes : string = "") : string {
	// Variables
	const link = createLinkToType(typeInfo.unlocalizedName);
	const classNames = classes != "" ? ` class="${ classes }"` : "";
	
	return `<a href="${ link }"${ classNames }>${ typeInfo.name.replace('<', "&lt;").replace('>', "&gt;") }</a>`;
}

/**Gets the parameter type from the given name.
 * @param parameters {ParameterInfo[]} - The list of parameters to look into.
 * @param name {string} - The name of the parameter to look into.
 * @returns Returns the type info of the parameter.*/
export function getParameterType(parameters : ParameterInfo[], name : string) : QuickTypeInfo {
	for(let i = 0; i < parameters.length; i++) {
		if(parameters[i].name == name) {
			return parameters[i].typeInfo;
		}
	}
	
	return {
		name: "",
		unlocalizedName: "",
		fullName: "",
		namespaceName: "",
		genericParameters: [],
		nonInstancedFullName: ""
	};
}

/**Generates the html code for the sidebar tree view.
 * @returns Returns the html code for the sidebar tree view*/
export function generateSidebar(
	treeview : (SidebarView | SidebarView[]),
	treeviewClass : string = "treeview",
	nestedviewClass : string = "nested"
) : string {
	if(treeview instanceof SidebarView && treeview.name == "$~root") {
		return (
			`<ul class="${ treeviewClass }">` +
			`${ generateSidebar(treeview.children, treeviewClass, nestedviewClass) }</ul>`
		);
	}
	
	// Variables
	const views = treeview as SidebarView[];
	let results = [];
	
	for(let i = 0; i < views.length; i++) {
		results.push(views[i].name.replace(/</g, "&lt;").replace(/>/g, "&gt;"));
		
		if(views[i].link != "") {
			results[i] = `<a href="${ views[i].link }">${ results[i] }</a>`;
		}
		
		if(views[i].children.length > 0) {
			results[i] = `<span class="caret">${ results[i] }</span>`;
			results[i] += (
				`<ul class="${ nestedviewClass }">` +
				`${ generateSidebar(views[i].children, treeviewClass, nestedviewClass) }</ul>`
			)
		}
		else {
			results[i] = `<span class="end-caret">${ results[i] }</span>`;
		}
		
		results[i] = `<li>${ results[i] }</li>`;
	}
	
	return results.join("");
}

/**Finds if the given parameter's type is a generic type.
 * @param parameter {ParameterNameDescription} - The parameter to look into.
 * @param xmlDocs {TemplateApiItems} - The api docs to look into.
 * @returns Returns true if the parameter's type is generic.*/
export function isGenericType(parameter : ParameterNameDescription, xmlDocs : TemplateApiItems) : boolean {
	if(!xmlDocs.typeParameters.exists) { return false; }
	
	// Variables
	let paramTypeName = parameter.details?.typeInfo.unlocalizedName;
	
	for(let i = 0; i < xmlDocs.typeParameters.value.length; i++) {
		// Variables
		const value = xmlDocs.typeParameters.value[i];
		
		if(paramTypeName == value.details?.unlocalizedName) {
			return true;
		}
	}
	
	return false;
}
