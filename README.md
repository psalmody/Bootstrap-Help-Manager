# Bootstrap-Help-Manager

Bootstrap-Help-Manager (BHM) uses VertebrateJS and jQuery to provide a framework and console for managing help icons and content across an entire site.

The console can be plugged in to any admin area to handle the MySQL database full of pages and helpers.

BHM adds glyphicon help icons to all kinds of HTML elements. When a user clicks the help icon, a bootstrap modal is shown with the help content defined in the console.

The console features basic adding, deleting of pages and helpers, as well as CKEDITOR for editing the help content. Modal size may be defined.

Helpers are defined using [jQuery](1) selectors. The same helper may be applied to multiple elements on the page.

## Requirements

[jQuery][1], [Bootstrap][2], and [VertebrateJS][3] (included).

## Client-Side Setup

### Variables

1. Change `templateurl` variable in `js/bhm.helpers.js` to full relative bath to `tempaltes/bhm.helpers.html`
2. Change `BHM.helpersurl` and `BHM.pagesurl` in `js/bhm.vertebrate.js` to the full relative path for the server-side handler scripts. PHP starter scripts are provided: `bhm.helpers.php` and `bhm.pages.php`. See the section [Server-Side Setup](#serverside) below.

## Server-Side Setup

### PHP

The provided PHP scripts only require a MYSQLI connection setup at the top of the file (define `$db` as the connection).

### MySQL

See `sql/setup.sql` for default setup scripts.



[1]: https://jquery.com/
[2]: http://getBootstrap.com
[3]: https://github.com/psalmody/vertebratejs
