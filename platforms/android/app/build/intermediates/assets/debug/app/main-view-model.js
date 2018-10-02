var Observable = require("data/observable").Observable;
var Sqlite = require( "nativescript-sqlite" );

var array;
var jsonData;



function createViewModel(db) {
    var viewModel = new Observable();
    viewModel.message = "test";

    viewModel.onTap = function() {
        this.set("message", "testing");
        var self = this;
        var searchterm = 'First passage';
        db.get("SELECT * FROM passages WHERE name = ?;", [searchterm], function(err, row) {
            console.log("Row of data was: ", row);  // Prints [["Field1", "Field2",...]]
            self.set("message", 'done');
            self.set("message", row[2]);
        });

        // db.get('SELECT * FROM passages WHERE name = ?', ['somewhere'], function(err, row) {
        //   console.log("Row of data was: ", row);  // Prints [["Field1", "Field2",...]]
        // });

        // db.all("SELECT * FROM passages").then(rows => {
        //     for(var row in rows) {
        //         console.log("RESULT", rows[row]);
        //     }
        // }, error => {
        //     console.log("SELECT ERROR", error);
        // });
    }

    return viewModel;
}

exports.createViewModel = createViewModel;