# WP Sockets (JS)

A flexible, React-based library for building WordPress Admin Pages using native WordPress components.

## Overview

`@wp-sockets/js` provides a declarative way to build complex WordPress admin interfaces using a "socket" architecture. It leverages standard `@wordpress/components` to ensure your admin pages look and feel native to WordPress.

## Features

*   **Native Look & Feel**: Built on top of `@wordpress/components`.
*   **Declarative Configuration**: Define your UI structure using simple JSON-like objects.
*   **Extensible**: Easily register custom socket types.
*   **State Management**: Built-in data helpers for handling options and user meta.
*   **Responsive**: Built-in responsive grid system.

## Requirements

The package ships **two builds**, because core's DataForms cannot run on every
supported WordPress:

| Build | Entry | `dataform` sockets render as | WordPress |
| --- | --- | --- | --- |
| Default | `@andreilupu/wp-sockets-js` | core DataForms | **7.0+** |
| Legacy | `@andreilupu/wp-sockets-js/legacy` | standard socket controls | **6.x** |

DataViews is bundled (WordPress does not ship it), and its dependency chain needs
the `wp-theme` script handle — WordPress 7.0 registers it, 6.8 does not. The
legacy build never imports DataViews, so its generated asset file lists only
handles that have existed for years. It is also far smaller: ~12 KB of JS and
under 1 KB of CSS, against ~260 KB and ~90 KB.

