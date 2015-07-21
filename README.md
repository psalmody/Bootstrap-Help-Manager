# Bootstrap-Help-Manager v 0.5.0

Bootstrap-Help-Manager (BHM) uses [VertebrateJS][3] and [jQuery][2] to provide a framework and console for managing help icons and content across an entire site.

On the client side, including [VertebrateJS][3] and `bhm.client.min.js` totals around 10k.

The console is provided as a jQuery plugin. It will send ajax requests to the helpers and pages handling scripts to manage the database backend. Two [PHP][4] handlers with a [MySQL][5] database setup have been provided which could be used to provide the necessary functionality. Any other server-side / database method could be created pretty simply.

BHM adds glyphicon help icons to all kinds of HTML elements. When a user clicks the help icon, a bootstrap modal is shown with the help content defined in the console.

The console features basic adding, deleting of pages and helpers, as well as CKEDITOR for editing the help content. Modal size may be defined.

Helpers are defined using [jQuery](1) selectors. The same helper may be applied to multiple elements on the page.

## Requirements & Installation

[jQuery][1], [Bootstrap][2], and [VertebrateJS][3] (included).

## Client-Side Setup

### Install on Pages in Domain

Include [jQuery][1], [Bootstrap][2] and:

```html
<script src="external/vertebratejs/vertebrate.min.js"></script>
<script src="build/bhm.client.js"></script>
```

Initialize [jQuery][1] plugin with proper urls for server-side scripts and
client templates:

```JavaScript
$('body').BHMClient({
    templateurl: "templates/bhm.client.html",
    clienturl: "src/bhm.client.php",
    indexpage: "index.html"
});
```

#### settings

```
templateurl: "/location/of/bhm.client.html",
clienturl: "/location/of/bhm.client.php",
indexpage: "string or array, see below"
```

For `indexpage` the setting can be either string or array. When BHM is unable to find helps for that page, it will try adding that string (or each string in the array) to the end of the `window.location.pathname` and see if that returns a page.

Example:

```
indexpage: ["index.html","index.php","default.php"]
```
or
```
indexpage: "index.html"
```

### Customizing Help icons

Customize the help icons by changing the template located at `templates/bhm.helpers.html`.


## Server-Side Setup

### PHP

The provided PHP scripts only require a MYSQLI connection setup at the top of the file (define `$db` as the connection).

### MySQL

See `sql/MySQL.sql` for default setup scripts.

Default tables are `bhm_pages`, `bhm_helpers` and (since v0.5.0) `bhm_relationships`.

### Console

Include [jQuery][1], [Bootstrap][2] and:

```html
<script src="external/ckeditor/ckeditor.js"></script>
<script src="external/vertebratejs/vertebrate.min.js"></script>
<script src="build/bhm.console.js"></script>
```

And initialize the console with the jQuery plugin, defining urls for templates
and server-side scripts:

```javascript
$(function() {
    $('#helpsManager').BHMConsole({
        templateurl: "templates/bhm.console.html",
        helpersurl: "src/bhm.helpers.php",
        pagesurl: "src/bhm.pages.php"
    });
})
```

## Using the Console

The admin console assigns helpers to DOM elements.

1. Create a new page by clicking "Add New Page" button.
2. At the prompt, enter the full pathname (everything including the / AFTER .com / .net / .edu / .etc. a/k/a `window.location.pathname`)
3. A new page and helper will be automatically created and saved.
4. Set "Field Selecter" as a [jQuery][1] selector that will select the items on that page you would like to add the help icon to.
5. Set the title of the modal dialog window with "Modal Title".
6. Specify the size as large if desired.
7. Edit the modal content with the "Edit" button.
8. Save


Note:

1. Deleting all the helpers for a page will also delete that page from the database.
2. ALWAYS add "index.html" (i.e. the appropriate index/default filename) to the end of the url
for pages. Then use the `indexpage` setting in `$().BHMClient()` at initialization to help
BHM find the correct page model.
3. Helpers may exist on multiple pages. Bootstrap `info` class is added to helpers on multiple pages.

## Notes about Server-Side / Database Setup for non PHP / MySQL Implementation

The setup queries in `src/sql/MySQL.sql` should work for _most_ SQL databases.

Follow the comments in the three PHP files carefully to understand the JSON
data that the client and server JS files expect. Here's a basic help model:

```JSON
helper: {
    "id": "1",                       //unique ID from bhm_helpers
    "field_selecter": ".bhm-helper", //CSS/jQuery selector to attach help icon to
    "large": "1",                    //1 or 0 - 1 is large
    "page_ids": "2,3",               //comma-separated page ids, not used for client
    "title": "Help with Something",  //title of modal when help pops up
    "html": "<p>Modal Content</p>"   //html content of help modal
}
```

Page models are:
```JSON
page: {
    "id": "1",              //unique ID from bhm_pages
    "url": "/foo/bar.html"  //unique URL of page - always include 'index.html'
}
```

[1]: https://jquery.com/
[2]: http://getBootstrap.com
[3]: https://github.com/psalmody/vertebratejs
[4]: http://php.net/
[5]: http://dev.mysql.com/
