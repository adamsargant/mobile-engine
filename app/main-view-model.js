var Observable = require("data/observable").Observable;
var Sqlite = require( "nativescript-sqlite" );
var gestures = require("tns-core-modules/ui/gestures");
const labelModule = require("tns-core-modules/ui/label");
const colorModule = require("tns-core-modules/color");

function createViewModel(db, layout) {
    var viewModel = new Observable();
    var label = new labelModule.Label();

    label.text = 'Click to start';
    label.className = 'h3';
    label.id = 'First passage';
    label.on(gestures.GestureTypes.tap, function (args) {
        console.log(args);
        fetchPassage(db, layout, args.view.id)
    });
    layout.addChild(label);

    return viewModel;
}

function fetchPassage(db, layout, searchTerm) {
        //var searchterm = 'First passage';
    db.get("SELECT * FROM passages WHERE name = ?;", [searchTerm], function(err, row) {
        console.log("searchterm was: ", searchTerm);  // Prints [["Field1", "Field2",...]]
        console.log("Row of data was: ", row);  // Prints [["Field1", "Field2",...]]
        formatPassage(db, layout, row.content);
        //self.set("message", row.content);
    });
}

function formatPassage(db, layout, content) {
    layout.removeChildren();
    //this strips all line breaks.
    //We actually want to detect them and replace them with something that works to add an empty line
    content = content.replace(/(\r\n\t|\n|\r\t)/gm," ");
    var labels = [];
    var links = content.match(/\[\[.*?\]\]/g);
    if( links !== null) {
        var arrayLength = links.length;
        for (var i = 0; i < arrayLength; i++) {
            var slicepoint = content.indexOf(links[i]);
            var temp = content.slice(0, slicepoint);
            console.log(temp)
            console.log(temp.length)

            if (temp.length > 0) {
                labels.push(temp);
                var params = {
                    text: temp,
                    col: "Black"
                }
                buildLabel(db, layout, params);
            }
            labels.push(links[i]);
            var linkstopassage = links[i].replace('[[', '').replace(']]', '').trim().split('->');
            var name = linkstopassage[0];
            var nextpassage = linkstopassage[0]
            if (linkstopassage.length == 2) {
                nextpassage = linkstopassage[1]
            }
            var params = {
                text: name,
                col: "Blue",
                id: nextpassage,
                nextpassage: true
            }
            buildLabel(db, layout, params);
            //and here
            content = content.slice(slicepoint + links[i].length);
        }
        console.log(labels);
    } else {
        var params = {
            text: content,
            col: "Black"
        }
        buildLabel(db, layout, params);
    }
}

function buildLabel(db, layout, params){
    var label = new labelModule.Label();
    label.text = params.text;
    if (params.id !== null) {
        label.id = params.id;
    }
    if (params.nextpassage !== null && params.nextpassage) {
        label.on(gestures.GestureTypes.tap, function (args) {
            fetchPassage(db, layout, args.view.id)
        });
    }
    label.textWrap = true;
    label.className = 'standard';
    label.style.color = new colorModule.Color(params.col);
    layout.addChild(label)
}

    // if (isAndroid) {
    //     var ss = new android.text.SpannableString("Android is a Software stack");
    //     var ClickableSpanClass = android.text.style.ClickableSpan.extend({
    //         onClick: function (view) {
    //             console.log("on span click");
    //         },
    //         updateDrawState: function (tp) {
    //             this.super.updateDrawState(tp);
    //             tp.setUnderlineText(false);
    //             tp.setColor(new Color("red").android);
    //         }
    //     });

    //     var ClickableSpanClass2 = android.text.style.ClickableSpan.extend({
    //         onClick: function (view) {
    //             console.log("on span click2");

    //         },
    //         updateDrawState: function (tp) {
    //             this.super.updateDrawState(tp);
    //             tp.setUnderlineText(false);
    //         }
    //     });
    //     var clickablespan = new ClickableSpanClass();
    //     var clickablespan2 = new ClickableSpanClass2();

    //     ss.setSpan(clickablespan, 0, 7, 33);
    //     ss.setSpan(clickablespan2, 13, 21, 33);

    //     textview.android.setText(ss);
    //     textview.android.setMovementMethod(android.text.method.LinkMovementMethod.getInstance());
    // } else if (isIOS) {
    //     var tv = <any>textview;

    //     var attrsting = NSMutableAttributedString.alloc().initWithString("test ala bala"); // lenght == 13


    //     attrsting.addAttributeValueRange(NSForegroundColorAttributeName, UIColor.redColor, { location: 0, length: 13 }); // apply the default color for your whole TetView (0. 13)
    //     // attrsting.addAttributeValueRange(NSForegroundColorAttributeName, UIColor.greenColor, { location: 6, length: 2 }); // apply the color for your clickable spans
    //     attrsting.addAttributeValueRange(NSLinkAttributeName, "link", { location: 6, length: 2 });
    //     // attrsting.addAttributeValueRange(NSForegroundColorAttributeName, UIColor.brownColor, { location: 9, length: 3 }); // apply the color for your clickable spans
    //     attrsting.addAttributeValueRange(NSLinkAttributeName, "linkPhone", { location: 9, length: 3 });

    //     tv.ios.text = undefined;
    //     tv.ios.attributedText = attrsting;

    //     var uiTextView = tv.ios;

    //     let dictionary = new NSDictionary(
    //         [UIColor.greenColor],
    //         [NSForegroundColorAttributeName]
    //     )

    //     tv.ios.linkTextAttributes = dictionary;

    //     let newDelegate = delegateModule.newUITextViewDelegateImpl.initWithOriginalDelegate(tv._delegate);
    //     tv._delegate = newDelegate;

    //     uiTextView.delegate = newDelegate;
    // }

exports.createViewModel = createViewModel;