**Pick per request in PHP** — see [Choosing a build](#choosing-a-build). Getting
it wrong is not a soft failure: WordPress silently declines to print a script
whose declared dependency is missing, and skips its whole dependency chain, so
the default build on 6.x renders a blank page.

The same socket configuration works against either build, so you write your
settings once.

## Installation

```bash
npm install @wp-sockets/js
```

## Usage

### 1. Enqueue Assets (PHP)

First, ensure you have a WordPress admin page registered and assets enqueued. You can use the companion PHP library (coming soon) or manually enqueue your script.

### 2. Initialize the App (JS)

In your JavaScript entry point:

```javascript
import { createSocketsWpRoot } from '@wp-sockets/js';

// Configuration for your admin page
const config = {
    selector: '#my-admin-page-root', // The DOM element ID
    mode: 'tabs', // 'tabs' or 'panel'
    title: 'My Admin Page',
    withSaveButton: true,
    autosave: false,
    sockets: [
        {
            id: 'general_settings',
            type: 'group',
            label: 'General Settings',
            children: [
                {
                    id: 'my_text_field',
                    type: 'text',
                    label: 'Example Text Field',
                },
                {
                    id: 'my_textarea',
                    type: 'textarea',
                    label: 'Description',
                }
            ]
        }
    ]
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    createSocketsWpRoot('my_app_id', config);
});
```

## Available Socket Types

*   `text`: Simple text input.
*   `textarea`: Textarea input.
*   `number`: Number input.
*   `group`: Container for other sockets, supports grid layouts.
*   `repeater`: Repeatable list of sockets.
*   `dataform`: Renders its children with core's DataForms. See below.

## The `dataform` socket (experimental)

`dataform` renders its children through `DataForm` from
`@wordpress/dataviews` — the same form component core is standardising on —
instead of the hand-rolled socket controls. It is opt-in per socket, so a page
can adopt DataForms one section at a time:

```php
[
    'id'       => 'connection',
    'type'     => 'dataform',
    'label'    => 'Connection',
    'layout'   => 'regular', // regular | panel | card | row
    'children' => [
        [ 'id' => 'api_url', 'type' => 'text',     'label' => 'API URL' ],
        [ 'id' => 'enabled', 'type' => 'checkbox', 'label' => 'Enabled' ],
        [
            'id'      => 'model',
            'type'    => 'select',
            'label'   => 'Model',
            'choices' => [ 'fast', 'accurate' ],
        ],
    ],
]
```

What carries over unchanged:

*   **Persistence.** `DataForm` is a controlled component, so the existing
    `dataHelper` remains the owner of state — the option, user-meta and
    apiFetch helpers all keep working, as does the save button.
*   **Custom socket types.** A child whose type has no native DataForms
    equivalent is still resolved through the
    `{appId}Sockets.socketType{Type}` filter and rendered as a DataForms
    custom control, so existing custom sockets need no changes.
*   **Nothing is dropped.** `repeater` and `object` children cannot be
    expressed as DataForms fields, so they are rendered after the form by the
    normal WP Sockets renderer.

### Choosing the control

A DataForms field's `type` is its *data* type and does not by itself pick a
widget, so `textarea`, `toggle`, `radio` and `toggleGroup` sockets are mapped to
the matching named DataForms control — a `textarea` socket keeps a multiline
input rather than degrading to a single-line one. Any socket can also name a
control explicitly, which wins over the default for its type:

```php
[ 'id' => 'position', 'type' => 'text', 'control' => 'toggleGroup' ]
```

### Stylesheet

The package exports its stylesheet, which also carries the DataViews styles the
`dataform` socket needs. Import it in your own entry point so it is emitted into
your plugin's build:

```js
import '@andreilupu/wp-sockets-js/style.css';
```

Prefer this over enqueueing `node_modules/.../dist/index.css` directly: that
directory is a build-time artifact that should not be web-served, and it does
not resolve with linked or hoisted installs.

### Requirements and caveats

*   **Needs the default build, so WordPress 7.0+** — on 6.x the legacy build
    renders the same children with standard controls. See
    [Requirements](#requirements).
*   **The runtime guard is not the version story.** `canUseDataForms()` checks
    for the host singletons and degrades to the standard socket renderer if they
    are missing, and the DataForm is wrapped in an error boundary that degrades
    the same way rather than showing a dead panel. That protects against
    DataViews failing *once loaded*. It cannot rescue the default build on 6.x,
    where the script never executes at all — that is what the legacy build is
    for.
*   **Bundle size.** DataViews costs ~250 KB of JS and ~89 KB of CSS, and every
    page using the default build pays it even if it has no `dataform` socket.
    Splitting DataViews into a separately enqueued chunk is still worth doing.
*   **Values are flattened.** DataForms keeps a flat field list, so a `group`
    nested inside a `dataform` contributes its children to the same value
    namespace and only nests visually.
*   **`repeater` and `object` children** cannot be expressed as DataForms fields,
    so they render after the form via the standard renderer.
*   **Asynchronous `choices`** (a resolver function, mapped to DataForms'
    `getElements`) only work in the default build. The legacy `select` socket
    takes a static list and renders an empty control for a resolver.
*   The DataForms field API is still stabilising upstream, so treat this socket
    as experimental and keep `@wordpress/dataviews` pinned.

## Choosing a build

Build both variants and enqueue whichever the current WordPress can run. Test
for the capability rather than comparing `$wp_version`, so a site running the
Gutenberg plugin over an older core is judged correctly:

```php
/**
 * `wp-theme` is the handle DataViews' dependency chain needs; WordPress 7.0
 * registers it, 6.8 does not.
 */
function myplugin_asset_name() {
	return wp_script_is( 'wp-theme', 'registered' ) ? 'index' : 'index-legacy';
}

add_action( 'admin_enqueue_scripts', function () {
	$asset      = myplugin_asset_name();
	$asset_file = include plugin_dir_path( __FILE__ ) . "build/{$asset}.asset.php";

	wp_enqueue_script(
		'myplugin',
		plugin_dir_url( __FILE__ ) . "build/{$asset}.js",
		$asset_file['dependencies'],
		$asset_file['version'],
		true
	);
	wp_enqueue_style(
		'myplugin',
		plugin_dir_url( __FILE__ ) . "build/{$asset}.css",
		[ 'wp-components' ],
		$asset_file['version']
	);
} );
```

On the JavaScript side, have two entry points — one importing
`@andreilupu/wp-sockets-js`, the other `@andreilupu/wp-sockets-js/legacy` (and
its `legacy/style.css`) — and build each as its own webpack compilation. Two
entries in a single config share one extracted stylesheet, which would hand the
legacy build the DataViews CSS it has no use for.

The `examples/npm-plugin` example in
[wp-sockets-examples](https://github.com/andreilupu/wp-sockets-examples) does
exactly this, including the webpack configuration.

## Data helper API: `setSettings`

Data helpers now expose `setSettings( { id: value, ... } )` alongside
`setSetting( id, value )`, and **anything that can change more than one setting
at a time must use it**.

`setSetting` spreads the settings snapshot captured during the current render,
so calling it in a loop silently discards every change but the last. The batch
setter applies them as a single edit. Custom data helpers that do not implement
`setSettings` still work — the `dataform` socket falls back to `setSetting`.

## License

GPL-2.0-or-later
