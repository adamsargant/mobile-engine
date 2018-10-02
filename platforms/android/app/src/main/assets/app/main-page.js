/*
In NativeScript, a file with the same name as an XML file is known as
a code-behind file. The code-behind is a great place to place your view
logic, and to set up your page’s data binding.
*/

/*
NativeScript adheres to the CommonJS specification for dealing with
JavaScript modules. The CommonJS require() function is how you import
JavaScript modules defined in other files.
*/ 
var Sqlite = require("nativescript-sqlite");
var createViewModel = require("./main-view-model").createViewModel;
var DEBUGMODE = 1;

function onNavigatingTo(args) {
    /*
    This gets a reference this page’s <Page> UI component. You can
    view the API reference of the Page to see what’s available at
    https://docs.nativescript.org/api-reference/classes/_ui_page_.page.html
    */
    var page = args.object;
    var layout = page.getViewById("layout");

    // If we are in Debug Code, we always delete the database first so that the latest copy of the database is used...
    if (DEBUGMODE && Sqlite.exists("test.sqlite")) {
      Sqlite.deleteDatabase("test.sqlite");
      console.log("db deleted");
    }
    if (!Sqlite.exists("test.sqlite")) {
      Sqlite.copyDatabase("test.sqlite");
      console.log("db copied");
    }

    (new Sqlite("test.sqlite")).then(db => {
        db.resultType(Sqlite.RESULTSASOBJECT);
        page.bindingContext = createViewModel(db, layout);
    }, error => {
        console.log("OPEN DB ERROR", error);
    });
    /*
    A page’s bindingContext is an object that should be used to perform
    data binding between XML markup and JavaScript code. Properties
    on the bindingContext can be accessed using the {{ }} syntax in XML.
    In this example, the {{ message }} and {{ onTap }} bindings are resolved
    against the object returned by createViewModel().

    You can learn more about data binding in NativeScript at
    https://docs.nativescript.org/core-concepts/data-binding.
    */
    //page.bindingContext = createViewModel();
}

/*
Exporting a function in a NativeScript code-behind file makes it accessible
to the file’s corresponding XML file. In this case, exporting the onNavigatingTo
function here makes the navigatingTo="onNavigatingTo" binding in this page’s XML
file work.
*/
exports.onNavigatingTo = onNavigatingTo;