# Bootstrap-Help-Manager

Bootstrap-Help-Manager (BHM) uses [VertebrateJS][3] and [jQuery][2] to provide a framework and console for managing help icons and content across an entire site.

The console is provided as a jQuery plugin. It will send ajax requests to the helpers and pages handling scripts to manage the database backend. Two [PHP][4] handlers with a [MySQL][5] database setup have been provided which could be used to provide the necessary functionality. Any other server-side / database method could be created pretty simply.

BHM adds glyphicon help icons to all kinds of HTML elements. When a user clicks the help icon, a bootstrap modal is shown with the help content defined in the console.

The console features basic adding, deleting of pages and helpers, as well as CKEDITOR for editing the help content. Modal size may be defined.

Helpers are defined using [jQuery](1) selectors. The same helper may be applied to multiple elements on the page.

## Requirements

[jQuery][1], [Bootstrap][2], and [VertebrateJS][3] (included).

## Client-Side Setup

### Variables

1. Change `templateurl` variable in `js/bhm.helpers.js` to full relative bath to `tempaltes/bhm.helpers.html`
2. Change `BHM.helpersurl` and `BHM.pagesurl` in `js/bhm.vertebrate.js` to the full relative path for the server-side handler scripts. PHP starter scripts are provided: `bhm.helpers.php` and `bhm.pages.php`. See the section [Server-Side Setup](#serverside) below.

### Install on Pages in Domain

Very simple. Include:

```html
<script src="external/tmpl.js"></script>
<script src="js/bhm.vertebrate.js"></script>
<script src="js/bhm.helpers.js"></script>
```

### Customizing Help icons

Customize the help icons by changing the template located at `templates/bhm.helpers.html`.


## Server-Side Setup

### PHP

The provided PHP scripts only require a MYSQLI connection setup at the top of the file (define `$db` as the connection).

### MySQL

See `sql/MySQL.sql` for default setup scripts.

Default tables are `bhm_help_pages` and `bhm_help_modals`.

### Console

Include:

```html
<script src="external/ckeditor/ckeditor.js"></script>
<script src="external/vertebratejs/vertebrate.js"></script>
<script src="external/tmpl.js"></script>
<script src="external/JSONTable.js"></script>
<script src="js/bhm.vertebrate.js"></script>
<script src="js/bhm.console.js"></script>
```

And initialize the console with the jQuery plugin:

```javascript
$(function() {
    $('#helpsManager').ManageHelperConsole({
        ajaxFail: function(xhr) {
            //optional ajax fail function
            checkAjaxForNotAuthorized(xhr);
        }
    });
})
```

## Using the Console

The admin console assigns helpers to DOM elements.

1. Create a new page by clicking "New Page" tab.
2. At the prompt, enter the full pathname (everything, including the / after .com / .net / .edu / .etc)
3. A new page and helper will be automatically created and saved.
4. Set "Field Selecter" as a [jQuery][1] selector that will select the items on that page you would like to add the help icon to.
5. Set the title of the modal dialog window with "Modal Title".
6. Specify the size as large if desired.
7. Edit the modal content with the "Edit" button.
8. Save

Deleting all the helpers for a page will also delete that page from the database.



[1]: https://jquery.com/
[2]: http://getBootstrap.com
[3]: https://github.com/psalmody/vertebratejs
[4]: http://php.net/
[5]: http://dev.mysql.com/