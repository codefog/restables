resTables - jQuery plugin for responsive tables
===============================================

The resTables jQuery plugin allows you to easily make your table responsive. It has been created based on the
[stacktable.js](https://johnpolacek.github.io/stacktable.js/) concept by John Polacek.

View demo at http://codefog.github.io/restables/

Installation
------------

You can download the plugin regular way or use the npm to install it:
 
```
npm install restables --save 
```

Usage
-----

The initialization of the plugin is simple:

```js
$(document).ready(function () {
    $('table').resTables();
});
```

Make sure to add the necessary CSS classes to display and hide both tables under certain window sizes:

```css
table.restables-clone {
    display: none;
}

@media (max-width: 991px) {
    table.restables-origin {
        display: none;
    }
    
    table.restables-clone {
        display: table;
    }
}
```

How it works
------------

When the script is initialized it will create a sibling table but with 2-column layout only. Consider the following
table structure:

```html
<table>
    <thead>
        <tr>
            <th>Header 1</th>
            <th>Header 2</th>
            <th>Header 3</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Value A1</td>
            <td>Value A2</td>
            <td>Value A3</td>
        </tr>
        <tr>
            <td>Value B1</td>
            <td>Value B2</td>
            <td>Value B3</td>
        </tr>
    </tbody>
</table>
```

Based on the above the plugin will create a new table with this structure: 
 
```html
<table>
    <tbody>
        <tr>
            <td>Header 1</td>
            <td>Value A1</td>
        </tr>
        <tr>
            <td>Header 2</td>
            <td>Value A2</td>
        </tr>
        <tr>
            <td>Header 3</td>
            <td>Value A3</td>
        </tr>
    </tbody>
    <tbody>
        <tr>
            <td>Header 1</td>
            <td>Value B1</td>
        </tr>
        <tr>
            <td>Header 2</td>
            <td>Value B2</td>
        </tr>
        <tr>
            <td>Header 3</td>
            <td>Value B3</td>
        </tr>
    </tbody>
</table>
```

Options
-------

### merge

Default value: ```{}```

An object containing columns that will be merged with other columns. In the below example columns with indexes
$2 and $3 will be merged with column $1 and column $6 will be merged with column $5.

```js
// Example
$('#my-table').resTables({
    merge: {
        1: [2, 3], 
        5: [6]
    }
});
```

### move

Default value: ```{}```

An object containing columns that will be moved. In the below example column with index $1 will be placed at the top
of the new table (index $0) and column $6 as the second row with index $1.

```js
// Example
$('#my-table').resTables({
    move: {
        1: 0,
        6: 1
    }
});
```

### skip

Default value: ```[]```

An array of columns that should be skipped in the cloned table. In the below example columns with indexes $3 and $5
will not be present in the new table. 

```js
// Example
$('#my-table').resTables({
    skip: [3, 5]
});
```

### span

Default value: ```[]```

An array of columns that should be spanned - the ```colspan="2"``` attribute will be added. In the below example
columns with indexes $2 and $4 will have the ```colspan="2"``` attribute added and will appear as one cell.

```js
// Example
$('#my-table').resTables({
    span: [2, 4]
});
```

### cssClassOrigin

Default value: ```restables-origin```
 
The CSS class that will be added to origin table.

```js
// Example
$('#my-table').resTables({
    cssClassOrigin: 'my-origin-table'
});
```

### cssClassClone

Default value: ```restables-clone```

The CSS class that will be added to cloned table. 

```js
// Example
$('#my-table').resTables({
    cssClassClone: 'my-cloned-table'
});
```

### uniqueAttributes

Default value: ```['id', 'for']```

The list of attributes that should remain unique. Each cloned element containing those attributes will have them
updated by adding the suffix (see ```attributeSuffix``` below).

```js
// Example
$('#my-table').resTables({
    uniqueAttributes: ['id', 'for', 'data-my-id']
});
```

### attributeSuffix

Default value: ```'-restables-clone'```

The suffix that will be added to the unique attributes in the cloned elements.

```js
// Example
$('#my-table').resTables({
    attributeSuffix: '-my-suffix'
});
```

### cloneCallback

Default value: ```null```

The callback that is triggered just before the cloned table is inserted into DOM.

### preserveCellClasses

Default value: ```true```

If true the CSS classes of cells will be preserved in the cloned table element.

```js
// Example
$('#my-table').resTables({
    cloneCallback: function (clone) {
        clone.find('.checkbox').addClass('checkbox-mobile');
    }
});
```
