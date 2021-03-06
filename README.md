
# C# Documentation Generator

This action generates a static html documentation for C# projects. It will create documentation within the repository and commit it once it's finished generating.

**NOTE: This project will delete the folder listed under the `output-path` input. This is to delete old API content that no longer exists, but make sure to change the `output-path` variable is changed to an directory that won't delete files unnecessarily!**

## Table of Contents

* [Inputs](#inputs)
* [Sample Build XML](#sample-build-yaml)
* [Formats](#formats)
* [Using Templates](#using-templates)
* [Customizing the Template](#customizing-the-template)
* [Creating Your Own Templates](#creating-your-own-templates)
* [License](#license)

## Inputs

**`binaries` as (string[]):** The list of binaries used to look into, must be named the same as the xml documentation. The list is separated by commas. **(Required)**

**`branch-name` as (string):** The name of the branch that the generation will commit to (if not specified it will commit to the current branch).

**`build-tasks` as (string[]):** The list of commands used to build the project prior to generating html documents. The list is separated by commas. **(Required)**

**`cleanup-tasks` as (string[]):** The list of commands used to clean up any building of project after generating html documents.The list is separated by commas.

**`commit-message` as (string):** The message of the commit that the generation will perform. *(Default: "Automated creation of documentation")*

**`include-private` as (boolean):** Set to true to include all the privates types and members. *(Default: false)*

**`project-details-json` as (string):** The json file that contains the details of the project, used for header and footer information.

**`template` as (string):** The name of the template to use to generate the webpages from. *(Default: "default")*

**`template-uris-json` as (string):** The json to get all the template files used to generate the documentation.

**`output-extension` as (string):** The output extension that every file built will contain. *(Default: ".html")*

**`output-path` as (string):** The output path of the generated documents. *(Default: "docs/api/")*

**`user-email` as (string):** The email of the user who will commit. *(Default: "csharp.doc.gen@gmail.com")*

**`user-name` as (string):** The name of the user who will commit. *(Default: "C# Document Generator")*

## Sample Build YAML

Below is a sample `build.yml` for generating documentation. If you want to copy and paste, then replace the `binaries`, `user-email`, and `user-name` inputs to something that is more accurate to you. Along with creating a `project-details.json`, that [can be found how to do in the wiki](https://github.com/FuLagann/csharp-docs-generator/wiki/Project-Details-JSON-Format). It is also recommended that the creation of documentation is only for pushing to master (when stable finalized code is being pushed).

```yml
on:
  push:
    branches:
      - master

jobs:
  generate-docs:
    runs-on: windows-latest
    name: Generate Docs
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Setup .NET Core 3.1
        uses: actions/setup-dotnet@v1
        with:
          dotnet-version: "3.1.300"
      - name: Generate Documentation
        uses: FuLagann/csharp-docs-generator@v1
        with:
          build-tasks: dotnet build
          cleanup-tasks: dotnet clean
          binaries: src/Dummy.Library/bin/Debug/netstandard2.0/Dummy.Library.dll
          output-path: docs/api
          user-email: john.doe@gmail.com
          user-name: John Doe
          project-details-json: project-details.json
```

## Formats

There are various JSON formats to follow for various inputs, the following links will take you to a wiki where it describes it's specific format:

* [project-details-json](https://github.com/FuLagann/csharp-docs-generator/wiki/Project-Details-JSON-Format)
* [template-uris-json](https://github.com/FuLagann/csharp-docs-generator/wiki/Template-URIs-JSON-Format)
* [Template API](https://github.com/FuLagann/csharp-docs-generator/wiki/Template-API#base-namespace-template-api)
* [Template API Helper Functions](https://github.com/FuLagann/csharp-docs-generator/wiki/Template-API-Helper-Functions)
* [Base (Namespace) Template API](https://github.com/FuLagann/csharp-docs-generator/wiki/Template-API#base-namespace-template-api)
* [Base (Type) Template API](https://github.com/FuLagann/csharp-docs-generator/wiki/Template-API#base-type-template-api)
* [Event Template API](https://github.com/FuLagann/csharp-docs-generator/wiki/Template-API#event-template-api)
* [Field Template API](https://github.com/FuLagann/csharp-docs-generator/wiki/Template-API#field-template-api)
* [Footer Template API](https://github.com/FuLagann/csharp-docs-generator/wiki/Template-API#footer-template-api)
* [Header Template API](https://github.com/FuLagann/csharp-docs-generator/wiki/Template-API#header-template-api)
* [Method Template API](https://github.com/FuLagann/csharp-docs-generator/wiki/Template-API#method-template-api)
* [Namespace Template API](https://github.com/FuLagann/csharp-docs-generator/wiki/Template-API#namespace-template-api)
* [Navigation Template API](https://github.com/FuLagann/csharp-docs-generator/wiki/Template-API#navigation-template-api)
* [Property Template API](https://github.com/FuLagann/csharp-docs-generator/wiki/Template-API#property-template-api)
* [Type Template API](https://github.com/FuLagann/csharp-docs-generator/wiki/Template-API#type-template-api)

## Using Templates

The action uses premade templates to create web pages with themes without extra work from the end-user. This is done by setting the `template` variable to a known name of a template or a public link to a premade template. The following are the known-named templates that the action currently uses:

* default

The following are templates that are in the works of being implemented:

* default-light
* default-dark
* architect
* cayman
* dinky
* hacker
* leap-day
* merlot
* midnight
* minima
* minimal
* modernist
* slate
* tactile
* time-machine

If you would like to use your own premade template, then just place a public link to the template and the action will promptly use that template.

## Customizing the Template

If you would like to override and customize parts of the premade template you are using, please follow the [wiki guide on customizing the template](https://github.com/FuLagann/csharp-docs-generator/wiki/Customizing-the-Template).

## Creating Your Own Templates

If you would like to create your own template, please follow the [wiki guide on creating your own template](https://github.com/FuLagann/csharp-docs-generator/wiki/Creating-Your-Own-Premade-Template).

## License

This project uses an [MIT](LICENSE) license that grants people to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies.
